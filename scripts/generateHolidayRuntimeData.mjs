import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

import { dirname, resolve } from 'node:path';

import { fileURLToPath } from 'node:url';

/* ===========================================================
   CAMINHOS DOS DADOS DE EXECUÇÃO

   O cache completo continua sendo a fonte de manutenção. Para
   o navegador, cada país recebe um arquivo pequeno e independente.
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const translationCachePath = resolve(
  projectDirectory,
  'src/holidays/generated/holidayTranslations.json',
);
const dateHolidayCachePath = resolve(projectDirectory, 'src/holidays/generated/dateHolidays.json');
const translationOutputDirectory = resolve(projectDirectory, 'public/holiday-data/translations');
const dateHolidayOutputDirectory = resolve(projectDirectory, 'public/holiday-data/date-holidays');

/* ===========================================================
   GERAÇÃO DOS PACOTES POR PAÍS
=========================================================== */

const translationCache = JSON.parse(await readFile(translationCachePath, 'utf8'));
const countryTranslations = translationCache.translations || {};

await rm(translationOutputDirectory, { recursive: true, force: true });
await mkdir(translationOutputDirectory, { recursive: true });

for (const [countryCode, translations] of Object.entries(countryTranslations)) {
  const outputPath = resolve(translationOutputDirectory, `${countryCode.toUpperCase()}.json`);

  await writeFile(outputPath, `${JSON.stringify(translations)}\n`, 'utf8');
}

/* Remove qualquer arquivo que não corresponda à geração atual.
   A conferência também protege contra nomes de país inválidos. */
const generatedFiles = (await readdir(translationOutputDirectory)).sort();
const expectedFiles = Object.keys(countryTranslations)
  .map((countryCode) => `${countryCode.toUpperCase()}.json`)
  .sort();

if (JSON.stringify(generatedFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error('Os pacotes de tradução por país não foram gerados integralmente.');
}

console.log(
  `Pacotes de tradução preparados para ${generatedFiles.length} países em public/holiday-data.`,
);

/* ===========================================================
   PACOTES CIVIS POR PAÍS

   A base integral permanece no código-fonte para manutenção e
   auditoria. O navegador recebe apenas os nomes compartilhados e
   o país selecionado, incluindo calendários territoriais herdados.
=========================================================== */

const dateHolidayCache = JSON.parse(await readFile(dateHolidayCachePath, 'utf8'));
const allDateHolidayCountries = dateHolidayCache.holidays || {};
const dateHolidayCountryCodes = Object.keys(allDateHolidayCountries).sort();

/* Algumas jurisdições reutilizam as regras de outro país por meio
   de `_days`. O fechamento transitivo garante que cada pacote seja
   autossuficiente sem carregar os demais países no navegador. */
function collectReferencedCountries(value, referencedCountries = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReferencedCountries(item, referencedCountries));
    return referencedCountries;
  }

  if (!value || typeof value !== 'object') {
    return referencedCountries;
  }

  Object.entries(value).forEach(([key, item]) => {
    if (key === '_days') {
      const referencedCode = String(Array.isArray(item) ? item[0] : item).toUpperCase();

      if (Object.hasOwn(allDateHolidayCountries, referencedCode)) {
        referencedCountries.add(referencedCode);
      }
    }

    collectReferencedCountries(item, referencedCountries);
  });

  return referencedCountries;
}

function createCountryHolidayPackage(countryCode) {
  const includedCountries = new Set([countryCode]);
  const pendingCountries = [countryCode];

  while (pendingCountries.length > 0) {
    const currentCountry = pendingCountries.shift();
    const referencedCountries = collectReferencedCountries(allDateHolidayCountries[currentCountry]);

    referencedCountries.forEach((referencedCountry) => {
      if (!includedCountries.has(referencedCountry)) {
        includedCountries.add(referencedCountry);
        pendingCountries.push(referencedCountry);
      }
    });
  }

  return {
    version: dateHolidayCache.version,
    license: dateHolidayCache.license,
    holidays: Object.fromEntries(
      [...includedCountries]
        .sort()
        .map((includedCountry) => [includedCountry, allDateHolidayCountries[includedCountry]]),
    ),
  };
}

const dateHolidayCountriesDirectory = resolve(dateHolidayOutputDirectory, 'countries');

await rm(dateHolidayOutputDirectory, { recursive: true, force: true });
await mkdir(dateHolidayCountriesDirectory, { recursive: true });
await writeFile(
  resolve(dateHolidayOutputDirectory, 'names.json'),
  `${JSON.stringify(dateHolidayCache.names || {})}\n`,
  'utf8',
);

for (const countryCode of dateHolidayCountryCodes) {
  await writeFile(
    resolve(dateHolidayCountriesDirectory, `${countryCode}.json`),
    `${JSON.stringify(createCountryHolidayPackage(countryCode))}\n`,
    'utf8',
  );
}

const generatedCountryFiles = (await readdir(dateHolidayCountriesDirectory)).sort();
const expectedCountryFiles = dateHolidayCountryCodes.map((countryCode) => `${countryCode}.json`);

if (JSON.stringify(generatedCountryFiles) !== JSON.stringify(expectedCountryFiles)) {
  throw new Error('Os pacotes civis por país não foram gerados integralmente.');
}

console.log(
  `Pacotes civis preparados para ${generatedCountryFiles.length} países em public/holiday-data.`,
);
