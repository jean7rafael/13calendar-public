import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ===========================================================
   ARQUIVOS E PARÂMETROS
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const countryCatalog = JSON.parse(
  await readFile(resolve(projectDirectory, 'src/holidays/generated/holidayCountries.json'), 'utf8'),
);
const appendix = JSON.parse(
  await readFile(
    resolve(projectDirectory, 'src/holidays/generated/officialHolidayAppendix.json'),
    'utf8',
  ),
);

const yearArgument = process.argv.find((argument) => argument.startsWith('--year='));
const forceSupportedCountries = process.argv.includes('--all-supported');
const now = new Date();
const targetYear = yearArgument
  ? Number(yearArgument.split('=')[1])
  : now.getUTCMonth() === 11
    ? now.getUTCFullYear() + 1
    : now.getUTCFullYear();

if (!Number.isInteger(targetYear)) {
  throw new Error('Use --year=AAAA para informar o ano da varredura.');
}

/* ===========================================================
   DECISÃO DO FALLBACK DA BASE PRINCIPAL

   Os 45 países do apêndice são sempre consultados. Os 206 da
   base principal entram quando a versão estiver há 120 dias sem
   atualização ou quando --all-supported for solicitado.
=========================================================== */

const databaseDate = new Date(`${countryCatalog.databaseVersion}T00:00:00Z`);
const databaseAgeDays = Number.isNaN(databaseDate.getTime())
  ? Number.POSITIVE_INFINITY
  : Math.floor((now.getTime() - databaseDate.getTime()) / 86_400_000);
const scanSupportedCountries = forceSupportedCountries || databaseAgeDays >= 120;

function normalizeSources(sources, origin) {
  return (sources || [])
    .filter(({ url, kind }) => /^https?:\/\//i.test(url || '') && (origin !== 'base' || kind === 'source'))
    .map(({ title, url }) => ({
      title: title || url,
      url,
      origin,
    }));
}

const targetsByCountry = new Map();

Object.entries(appendix.countries || {}).forEach(([countryCode, country]) => {
  targetsByCountry.set(countryCode, normalizeSources(country.sources, 'official-appendix'));
});

if (scanSupportedCountries) {
  countryCatalog.countries
    .filter(({ hasHolidayData }) => hasHolidayData)
    .forEach((country) => {
      const currentSources = targetsByCountry.get(country.code) || [];
      const additionalSources = normalizeSources(country.sources, 'base');
      const sourcesByUrl = new Map(
        [...currentSources, ...additionalSources].map((source) => [source.url, source]),
      );

      targetsByCountry.set(country.code, [...sourcesByUrl.values()]);
    });
}

/* ===========================================================
   EXTRAÇÃO DE CANDIDATOS

   A rotina não publica feriados. Ela guarda trechos que contêm
   o ano-alvo ou datas reconhecíveis para revisão no pull request.
=========================================================== */

const monthPattern =
  'January|February|March|April|May|June|July|August|September|October|November|December';
const candidatePattern = new RegExp(
  `(?:\\b${targetYear}[-/.]\\d{1,2}[-/.]\\d{1,2}\\b|` +
    `\\b\\d{1,2}[-/.]\\d{1,2}[-/.]${targetYear}\\b|` +
    `\\b(?:${monthPattern})\\s+\\d{1,2}(?:,)?\\s+${targetYear}\\b|` +
    `\\b\\d{1,2}\\s+(?:${monthPattern})\\s+${targetYear}\\b)`,
  'i',
);

function normalizeText(content) {
  return String(content || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ');
}

function extractCandidateLines(text) {
  return normalizeText(text)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && (line.includes(String(targetYear)) || candidatePattern.test(line)))
    .slice(0, 80)
    .map((line) => line.slice(0, 500));
}

async function inspectSource(countryCode, source) {
  const inspectedAt = new Date().toISOString();

  try {
    const response = await fetch(source.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(30_000),
      headers: {
        accept: 'text/html,application/json,text/plain,application/pdf,*/*;q=0.5',
        'user-agent': 'Calendar13OfficialHolidayMonitor/1.0 (+local reviewed dataset)',
      },
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    const textContent = /html|json|text|xml|calendar/i.test(contentType)
      ? bytes.toString('utf8')
      : '';

    return {
      country: countryCode,
      ...source,
      inspectedAt,
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      contentType,
      bytes: bytes.length,
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: createHash('sha256').update(bytes).digest('hex'),
      targetYearMentioned: textContent.includes(String(targetYear)),
      candidates: extractCandidateLines(textContent),
      manualDocumentReview: !textContent && bytes.length > 0,
    };
  } catch (error) {
    return {
      country: countryCode,
      ...source,
      inspectedAt,
      ok: false,
      error: error.message,
      candidates: [],
    };
  }
}

/* ===========================================================
   EXECUÇÃO COM CONCORRÊNCIA LIMITADA
=========================================================== */

const pendingSources = [...targetsByCountry.entries()].flatMap(([countryCode, sources]) =>
  sources.map((source) => ({ countryCode, source })),
);
const results = [];
const concurrency = 6;

for (let index = 0; index < pendingSources.length; index += concurrency) {
  const batch = pendingSources.slice(index, index + concurrency);
  results.push(
    ...(await Promise.all(
      batch.map(({ countryCode, source }) => inspectSource(countryCode, source)),
    )),
  );
}

/* ===========================================================
   RELATÓRIO VERSIONADO PARA REVISÃO
=========================================================== */

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  targetYear,
  reviewRequired: true,
  databaseVersion: countryCatalog.databaseVersion,
  databaseAgeDays,
  supportedCountriesScanned: scanSupportedCountries,
  summary: {
    countries: new Set(results.map(({ country }) => country)).size,
    sources: results.length,
    successfulSources: results.filter(({ ok }) => ok).length,
    sourcesWithCandidates: results.filter(({ candidates }) => candidates.length > 0).length,
    manualDocuments: results.filter(({ manualDocumentReview }) => manualDocumentReview).length,
  },
  results,
};
const outputDirectory = resolve(projectDirectory, 'holiday-source-review/generated');
const outputFile = resolve(outputDirectory, `${targetYear}.json`);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(
  `Varredura oficial concluída: ${report.summary.sources} fontes, ` +
    `${report.summary.sourcesWithCandidates} com candidatos para ${targetYear}.`,
);
