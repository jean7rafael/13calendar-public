import Holidays from 'date-holidays-parser';

import dateHolidaysData from 'src/holidays/generated/dateHolidays.json';

import { resolveInternationalHolidayEmojiDetails } from 'src/holidays/holidayEmojiResolver';

import { resolveHolidayTranslationSource } from 'src/holidays/holidayTranslationContexts';

import { consolidateSubstituteHolidays } from 'src/holidays/holidaySubstitution';

import { applyHolidayCountryExtensions } from 'src/holidays/holidayCountryExtensions';

import { allHolidayCountryMetadata } from 'src/holidays/libraryCountries';

/* ===========================================================
   FONTE E APRESENTAÇÃO DOS DADOS INTERNACIONAIS
=========================================================== */

const providerSource = Object.freeze({
  title: 'date-holidays — Worldwide holidays and observances',
  url: 'https://github.com/commenthol/date-holidays',
});

const countryMetadataByCode = new Map(
  allHolidayCountryMetadata.map((countryMetadata) => [countryMetadata.code, countryMetadata]),
);

function resolveProviderSource(countryCode) {
  const references = countryMetadataByCode.get(countryCode)?.sources || [];
  const preferredReference =
    references.find(({ kind }) => kind === 'source') || references.at(0) || null;

  if (!preferredReference) {
    return providerSource;
  }

  return Object.freeze({
    title: `date-holidays — ${countryCode}`,
    url: preferredReference.url,
  });
}

/* ===========================================================
   INSTÂNCIAS POR PAÍS

   O parser é criado uma única vez para cada país e reutilizado
   nas mudanças de mês, ano, idioma e filtros.
=========================================================== */

const providersByCountry = new Map();

function getProvider(countryCode) {
  if (!providersByCountry.has(countryCode)) {
    const provider = new Holidays(dateHolidaysData);

    if (!provider.init(countryCode)) {
      throw new Error(`A base internacional não contém feriados para ${countryCode}.`);
    }

    providersByCountry.set(countryCode, provider);
  }

  return providersByCountry.get(countryCode);
}

/* ===========================================================
   NORMALIZAÇÃO DO IDIOMA E DO TIPO
=========================================================== */

function normalizeLanguage(locale) {
  return String(locale || 'en')
    .trim()
    .replace('_', '-')
    .split('-')[0]
    .toLowerCase();
}

function normalizeType(holiday) {
  if (holiday.substitute === true) {
    return 'substitute';
  }

  const supportedTypes = ['public', 'bank', 'school', 'optional', 'observance', 'commercial'];

  return supportedTypes.includes(holiday.type) ? holiday.type : 'observance';
}

/* ===========================================================
   IDENTIFICADOR ESTÁVEL

   A regra da biblioteca não muda quando o idioma da interface
   é trocado. O hash evita usar o nome traduzido como chave.
=========================================================== */

function hashRule(rule) {
  let hash = 5381;

  for (const character of String(rule || '')) {
    hash = (hash * 33) ^ character.codePointAt(0);
  }

  return (hash >>> 0).toString(36);
}

/* ===========================================================
   CONSULTA DOS FERIADOS DE UM ANO
=========================================================== */

export function getDateHolidaysForYear({ country, year, locale, filters }) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();

  const provider = getProvider(countryCode);

  const source = resolveProviderSource(countryCode);

  const consolidatedHolidays = consolidateSubstituteHolidays(
    provider.getHolidays(year, normalizeLanguage(locale)),
    {
      country: countryCode,
      isSubstituteRule: (holiday) => provider.holidays?.[holiday.rule]?.substitute === true,
    },
  );

  return applyHolidayCountryExtensions({
    country: countryCode,
    year,
    holidays: consolidatedHolidays,
  })
    .map((holiday, index) => {
      const type = normalizeType(holiday);
      const date = String(holiday.date || '').slice(0, 10);
      const ruleId = hashRule(holiday.rule || `${date}-${index}`);
      const nameId = `dateHolidays.${ruleId}`;
      const contextualName = resolveHolidayTranslationSource({
        country: countryCode,
        rule: holiday.rule,
        name: holiday.name,
      });
      const canonicalName = contextualName;
      const emojiDetails = resolveInternationalHolidayEmojiDetails({
        country: countryCode,
        date,
        canonicalName,
        type,
        substitute: holiday.substitute === true,
      });
      const providerRuleTokens = provider.holidays?.[holiday.rule]?.fn?.rules || null;

      return {
        id: `${countryCode}_DH_${ruleId}_${date}`,
        country: countryCode,
        nameId,
        localizedName: holiday.name,
        emoji: emojiDetails.emoji,
        type,
        providerType: holiday.type,
        scope: 'national',
        substitute: holiday.substitute === true,
        occurrenceKind: holiday.occurrenceKind || 'holiday',
        observedForDate: holiday.observedForDate || null,
        date,
        movedFromDate: holiday.movedFromDate
          ? String(holiday.movedFromDate).slice(0, 10)
          : null,
        canonicalName,
        concept: emojiDetails.concept,
        providerRule: holiday.rule || null,
        /* Os tokens são estruturas simples e são copiados para que
           o componente nunca dependa do estado interno do parser. */
        providerRuleTokens: providerRuleTokens
          ? JSON.parse(JSON.stringify(providerRuleTokens))
          : null,
        source: holiday.source || source,
      };
    })
    .filter(
      (holiday) =>
        holiday.date.startsWith(`${String(year).padStart(4, '0')}-`) &&
        filters?.[holiday.type] !== false,
    );
}
