import officialHolidayAppendix from 'src/holidays/generated/officialHolidayAppendix.json';

import { resolveInternationalHolidayEmojiDetails } from 'src/holidays/holidayEmojiResolver';

/* ===========================================================
   APÊNDICE OFICIAL

   A base internacional continua sendo a fonte principal. Este
   provedor atende países ainda ausentes e também pode corrigir
   um calendário desatualizado depois de revisão humana.
=========================================================== */

const appendixCountries = officialHolidayAppendix.countries || {};
const appendixOccurrences = officialHolidayAppendix.occurrences || {};

export function hasOfficialHolidayOccurrences(countryCode) {
  const countryOccurrences = appendixOccurrences[String(countryCode || '').toUpperCase()] || {};

  return Object.values(countryOccurrences).some(
    (yearOccurrences) => Array.isArray(yearOccurrences) && yearOccurrences.length > 0,
  );
}

export function getOfficialHolidayReferences(countryCode) {
  return appendixCountries[String(countryCode || '').toUpperCase()]?.sources || [];
}

/* ===========================================================
   COBERTURA TEMPORAL PUBLICADA

   A interface usa estes metadados para distinguir uma lista
   oficial de um ano confirmado de uma regra apenas estimada.
=========================================================== */

export function getOfficialHolidayCoverage(countryCode) {
  const normalizedCountryCode = String(countryCode || '').toUpperCase();
  const country = appendixCountries[normalizedCountryCode];

  if (!country) {
    return null;
  }

  const years = Object.entries(appendixOccurrences[normalizedCountryCode] || {})
    .filter(([, occurrences]) => Array.isArray(occurrences) && occurrences.length > 0)
    .map(([year]) => Number(year))
    .filter(Number.isInteger)
    .sort((firstYear, secondYear) => firstYear - secondYear);

  return Object.freeze({
    country: normalizedCountryCode,
    status: country.status,
    years: Object.freeze(years),
    sources: Object.freeze([...(country.sources || [])]),
  });
}

/* ===========================================================
   COMPORTAMENTO NO CALENDÁRIO DE 13 MESES

   Datas religiosas calculadas em calendários próprios conservam
   o mesmo instante físico. Datas civis anuais recebem uma regra
   fixa para poderem ser reaplicadas no modo adaptado.
=========================================================== */

const ORIGIN_CALENDAR_PATTERN =
  /eid|ramadan|islamic|ashura|prophet muhammad|orthodox|pchum ben|visak|water festival/i;

function resolveOfficialCalendarRuleTokens(occurrence) {
  if (occurrence.occurrenceKind === 'observed' || ORIGIN_CALENDAR_PATTERN.test(occurrence.name)) {
    return null;
  }

  const [, month, day] = occurrence.date.match(/^\d{4}-(\d{2})-(\d{2})$/) || [];

  if (!month || !day) {
    return null;
  }

  if (/good friday/i.test(occurrence.name)) {
    return [{ fn: 'easter', type: 'easter', offset: -2 }];
  }

  if (/easter sunday/i.test(occurrence.name)) {
    return [{ fn: 'easter', type: 'easter', offset: 0 }];
  }

  if (/easter monday/i.test(occurrence.name)) {
    return [{ fn: 'easter', type: 'easter', offset: 1 }];
  }

  if (/corpus christi/i.test(occurrence.name)) {
    return [{ fn: 'easter', type: 'easter', offset: 60 }];
  }

  return [{ fn: 'gregorian', month: Number(month), day: Number(day) }];
}

/* ===========================================================
   OCORRÊNCIAS DE UM ANO
=========================================================== */

export function getOfficialHolidaysForYear({ country, year, filters }) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();
  const records = appendixOccurrences[countryCode]?.[String(year)] || [];
  const sources = getOfficialHolidayReferences(countryCode);

  return records
    .map((occurrence) => {
      const occurrenceKind = occurrence.occurrenceKind || 'holiday';
      const substitute = occurrenceKind === 'observed';
      const type = substitute ? 'substitute' : occurrence.type || 'public';
      const nameId = `official.${occurrence.id}`;
      const canonicalName = occurrence.name;
      const emojiDetails = resolveInternationalHolidayEmojiDetails({
        country: countryCode,
        date: occurrence.date,
        canonicalName,
        type,
        substitute,
      });

      return {
        id: `${countryCode}_OFFICIAL_${occurrence.id}_${occurrence.date}`,
        country: countryCode,
        nameId,
        localizedName: occurrence.name,
        canonicalName,
        emoji: emojiDetails.emoji,
        concept: emojiDetails.concept,
        type,
        providerType: 'official-appendix',
        scope: occurrence.scope || 'national',
        substitute,
        occurrenceKind,
        observedForDate: occurrence.observedForDate || null,
        movedFromDate: occurrence.observedForDate || null,
        date: occurrence.date,
        providerRule: `official ${occurrence.id} ${year}`,
        providerRuleTokens: resolveOfficialCalendarRuleTokens(occurrence),
        source: sources[occurrence.sourceIndex || 0] || null,
      };
    })
    .filter((holiday) => filters?.[holiday.type] !== false);
}

/* ===========================================================
   UNIÃO COM A BASE PRINCIPAL

   A fonte oficial prevalece quando data e conceito coincidem.
   Uma futura correção de data pode declarar replacesId no JSON;
   assim a regra antiga é removida sem comparação por texto.
=========================================================== */

export function mergeOfficialHolidayOccurrences(providerHolidays, officialHolidays) {
  const mergedHolidays = [...providerHolidays];

  officialHolidays.forEach((officialHoliday) => {
    const explicitIndex = officialHoliday.replacesId
      ? mergedHolidays.findIndex(({ id }) => id === officialHoliday.replacesId)
      : -1;
    const semanticIndex = mergedHolidays.findIndex(
      (holiday) =>
        holiday.date === officialHoliday.date &&
        holiday.concept === officialHoliday.concept &&
        !String(holiday.concept || '').startsWith('generic_'),
    );
    const matchingIndex = explicitIndex >= 0 ? explicitIndex : semanticIndex;

    if (matchingIndex >= 0) {
      mergedHolidays[matchingIndex] = {
        ...mergedHolidays[matchingIndex],
        ...officialHoliday,
        source: officialHoliday.source || mergedHolidays[matchingIndex].source,
      };
      return;
    }

    mergedHolidays.push(officialHoliday);
  });

  return mergedHolidays.sort((first, second) => first.date.localeCompare(second.date));
}
