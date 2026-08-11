import { SearchMoonPhase, Seasons } from 'astronomy-engine';

import { createSeasonDefinitions } from 'src/holidays/seasonDefinitions';

import { getHolidayCountryConfig } from 'src/holidays/countryRegistry';

import { getDateHolidaysForYear } from 'src/holidays/dateHolidayProvider';

import {
  getOfficialHolidaysForYear,
  mergeOfficialHolidayOccurrences,
} from 'src/holidays/officialHolidayProvider';

import { mergeProviderAndEditorialHolidays } from 'src/holidays/holidayMerge';

import {
  CALENDAR_13_HOLIDAY_MODES,
  DEFAULT_CALENDAR_13_HOLIDAY_MODE,
  findNextCalendar13Weekday,
  resolveNativeCalendar13HolidayDate,
} from 'src/holidays/calendar13HolidayRules';

import { converterPara13Meses } from 'src/utils/conversorDatas';

import {
  calculateLastWeekday,
  calculateNthWeekday,
  calculateWeekdayAfter,
  calculateWeekdayBefore,
  calculateWeekdayOnOrAfter,
  calculateWeekdayOnOrBefore,
} from 'src/utils/holidayWeekdayRules';

/* ===========================================================
   TIPOS DISPONÍVEIS NOS FILTROS
=========================================================== */

export const HOLIDAY_TYPES = Object.freeze([
  'public',
  'substitute',
  'optional',
  'observance',
  'bank',
  'school',
  'commercial',
  'astronomical',
]);

export const DEFAULT_HOLIDAY_FILTERS = Object.freeze({
  public: true,
  substitute: true,
  optional: true,
  observance: true,
  bank: true,
  school: true,
  commercial: true,
  astronomical: true,
});

/* ===========================================================
   UTILITÁRIOS DE DATA EM UTC
=========================================================== */

function formatIsoDate(year, month, day) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

/* ===========================================================
   CÁLCULO DOS EQUINÓCIOS E SOLSTÍCIOS

   Os resultados são armazenados por ano para que o cálculo
   não seja repetido para cada uma das quatro estações.
=========================================================== */

const astronomicalSeasonsByYear = new Map();

function calculateSeasonEvent(year, eventName) {
  if (!astronomicalSeasonsByYear.has(year)) {
    astronomicalSeasonsByYear.set(year, Seasons(year));
  }

  const seasonEvents = astronomicalSeasonsByYear.get(year);

  const astroTime = seasonEvents?.[eventName];

  const date = astroTime?.date;

  if (!date) {
    return null;
  }

  return formatIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function parseIsoDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);

  return {
    year,
    month,
    day,
  };
}

function addDays(isoDate, amount) {
  const { year, month, day } = parseIsoDate(isoDate);

  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + amount);

  return formatIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/* ===========================================================
   CÁLCULO DA PÁSCOA GREGORIANA
=========================================================== */

function calculateEaster(year) {
  const floor = Math.floor;
  const goldenNumber = year % 19;
  const century = floor(year / 100);

  const correction =
    (century - floor(century / 4) - floor((8 * century + 13) / 25) + 19 * goldenNumber + 15) % 30;

  const adjustedCorrection =
    correction -
    floor(correction / 28) * (1 - floor(29 / (correction + 1)) * floor((21 - goldenNumber) / 11));

  const weekdayCorrection =
    (year + floor(year / 4) + adjustedCorrection + 2 - century + floor(century / 4)) % 7;

  const finalCorrection = adjustedCorrection - weekdayCorrection;

  const month = 3 + floor((finalCorrection + 40) / 44);

  const day = finalCorrection + 28 - 31 * floor(month / 4);

  return formatIsoDate(year, month, day);
}

/* ===========================================================
   RESOLUÇÃO DAS REGRAS DE DATA

   Todas as regras retornam uma data ISO no formato:
   AAAA-MM-DD

   Quando a regra não se aplica ao ano informado,
   retorna null.
=========================================================== */

export function resolveHolidayRule(rule, year) {
  if (!rule?.kind) {
    return null;
  }

  switch (rule.kind) {
    /* =======================================================
       DATA FIXA
    ======================================================= */

    case 'fixed':
      return formatIsoDate(year, rule.month, rule.day);

    /* =======================================================
       EQUINÓCIO OU SOLSTÍCIO
    ======================================================= */

    case 'seasonEvent':
      return calculateSeasonEvent(year, rule.event);

    /* =======================================================
       DATA RELATIVA À PÁSCOA

       days:
       0  = domingo de Páscoa
       -2 = Sexta-feira Santa
       1  = segunda-feira de Páscoa
       39 = Ascensão
       50 = segunda-feira de Pentecostes
    ======================================================= */

    case 'easterOffset':
      return addDays(calculateEaster(year), rule.days);

    /* =======================================================
       DATA RELATIVA A QUALQUER OUTRA REGRA
    ======================================================= */

    case 'relativeToRule': {
      const baseDate = resolveHolidayRule(rule.base, year);

      if (!baseDate) {
        return null;
      }

      return addDays(baseDate, rule.days);
    }

    /* =======================================================
       N-ÉSIMA OCORRÊNCIA DE UM DIA DA SEMANA

       Exemplo:
       segunda-feira, terceira ocorrência do mês.
    ======================================================= */

    case 'nthWeekday':
      return calculateNthWeekday(year, rule.month, rule.weekday, rule.occurrence);

    /* =======================================================
       ÚLTIMA OCORRÊNCIA DE UM DIA DA SEMANA
    ======================================================= */

    case 'lastWeekday':
      return calculateLastWeekday(year, rule.month, rule.weekday);

    /* =======================================================
       DIA DA SEMANA NA DATA OU ANTES DELA
    ======================================================= */

    case 'weekdayOnOrBefore':
      return calculateWeekdayOnOrBefore(year, rule.month, rule.day, rule.weekday);

    /* =======================================================
       DIA DA SEMANA NA DATA OU DEPOIS DELA
    ======================================================= */

    case 'weekdayOnOrAfter':
      return calculateWeekdayOnOrAfter(year, rule.month, rule.day, rule.weekday);

    /* =======================================================
       DIA DA SEMANA ESTRITAMENTE ANTES DA DATA
    ======================================================= */

    case 'weekdayBefore':
      return calculateWeekdayBefore(year, rule.month, rule.day, rule.weekday);

    /* =======================================================
       DIA DA SEMANA ESTRITAMENTE DEPOIS DA DATA
    ======================================================= */

    case 'weekdayAfter':
      return calculateWeekdayAfter(year, rule.month, rule.day, rule.weekday);

    /* =======================================================
       REGRA CONDICIONAL POR COINCIDÊNCIA

       Calcula a regra principal. Se ela cair na mesma
       data da regra de comparação, utiliza a alternativa.
    ======================================================= */

    case 'conditionalSameDate': {
      const primaryDate = resolveHolidayRule(rule.primary, year);

      if (!primaryDate) {
        return null;
      }

      const comparisonDate = resolveHolidayRule(rule.comparison, year);

      if (comparisonDate && primaryDate === comparisonDate) {
        return resolveHolidayRule(rule.whenEqual, year);
      }

      return primaryDate;
    }

    /* =======================================================
       DATA PUBLICADA ESPECIFICAMENTE PARA UM ANO

       Útil para transferências oficiais e calendários
       publicados anualmente.
    ======================================================= */

    case 'yearSpecific': {
      const yearDate = rule.dates?.[year];

      if (!yearDate) {
        return null;
      }

      if (typeof yearDate === 'string') {
        return yearDate;
      }

      return formatIsoDate(year, yearDate.month, yearDate.day);
    }

    /* =======================================================
       REGRA DESCONHECIDA
    ======================================================= */

    default:
      console.warn(`Regra de feriado desconhecida: ${rule.kind}`);

      return null;
  }
}

function isDefinitionActive(definition, year) {
  if (definition.validFrom && year < definition.validFrom) {
    return false;
  }

  if (definition.validTo && year > definition.validTo) {
    return false;
  }

  return true;
}

/* Verifica se o tipo da definição permanece habilitado. */
function isTypeEnabled(type, filters) {
  return filters?.[type] !== false;
}

/* ===========================================================
   DADOS DO PAÍS SELECIONADO
=========================================================== */

function resolveDefinitionsForYear(countryConfig, year, filters, definitions) {
  return definitions
    .filter((definition) => isDefinitionActive(definition, year))
    .filter((definition) => isTypeEnabled(definition.type, filters))
    .map((definition) => {
      const date = resolveHolidayRule(definition.rule, year);

      return {
        ...definition,
        date,
        /* Todo complemento editorial substitutivo representa uma
           folga observada, mesmo quando a definição antiga ainda
           não trazia essa classificação explicitamente. */
        occurrenceKind:
          definition.occurrenceKind ||
          (definition.type === 'substitute' ? 'observed' : 'holiday'),
        source: definition.source || countryConfig.sources[definition.sourceId] || null,
      };
    })
    .filter((holiday) => Boolean(holiday.date));
}

/* ===========================================================
   FERIADOS GREGORIANOS DE UM ANO
=========================================================== */

function getGregorianHolidaysForYear({
  country = 'BR',
  year,
  locale = 'en',
  filters = DEFAULT_HOLIDAY_FILTERS,
}) {
  const numericYear = Number(year);

  if (!Number.isInteger(numericYear)) {
    throw new TypeError('O ano precisa ser um número inteiro.');
  }

  const countryConfig = getHolidayCountryConfig(country);

  const providerHolidays =
    countryConfig.provider === 'date-holidays' || countryConfig.provider === 'hybrid'
      ? getDateHolidaysForYear({
          country: countryConfig.code,
          year: numericYear,
          locale,
          filters,
        })
      : [];

  const officialHolidays = getOfficialHolidaysForYear({
    country: countryConfig.code,
    year: numericYear,
    filters,
  });

  const editorialHolidays = resolveDefinitionsForYear(
    countryConfig,
    numericYear,
    filters,
    countryConfig.definitions,
  );

  const baseCountryHolidays =
    countryConfig.provider === 'hybrid'
      ? mergeProviderAndEditorialHolidays(providerHolidays, editorialHolidays)
      : [...providerHolidays, ...editorialHolidays];

  const countryHolidays = mergeOfficialHolidayOccurrences(
    baseCountryHolidays,
    officialHolidays,
  );

  const seasonHolidays = resolveDefinitionsForYear(
    countryConfig,
    numericYear,
    filters,
    createSeasonDefinitions(countryConfig),
  );

  return [...countryHolidays, ...seasonHolidays].sort((first, second) =>
    first.date.localeCompare(second.date),
  );
}

/* ===========================================================
   FERIADOS GREGORIANOS DE UM MÊS
=========================================================== */

export function getGregorianHolidaysForMonth({
  country = 'BR',
  year,
  month,
  locale,
  filters = DEFAULT_HOLIDAY_FILTERS,
}) {
  const expectedMonth = String(month).padStart(2, '0');

  return getGregorianHolidaysForYear({
    country,
    year,
    locale,
    filters,
  }).filter((holiday) => {
    const holidayMonth = holiday.date.split('-')[1];

    return holidayMonth === expectedMonth;
  });
}

/* ===========================================================
   PÁSCOA ADAPTADA AO CALENDÁRIO DE 13 MESES

   O encarte gregoriano continua usando o computus tradicional.
   No modo adaptado, localizamos astronomicamente a primeira lua
   cheia após o equinócio de março e escolhemos o primeiro domingo
   do calendário de 13 meses depois dessa lua. Os feriados com
   easterOffset usam essa mesma data-base.
=========================================================== */

const nativeCalendar13EasterByYear = new Map();

function calculateNativeCalendar13Easter(year, easterType = 'easter') {
  /* A Páscoa ortodoxa utiliza outro calendário eclesiástico.
     Até existir uma regra ortodoxa própria documentada, ela usa
     o fallback correspondente em vez de uma aproximação. */
  if (easterType !== 'easter') {
    return null;
  }

  const numericYear = Number(year);

  if (nativeCalendar13EasterByYear.has(numericYear)) {
    return nativeCalendar13EasterByYear.get(numericYear);
  }

  const marchEquinox = Seasons(numericYear)?.mar_equinox?.date;
  const paschalFullMoon = marchEquinox
    ? SearchMoonPhase(180, marchEquinox, 40)?.date
    : null;

  if (!paschalFullMoon) {
    nativeCalendar13EasterByYear.set(numericYear, null);
    return null;
  }

  const fullMoonGregorianDate = formatIsoDate(
    paschalFullMoon.getUTCFullYear(),
    paschalFullMoon.getUTCMonth() + 1,
    paschalFullMoon.getUTCDate(),
  );
  const fullMoonCalendar13Date = converterPara13Meses(fullMoonGregorianDate);
  const nativeEaster = findNextCalendar13Weekday(fullMoonCalendar13Date, 0);

  nativeCalendar13EasterByYear.set(numericYear, nativeEaster);

  return nativeEaster;
}

/* Converte uma regra não adaptável para que condições mistas,
   como a coincidência do Dia das Mães francês com Pentecostes,
   ainda possam comparar as duas datas corretamente. */
function resolveCorrespondingCalendar13Rule(rule, year) {
  const gregorianDate = resolveHolidayRule(rule, year);

  return gregorianDate ? converterPara13Meses(gregorianDate) : null;
}

/* ===========================================================
   FERIADOS DE 13 MESES DE UM ANO
=========================================================== */

function getThirteenMonthHolidaysForYear({
  country = 'BR',
  year,
  locale,
  filters = DEFAULT_HOLIDAY_FILTERS,
  mode = DEFAULT_CALENDAR_13_HOLIDAY_MODE,
}) {
  const selectedMode = Object.values(CALENDAR_13_HOLIDAY_MODES).includes(mode)
    ? mode
    : DEFAULT_CALENDAR_13_HOLIDAY_MODE;

  return getGregorianHolidaysForYear({
    country,
    year,
    locale,
    filters,
  })
    /* Datas meramente observadas são ajustes de expediente do
       calendário gregoriano. No calendário hipotético de 13 meses,
       o feriado original pode cair em outro dia da semana e essa
       folga isolada deixa de ter fundamento. Períodos oficiais com
       vários dias, como as férias de Ano-Novo russas, continuam aqui
       porque cada dia é uma ocorrência civil real, e não observada.

       A verificação redundante do tipo protege catálogos antigos ou
       fontes futuras que ainda não tragam occurrenceKind normalizado. */
    .filter(
      (holiday) => holiday.occurrenceKind !== 'observed' && holiday.type !== 'substitute',
    )
    .map((holiday) => {
      const date13Corresponding = converterPara13Meses(holiday.date);
      const nativeResolution = resolveNativeCalendar13HolidayDate(holiday, year, {
        correspondingDate: date13Corresponding,
        resolveNativeEaster: calculateNativeCalendar13Easter,
        resolveCorrespondingRule: resolveCorrespondingCalendar13Rule,
      });
      const date13Native = nativeResolution.date || date13Corresponding;
      const date13 =
        selectedMode === CALENDAR_13_HOLIDAY_MODES.NATIVE
          ? date13Native
          : date13Corresponding;

      return {
        ...holiday,
        gregorianDate: holiday.date,
        date13Corresponding,
        date13Native,
        date13,
        calendar13Mode: selectedMode,
        calendar13Resolution: nativeResolution.resolution,
      };
    })
    .filter((holiday) => Boolean(holiday.date13))
    .sort((first, second) => first.date13.localeCompare(second.date13));
}

/* ===========================================================
   FERIADOS DE 13 MESES DE UM MÊS
=========================================================== */

export function getThirteenMonthHolidaysForMonth({
  country = 'BR',
  year,
  month,
  locale,
  filters = DEFAULT_HOLIDAY_FILTERS,
  mode = DEFAULT_CALENDAR_13_HOLIDAY_MODE,
}) {
  const expectedMonth = String(month).padStart(2, '0');

  return getThirteenMonthHolidaysForYear({
    country,
    year,
    locale,
    filters,
    mode,
  }).filter((holiday) => {
    const holidayMonth = holiday.date13.split('-')[1];

    return holidayMonth === expectedMonth;
  });
}
