import { readFile, readdir } from 'node:fs/promises';

import { resolve } from 'node:path';

import Holidays from 'date-holidays-parser';

/* ===========================================================
   AUDITORIA DOS PACOTES CIVIS POR PAÍS

   Compara a saída dividida usada pelo navegador com a base
   integral de manutenção. Assim, uma dependência territorial
   ausente interrompe a verificação antes da publicação.
=========================================================== */

const completeData = JSON.parse(
  await readFile(resolve('src/holidays/generated/dateHolidays.json'), 'utf8'),
);
const sharedNames = JSON.parse(
  await readFile(resolve('public/holiday-data/date-holidays/names.json'), 'utf8'),
);
const countryDataDirectory = resolve('public/holiday-data/date-holidays/countries');
const countryFiles = (await readdir(countryDataDirectory))
  .filter((fileName) => fileName.endsWith('.json'))
  .sort();
const centralYear = Number(process.argv.at(-1)) || new Date().getFullYear();
const auditedYears = Array.from({ length: 5 }, (_value, index) => centralYear - 2 + index);
const errors = [];
let auditedOccurrenceCount = 0;

function normalizeOccurrences(provider, year) {
  return provider
    .getHolidays(year, 'en')
    .map((holiday) => ({
      date: String(holiday.date || '').slice(0, 10),
      name: holiday.name || '',
      rule: holiday.rule || '',
      substitute: holiday.substitute === true,
      type: holiday.type || '',
    }))
    .toSorted((first, second) => JSON.stringify(first).localeCompare(JSON.stringify(second)));
}

for (const countryFile of countryFiles) {
  const countryCode = countryFile.replace(/\.json$/i, '');
  const countryPackage = JSON.parse(
    await readFile(resolve(countryDataDirectory, countryFile), 'utf8'),
  );
  const completeProvider = new Holidays(completeData);
  const runtimeProvider = new Holidays({
    ...countryPackage,
    names: sharedNames,
  });

  if (!completeProvider.init(countryCode) || !runtimeProvider.init(countryCode)) {
    errors.push(`${countryCode}: o país não pôde ser inicializado nas duas bases.`);
    continue;
  }

  for (const year of auditedYears) {
    const completeOccurrences = normalizeOccurrences(completeProvider, year);
    const runtimeOccurrences = normalizeOccurrences(runtimeProvider, year);

    auditedOccurrenceCount += completeOccurrences.length;

    if (JSON.stringify(runtimeOccurrences) !== JSON.stringify(completeOccurrences)) {
      errors.push(
        `${countryCode}/${year}: pacote dividido diverge da base integral ` +
          `(${runtimeOccurrences.length} × ${completeOccurrences.length} ocorrências).`,
      );
    }
  }
}

if (countryFiles.length !== Object.keys(completeData.holidays || {}).length) {
  errors.push(
    `Quantidade de países divergente: ${countryFiles.length} pacotes para ` +
      `${Object.keys(completeData.holidays || {}).length} países.`,
  );
}

if (errors.length > 0) {
  throw new Error(`Pacotes civis inválidos:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Pacotes civis auditados em ${auditedOccurrenceCount} ocorrências de ` +
    `${countryFiles.length} países na janela ${auditedYears.at(0)}–${auditedYears.at(-1)}.`,
);
