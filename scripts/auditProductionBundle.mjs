import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { gzipSync } from 'node:zlib';

/* ===========================================================
   LIMITES DO PACOTE PÚBLICO

   Os valores possuem uma margem sobre o build validado. Eles não
   tentam substituir uma medição real de navegador: impedem apenas
   que uma alteração faça o download inicial crescer silenciosamente.
=========================================================== */

const limits = {
  /* O capturador do planner vive em um chunk assíncrono: só é baixado quando
     alguém pede o PDF. O teto total inclui esse recurso sem transformar seu
     custo opcional em regressão silenciosa para os demais pacotes. */
  /* As explicações fiscal, escolar e de feriados vivem no chunk assíncrono
     de Aprenda. A margem cobre os 12 idiomas sem afrouxar os tetos por arquivo. */
  totalRaw: 3_350_000,
  // Reserva a variação observada entre o zlib do macOS e do runner Linux e o
  // balão multilíngue aprovado, mantendo menos de 4 KiB livres no CI atual.
  totalGzip: 845_000,
  largestRaw: 1_900_000,
  largestGzip: 360_000,
};

const assetsDirectory = resolve('dist/ssg/assets');
const assetNames = (await readdir(assetsDirectory)).filter((name) => /\.(?:css|js)$/i.test(name));
const publicEnvironment = parseEnv(await readFile(resolve('.env.production'), 'utf8'));

if (assetNames.length === 0) {
  throw new Error('Nenhum JavaScript ou CSS foi encontrado em dist/ssg/assets.');
}

/* ===========================================================
   MEDIÇÃO RAW E COMPACTADA
=========================================================== */

const measurements = await Promise.all(
  assetNames.map(async (name) => {
    const path = resolve(assetsDirectory, name);
    const [metadata, content] = await Promise.all([stat(path), readFile(path)]);

    return {
      name,
      raw: metadata.size,
      gzip: gzipSync(content, { level: 9 }).length,
      source: name.endsWith('.js') ? content.toString('utf8') : '',
    };
  }),
);

/* ===========================================================
   INTEGRAÇÕES PÚBLICAS COMPILADAS

   A configuração destas integrações não contém segredos, mas precisa
   existir no JavaScript final. Isso protege a passagem do Quasar v2
   para o v3, que mudou o prefixo padrão e os arquivos dotenv lidos.
=========================================================== */

const requiredPublicEnvironmentKeys = [
  'VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN',
  'VITE_COMMUNITY_REGISTRATION_URL',
  'VITE_TURNSTILE_SITE_KEY',
  'VITE_PUBLIC_SITE_URL',
];
const clientJavaScript = measurements.map(({ source }) => source).join('\n');
const missingPublicEnvironmentKeys = requiredPublicEnvironmentKeys.filter((key) => {
  const value = String(publicEnvironment[key] || '').trim();
  return !value || !clientJavaScript.includes(value);
});

if (missingPublicEnvironmentKeys.length > 0) {
  throw new Error(
    `Integrações públicas ausentes do pacote:\n- ${missingPublicEnvironmentKeys.join('\n- ')}`,
  );
}

console.log(
  `Integrações públicas compiladas: ${requiredPublicEnvironmentKeys.length} configurações presentes.`,
);

const totals = measurements.reduce(
  (result, item) => ({
    raw: result.raw + item.raw,
    gzip: result.gzip + item.gzip,
  }),
  { raw: 0, gzip: 0 },
);

const largestRaw = measurements.toSorted((a, b) => b.raw - a.raw)[0];
const largestGzip = measurements.toSorted((a, b) => b.gzip - a.gzip)[0];

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

const failures = [
  totals.raw > limits.totalRaw &&
    `total bruto ${formatBytes(totals.raw)} > ${formatBytes(limits.totalRaw)}`,
  totals.gzip > limits.totalGzip &&
    `total gzip ${formatBytes(totals.gzip)} > ${formatBytes(limits.totalGzip)}`,
  largestRaw.raw > limits.largestRaw &&
    `${largestRaw.name} bruto ${formatBytes(largestRaw.raw)} > ${formatBytes(limits.largestRaw)}`,
  largestGzip.gzip > limits.largestGzip &&
    `${largestGzip.name} gzip ${formatBytes(largestGzip.gzip)} > ${formatBytes(limits.largestGzip)}`,
].filter(Boolean);

console.log(
  `Pacote auditado: ${assetNames.length} arquivos, ` +
    `${formatBytes(totals.raw)} brutos e ${formatBytes(totals.gzip)} em gzip.`,
);
console.log(
  `Maior arquivo: ${largestRaw.name}, ${formatBytes(largestRaw.raw)} bruto e ` +
    `${formatBytes(largestRaw.gzip)} em gzip.`,
);

if (failures.length > 0) {
  throw new Error(`O pacote ultrapassou o orçamento:\n- ${failures.join('\n- ')}`);
}
