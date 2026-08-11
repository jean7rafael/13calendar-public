import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ===========================================================
   ARQUIVOS AUDITADOS
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

/* ===========================================================
   VALIDAÇÃO DA COBERTURA E DAS FONTES
=========================================================== */

const errors = [];
const unsupportedCountryCodes = countryCatalog.countries
  .filter(({ hasHolidayData }) => !hasHolidayData)
  .map(({ code }) => code)
  .sort();
const appendixCountryCodes = Object.keys(appendix.countries || {}).sort();

if (JSON.stringify(unsupportedCountryCodes) !== JSON.stringify(appendixCountryCodes)) {
  errors.push('O apêndice não possui exatamente os 45 códigos ausentes da base principal.');
}

appendixCountryCodes.forEach((countryCode) => {
  const country = appendix.countries[countryCode];
  const sources = country.sources || [];

  if (!country.status) {
    errors.push(`${countryCode}: status ausente.`);
  }

  if (
    !['not-applicable', 'official-source-pending'].includes(country.status) &&
    sources.length === 0
  ) {
    errors.push(`${countryCode}: fonte oficial ainda não registrada.`);
  }

  sources.forEach((source) => {
    if (!source.title || !/^https?:\/\//i.test(source.url || '')) {
      errors.push(`${countryCode}: fonte inválida.`);
    }
  });

  const datedStatus = country.status.match(/^(?:verified|partial)-(\d{4})(?:-(\d{4}))?$/);

  if (datedStatus) {
    const firstYear = Number(datedStatus[1]);
    const lastYear = Number(datedStatus[2] || datedStatus[1]);

    for (let year = firstYear; year <= lastYear; year += 1) {
      if (!appendix.occurrences?.[countryCode]?.[String(year)]?.length) {
        errors.push(`${countryCode}: status ${country.status} sem ocorrências de ${year}.`);
      }
    }
  }
});

/* ===========================================================
   VALIDAÇÃO DAS OCORRÊNCIAS PUBLICADAS
=========================================================== */

let occurrenceCount = 0;

Object.entries(appendix.occurrences || {}).forEach(([countryCode, years]) => {
  if (!appendix.countries?.[countryCode]) {
    errors.push(`${countryCode}: ocorrências sem registro de fonte.`);
  }

  Object.entries(years).forEach(([year, occurrences]) => {
    const uniqueIds = new Set();
    const uniqueRows = new Set();

    occurrences.forEach((occurrence) => {
      occurrenceCount += 1;
      const date = String(occurrence.date || '');
      const dateValue = new Date(`${date}T00:00:00Z`);
      const uniqueRow = `${date}|${String(occurrence.name || '').trim().toLowerCase()}`;

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(dateValue.getTime()) ||
        String(dateValue.toISOString()).slice(0, 10) !== date ||
        !date.startsWith(`${year}-`)
      ) {
        errors.push(`${countryCode}/${year}/${occurrence.id}: data inválida (${date}).`);
      }

      if (!occurrence.id || !String(occurrence.name || '').trim()) {
        errors.push(`${countryCode}/${year}: ocorrência sem identificador ou nome.`);
      }

      if (uniqueIds.has(occurrence.id)) {
        errors.push(`${countryCode}/${year}: identificador duplicado (${occurrence.id}).`);
      }

      if (uniqueRows.has(uniqueRow)) {
        errors.push(`${countryCode}/${year}: linha duplicada (${uniqueRow}).`);
      }

      if (
        occurrence.occurrenceKind === 'observed' &&
        !/^\d{4}-\d{2}-\d{2}$/.test(occurrence.observedForDate || '')
      ) {
        errors.push(`${countryCode}/${year}/${occurrence.id}: data observada sem data civil.`);
      }

      if (
        occurrence.sourceIndex !== undefined &&
        (!Number.isInteger(occurrence.sourceIndex) ||
          !appendix.countries?.[countryCode]?.sources?.[occurrence.sourceIndex])
      ) {
        errors.push(`${countryCode}/${year}/${occurrence.id}: fonte indicada não existe.`);
      }

      uniqueIds.add(occurrence.id);
      uniqueRows.add(uniqueRow);
    });
  });
});

if (errors.length > 0) {
  throw new Error(`Auditoria do apêndice oficial falhou:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Apêndice oficial auditado: ${appendixCountryCodes.length} países/territórios e ` +
    `${occurrenceCount} ocorrências publicadas.`,
);
