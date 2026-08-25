import { execFile } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import worldCountries from 'world-countries';

/* ===========================================================
   CAMINHOS DO PROJETO E DA BASE INTERNACIONAL
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const require = createRequire(import.meta.url);
const dateHolidaysPackage = require.resolve('date-holidays/package.json');
const dateHolidaysDirectory = dirname(dateHolidaysPackage);
const dateHolidaysParserPackage = require.resolve('date-holidays-parser/package.json');
const dateHolidaysParserDirectory = dirname(dateHolidaysParserPackage);
const generatorPath = resolve(dateHolidaysDirectory, 'scripts/holidays2json.cjs');
const countriesDirectory = resolve(dateHolidaysDirectory, 'data/countries');
const sourceDataPath = resolve(dateHolidaysDirectory, 'data/holidays.json');
const generatedPackageFiles = [
  sourceDataPath,
  resolve(dateHolidaysDirectory, 'src/data.js'),
  resolve(dateHolidaysDirectory, 'lib/data.cjs'),
];
const outputDataPath = resolve(projectDirectory, 'src/holidays/generated/dateHolidays.json');
const outputCountriesPath = resolve(
  projectDirectory,
  'src/holidays/generated/holidayCountries.json',
);

const runFile = promisify(execFile);

/* ===========================================================
   MECANISMOS OBRIGATÓRIOS DO PARSER

   Esta verificação impede que uma geração reduzida remova
   silenciosamente calendários usados por alguns países.
=========================================================== */

const REQUIRED_CALENDAR_MECHANISMS = Object.freeze([
  'julian',
  'hebrew',
  'islamic',
  'jalaali',
  'equinox',
  'chinese',
  'korean',
  'vietnamese',
  'bengali-revised',
]);

async function validateCalendarMechanisms() {
  const factoryPath = resolve(dateHolidaysParserDirectory, 'src/CalEventFactory.js');
  const factorySource = await readFile(factoryPath, 'utf8');
  const missingMechanisms = REQUIRED_CALENDAR_MECHANISMS.filter(
    (mechanism) => !factorySource.includes(`case '${mechanism}'`),
  );

  if (missingMechanisms.length > 0) {
    throw new Error(
      `O parser está sem mecanismos obrigatórios: ${missingMechanisms.join(', ')}. ` +
        'Reinstale date-holidays-parser antes de gerar a base.',
    );
  }
}

/* ===========================================================
   PAÍSES OFERECIDOS PELA FONTE

   A pasta data/countries é a autoridade da lista. Assim,
   uma atualização futura da dependência pode acrescentar um
   país sem exigir uma segunda lista manual no aplicativo.
=========================================================== */

async function discoverProviderCountryCodes() {
  const files = await readdir(countriesDirectory);

  return files
    .filter((fileName) => /^[A-Z]{2}\.yaml$/.test(fileName) && fileName !== '0.yaml')
    .map((fileName) => fileName.replace(/\.yaml$/, ''))
    .sort();
}

/* ===========================================================
   CATÁLOGO GEOGRÁFICO COMPLETO

   A lista exibida combina todos os códigos ISO conhecidos por
   world-countries com os códigos adicionais da fonte de feriados,
   como as Ilhas Canárias. Um país pode existir no catálogo mesmo
   quando ainda não possui calendário civil na date-holidays.
=========================================================== */

function discoverCatalogCountryCodes(providerCountryCodes) {
  const worldCountryCodes = worldCountries
    .map(({ cca2 }) => cca2)
    .filter((countryCode) => /^[A-Z]{2}$/.test(countryCode));

  return [...new Set([...worldCountryCodes, ...providerCountryCodes])].sort();
}

/* ===========================================================
   CONTINENTE E HEMISFÉRIO
=========================================================== */

const continentByRegion = Object.freeze({
  Americas: 'americas',
  Europe: 'europe',
  Africa: 'africa',
  Asia: 'asia',
  Oceania: 'oceania',
  Antarctic: 'antarctica',
});

const countryMetadataOverrides = Object.freeze({
  IC: Object.freeze({
    region: 'Africa',
    subregion: 'Northern Africa',
    latitude: 28.2916,
    longitude: -16.6291,
  }),
});

function resolveGeography(countryCode) {
  const worldCountry = worldCountries.find(({ cca2 }) => cca2 === countryCode);
  const override = countryMetadataOverrides[countryCode];
  const region = override?.region || worldCountry?.region;
  const subregion = override?.subregion || worldCountry?.subregion || '';
  const latitude = override?.latitude ?? worldCountry?.latlng?.[0];
  const longitude = override?.longitude ?? worldCountry?.latlng?.[1];
  const continent = continentByRegion[region];

  if (!continent || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error(`Metadados geográficos ausentes para ${countryCode}.`);
  }

  return {
    continent,
    hemisphere: latitude < 0 ? 'south' : 'north',
    region,
    subregion,
    latitude,
    longitude,
  };
}

/* ===========================================================
   FONTES DECLARADAS NOS ARQUIVOS DOS PAÍSES

   @source identifica uma fonte de calendário; @attrib registra
   uma referência complementar mantida pelo projeto original.
=========================================================== */

function normalizeSourceUrl(url) {
  const normalizedUrl = String(url || '').trim();

  if (!normalizedUrl || normalizedUrl === '-') {
    return null;
  }

  if (/^www\./i.test(normalizedUrl)) {
    return `https://${normalizedUrl}`;
  }

  return normalizedUrl;
}

async function readCountrySources(countryCode) {
  const countryFile = resolve(countriesDirectory, `${countryCode}.yaml`);
  const fileContent = await readFile(countryFile, 'utf8');
  const sources = [];
  const sourcePattern = /^\s*#\s+@(source|attrib)\s+(.+)$/gm;

  for (const match of fileContent.matchAll(sourcePattern)) {
    const url = normalizeSourceUrl(match[2]);

    if (url && !sources.some((source) => source.url === url)) {
      sources.push({
        kind: match[1] === 'source' ? 'source' : 'attribution',
        url,
      });
    }
  }

  return sources;
}

async function createCountryMetadata(countryCodes, providerCountryCodes, databaseVersion) {
  const providerCountryCodeSet = new Set(providerCountryCodes);

  const countries = await Promise.all(
    countryCodes.map(async (code) => ({
      code,
      ...resolveGeography(code),
      hasHolidayData: providerCountryCodeSet.has(code),
      sources: providerCountryCodeSet.has(code) ? await readCountrySources(code) : [],
    })),
  );

  return {
    schemaVersion: 1,
    database: 'date-holidays',
    databaseVersion,
    officialHolidayAppendix: 'officialHolidayAppendix.json',
    geographyDatabase: 'world-countries',
    countries,
  };
}

/* ===========================================================
   GERAÇÃO INTEGRAL E RESTAURAÇÃO DA DEPENDÊNCIA

   O gerador da dependência escreve dentro de node_modules.
   O aplicativo copia o resultado completo e depois restaura
   os arquivos da dependência ao estado anterior.
=========================================================== */

await validateCalendarMechanisms();

const providerCountryCodes = await discoverProviderCountryCodes();
const catalogCountryCodes = discoverCatalogCountryCodes(providerCountryCodes);

const originalPackageFiles = await Promise.all(
  generatedPackageFiles.map(async (filePath) => ({
    filePath,
    content: await readFile(filePath),
  })),
);

try {
  await runFile(process.execPath, [generatorPath]);

  const generatedData = JSON.parse(await readFile(sourceDataPath, 'utf8'));
  const generatedCountryCodes = Object.keys(generatedData.holidays || {}).sort();

  if (JSON.stringify(generatedCountryCodes) !== JSON.stringify(providerCountryCodes)) {
    throw new Error('A base gerada não corresponde à lista integral de países da fonte.');
  }

  const countryMetadata = await createCountryMetadata(
    catalogCountryCodes,
    providerCountryCodes,
    generatedData.version,
  );

  await mkdir(dirname(outputDataPath), { recursive: true });
  await copyFile(sourceDataPath, outputDataPath);
  await writeFile(outputCountriesPath, `${JSON.stringify(countryMetadata, null, 2)}\n`, 'utf8');
} finally {
  await Promise.all(
    originalPackageFiles.map(({ filePath, content }) => writeFile(filePath, content)),
  );
}

console.log(
  `Catálogo gerado para ${catalogCountryCodes.length} países e territórios; ` +
    `${providerCountryCodes.length} possuem calendário civil na fonte.`,
);
