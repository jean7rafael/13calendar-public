import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Holidays from 'date-holidays-parser';

import { consolidateSubstituteHolidays } from '../src/holidays/holidaySubstitution.js';
import { applyHolidayCountryExtensions } from '../src/holidays/holidayCountryExtensions.js';
import { DEFAULT_YEAR_WINDOW_RADIUS, createYearWindow } from '../src/utils/yearWindow.js';

/* ===========================================================
   ARQUIVOS GERADOS E ANO DE REFERÊNCIA
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const holidayDataPath = resolve(projectDirectory, 'src/holidays/generated/dateHolidays.json');
const countryMetadataPath = resolve(
  projectDirectory,
  'src/holidays/generated/holidayCountries.json',
);

const yearArgumentIndex = process.argv.indexOf('--year');
const selectedYear = Number(
  yearArgumentIndex >= 0 ? process.argv[yearArgumentIndex + 1] : new Date().getFullYear(),
);

if (!Number.isInteger(selectedYear)) {
  throw new TypeError('Use --year seguido por um ano inteiro.');
}

/* ===========================================================
   NORMALIZAÇÃO PARA DETECTAR DUPLICATAS
=========================================================== */

function normalizeName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replaceAll('’', "'")
    .trim()
    .toLowerCase();
}

/* ===========================================================
   AUDITORIA DA BASE INTEGRAL NA JANELA MÓVEL
=========================================================== */

const holidayData = JSON.parse(await readFile(holidayDataPath, 'utf8'));
const countryMetadata = JSON.parse(await readFile(countryMetadataPath, 'utf8'));
const dataCountryCodes = Object.keys(holidayData.holidays || {}).sort();
const metadataCountryCodes = countryMetadata.countries
  .filter(({ hasHolidayData }) => hasHolidayData !== false)
  .map(({ code }) => code)
  .sort();

if (JSON.stringify(dataCountryCodes) !== JSON.stringify(metadataCountryCodes)) {
  throw new Error('Os países dos dados e dos metadados não correspondem.');
}

const years = createYearWindow(selectedYear, DEFAULT_YEAR_WINDOW_RADIUS);
const errors = [];
let occurrenceCount = 0;

for (const countryCode of dataCountryCodes) {
  const provider = new Holidays(holidayData);

  if (!provider.init(countryCode)) {
    errors.push(`${countryCode}: o parser recusou a inicialização.`);
    continue;
  }

  for (const year of years) {
    let holidays;

    try {
      holidays = applyHolidayCountryExtensions({
        country: countryCode,
        year,
        holidays: consolidateSubstituteHolidays(provider.getHolidays(year, 'en'), {
          country: countryCode,
          isSubstituteRule: (holiday) => provider.holidays?.[holiday.rule]?.substitute === true,
        }),
      }).filter((holiday) =>
        String(holiday.date || '').startsWith(`${String(year).padStart(4, '0')}-`),
      );
    } catch (error) {
      errors.push(`${countryCode}/${year}: ${error.message}`);
      continue;
    }

    occurrenceCount += holidays.length;

    const uniqueOccurrences = new Set();

    holidays.forEach((holiday) => {
      const date = String(holiday.date || '').slice(0, 10);
      const name = String(holiday.name || '').trim();
      const uniqueKey = `${date}|${normalizeName(name)}`;

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name) {
        errors.push(`${countryCode}/${year}: ocorrência sem data ou nome válido.`);
      }

      if (
        (holiday.substitute === true && holiday.occurrenceKind !== 'observed') ||
        /\bsubstitute\b/iu.test(name)
      ) {
        errors.push(`${countryCode}/${year}: data substituta não consolidada (${name}).`);
      }

      /* Uma regra fixa marcada como substituível nunca pode terminar
         silenciosamente no dia de expediente observado. A data civil
         e a ocorrência observada precisam permanecer distinguíveis. */
      if (
        holiday.occurrenceKind !== 'observed' &&
        provider.holidays?.[holiday.rule]?.substitute === true
      ) {
        const nominalDate = String(holiday.rule || '').match(/^(\d{2})-(\d{2})\b/);

        if (nominalDate && date.slice(5, 10) !== `${nominalDate[1]}-${nominalDate[2]}`) {
          errors.push(
            `${countryCode}/${year}: data civil alterada (${date} — ${name}; ` +
              `esperado ${nominalDate[1]}-${nominalDate[2]}).`,
          );
        }
      }

      if (uniqueOccurrences.has(uniqueKey)) {
        errors.push(`${countryCode}/${year}: ocorrência duplicada (${date} — ${name}).`);
      }

      uniqueOccurrences.add(uniqueKey);
    });
  }
}

if (errors.length > 0) {
  const visibleErrors = errors
    .slice(0, 40)
    .map((error) => `- ${error}`)
    .join('\n');
  const hiddenCount = Math.max(0, errors.length - 40);

  throw new Error(
    `A auditoria encontrou ${errors.length} problema(s):\n${visibleErrors}` +
      (hiddenCount ? `\n- ... e mais ${hiddenCount}.` : ''),
  );
}

console.log(
  [
    `Auditoria concluída para ${dataCountryCodes.length} países.`,
    `Janela: ${years.join(', ')}.`,
    `Ocorrências verificadas: ${occurrenceCount}.`,
  ].join(' '),
);
