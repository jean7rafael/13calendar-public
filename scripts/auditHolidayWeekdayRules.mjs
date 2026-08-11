import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Holidays from 'date-holidays-parser';

import { brazilHolidayDefinitions } from '../src/holidays/countries/BR.js';
import { germanyHolidayDefinitions } from '../src/holidays/countries/DE.js';
import { spainHolidayDefinitions } from '../src/holidays/countries/ES.js';
import { franceHolidayDefinitions } from '../src/holidays/countries/FR.js';
import { russiaHolidayDefinitions } from '../src/holidays/countries/RU.js';
import { unitedStatesHolidayDefinitions } from '../src/holidays/countries/US.js';
import { applyHolidayCountryExtensions } from '../src/holidays/holidayCountryExtensions.js';
import { consolidateSubstituteHolidays } from '../src/holidays/holidaySubstitution.js';
import { converterPara13Meses, converterParaGregoriano } from '../src/utils/conversorDatas.js';
import {
  calculateLastWeekday,
  calculateNthWeekday,
  calculateWeekdayAfter,
  calculateWeekdayBefore,
  calculateWeekdayOnOrAfter,
  calculateWeekdayOnOrBefore,
} from '../src/utils/holidayWeekdayRules.js';
import { DEFAULT_YEAR_WINDOW_RADIUS, createYearWindow } from '../src/utils/yearWindow.js';

/* ===========================================================
   ARQUIVOS, PAÍSES EDITORIAIS E JANELA DE ANOS
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const holidayDataPath = resolve(projectDirectory, 'src/holidays/generated/dateHolidays.json');

const editorialDefinitionsByCountry = Object.freeze({
  BR: brazilHolidayDefinitions,
  DE: germanyHolidayDefinitions,
  ES: spainHolidayDefinitions,
  FR: franceHolidayDefinitions,
  RU: russiaHolidayDefinitions,
  US: unitedStatesHolidayDefinitions,
});

const yearArgumentIndex = process.argv.indexOf('--year');
const selectedYear = Number(
  yearArgumentIndex >= 0 ? process.argv[yearArgumentIndex + 1] : new Date().getFullYear(),
);

if (!Number.isInteger(selectedYear)) {
  throw new TypeError('Use --year seguido por um ano inteiro.');
}

const years = createYearWindow(selectedYear, DEFAULT_YEAR_WINDOW_RADIUS);
const errors = [];

/* ===========================================================
   UTILITÁRIOS DE VERIFICAÇÃO
=========================================================== */

function parseIsoDate(isoDate) {
  const [year, month, day] = String(isoDate || '')
    .split('-')
    .map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function isValidIsoDate(isoDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(isoDate || ''));
}

function addError(message) {
  errors.push(message);
}

function assertWeekday(isoDate, expectedWeekday, context) {
  if (!isValidIsoDate(isoDate)) {
    addError(`${context}: data inválida (${isoDate}).`);
    return;
  }

  if (parseIsoDate(isoDate).getUTCDay() !== expectedWeekday) {
    addError(`${context}: dia da semana incorreto (${isoDate}).`);
  }
}

function assertRoundTrip(gregorianDate, context) {
  const thirteenMonthDate = converterPara13Meses(gregorianDate);
  const restoredGregorianDate = thirteenMonthDate
    ? converterParaGregoriano(thirteenMonthDate)
    : null;

  if (!thirteenMonthDate || restoredGregorianDate !== gregorianDate) {
    addError(
      `${context}: conversão não preservou a data (${gregorianDate} -> ${thirteenMonthDate} -> ${restoredGregorianDate}).`,
    );
  }
}

/* ===========================================================
   TESTE EXAUSTIVO DAS REGRAS SEMANAIS PRÓPRIAS

   Verifica os sete dias da semana, todos os meses, todas as
   ocorrências de 1 a 5 e todas as datas-base da janela móvel.
=========================================================== */

let internalRuleCheckCount = 0;

for (const year of years) {
  for (let month = 1; month <= 12; month += 1) {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    for (let weekday = 0; weekday <= 6; weekday += 1) {
      const lastWeekdayDate = calculateLastWeekday(year, month, weekday);

      assertWeekday(lastWeekdayDate, weekday, `lastWeekday/${year}/${month}/${weekday}`);

      if (lastWeekdayDate) {
        const followingWeek = new Date(parseIsoDate(lastWeekdayDate));
        followingWeek.setUTCDate(followingWeek.getUTCDate() + 7);

        if (followingWeek.getUTCMonth() === month - 1) {
          addError(`lastWeekday/${year}/${month}/${weekday}: ainda existe ocorrência posterior.`);
        }
      }

      internalRuleCheckCount += 1;

      for (let occurrence = 1; occurrence <= 5; occurrence += 1) {
        const nthWeekdayDate = calculateNthWeekday(year, month, weekday, occurrence);

        if (nthWeekdayDate) {
          assertWeekday(
            nthWeekdayDate,
            weekday,
            `nthWeekday/${year}/${month}/${weekday}/${occurrence}`,
          );

          const resolvedDay = parseIsoDate(nthWeekdayDate).getUTCDate();
          const resolvedOccurrence = Math.floor((resolvedDay - 1) / 7) + 1;

          if (resolvedOccurrence !== occurrence) {
            addError(
              `nthWeekday/${year}/${month}/${weekday}/${occurrence}: ocorrência incorreta (${nthWeekdayDate}).`,
            );
          }
        }

        internalRuleCheckCount += 1;
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const anchor = new Date(Date.UTC(year, month - 1, day));
        const variants = [
          ['weekdayOnOrBefore', calculateWeekdayOnOrBefore, -6, 0],
          ['weekdayBefore', calculateWeekdayBefore, -7, -1],
          ['weekdayOnOrAfter', calculateWeekdayOnOrAfter, 0, 6],
          ['weekdayAfter', calculateWeekdayAfter, 1, 7],
        ];

        variants.forEach(([name, calculator, minimumDifference, maximumDifference]) => {
          const isoDate = calculator(year, month, day, weekday);
          const resolvedDate = parseIsoDate(isoDate);
          const differenceInDays = Math.round((resolvedDate - anchor) / 86_400_000);
          const context = `${name}/${year}/${month}/${day}/${weekday}`;

          assertWeekday(isoDate, weekday, context);

          if (differenceInDays < minimumDifference || differenceInDays > maximumDifference) {
            addError(`${context}: deslocamento incorreto de ${differenceInDays} dia(s).`);
          }

          internalRuleCheckCount += 1;
        });
      }
    }
  }
}

/* ===========================================================
   ESTRUTURA RECURSIVA DAS REGRAS EDITORIAIS
=========================================================== */

const supportedRuleKinds = new Set([
  'conditionalSameDate',
  'easterOffset',
  'fixed',
  'lastWeekday',
  'nthWeekday',
  'relativeToRule',
  'seasonEvent',
  'weekdayAfter',
  'weekdayBefore',
  'weekdayOnOrAfter',
  'weekdayOnOrBefore',
  'yearSpecific',
]);

function auditEditorialRule(rule, context) {
  if (!rule?.kind || !supportedRuleKinds.has(rule.kind)) {
    addError(`${context}: tipo de regra desconhecido (${rule?.kind || 'ausente'}).`);
    return;
  }

  if (rule.kind === 'relativeToRule') {
    auditEditorialRule(rule.base, `${context}.base`);
  }

  if (rule.kind === 'conditionalSameDate') {
    auditEditorialRule(rule.primary, `${context}.primary`);
    auditEditorialRule(rule.comparison, `${context}.comparison`);
    auditEditorialRule(rule.whenEqual, `${context}.whenEqual`);
  }

  if (
    [
      'lastWeekday',
      'nthWeekday',
      'weekdayAfter',
      'weekdayBefore',
      'weekdayOnOrAfter',
      'weekdayOnOrBefore',
    ].includes(rule.kind) &&
    (!Number.isInteger(rule.weekday) || rule.weekday < 0 || rule.weekday > 6)
  ) {
    addError(`${context}: weekday precisa estar entre 0 e 6.`);
  }

  if (
    rule.kind === 'nthWeekday' &&
    (!Number.isInteger(rule.occurrence) || rule.occurrence < 1 || rule.occurrence > 5)
  ) {
    addError(`${context}: occurrence precisa estar entre 1 e 5.`);
  }
}

for (const [countryCode, definitions] of Object.entries(editorialDefinitionsByCountry)) {
  definitions.forEach((definition) => {
    auditEditorialRule(definition.rule, `${countryCode}/${definition.id}`);
  });

  const blackFriday = definitions.find(({ id }) => id.endsWith('_BLACK_FRIDAY'));

  if (blackFriday) {
    const { rule } = blackFriday;
    const isFridayAfterThanksgiving =
      rule?.kind === 'relativeToRule' &&
      rule.days === 1 &&
      rule.base?.kind === 'nthWeekday' &&
      rule.base.month === 11 &&
      rule.base.weekday === 4 &&
      rule.base.occurrence === 4;

    if (!isFridayAfterThanksgiving) {
      addError(
        `${countryCode}/${blackFriday.id}: Black Friday não está ligada ao Dia de Ação de Graças.`,
      );
    }

    for (const year of years) {
      const thanksgivingDate = calculateNthWeekday(year, 11, 4, 4);
      const thanksgiving = parseIsoDate(thanksgivingDate);
      thanksgiving.setUTCDate(thanksgiving.getUTCDate() + 1);
      const blackFridayDate = [
        String(thanksgiving.getUTCFullYear()).padStart(4, '0'),
        String(thanksgiving.getUTCMonth() + 1).padStart(2, '0'),
        String(thanksgiving.getUTCDate()).padStart(2, '0'),
      ].join('-');

      assertWeekday(blackFridayDate, 5, `${countryCode}/Black Friday/${year}`);
      assertRoundTrip(blackFridayDate, `${countryCode}/Black Friday/${year}`);
    }
  }
}

/* ===========================================================
   BASE INTERNACIONAL

   O parser da biblioteca resolve sua gramática completa:
   n-ésimo/ultimo dia, antes/depois, condicionais de fim de
   semana e regras relativas. Aqui confirmamos que todas as
   ocorrências resultantes preservam o mesmo dia físico ao
   entrar e sair do calendário de 13 meses.
=========================================================== */

const weekdayRulePattern =
  /\b(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|weekday|weekend)\b/iu;
const holidayData = JSON.parse(await readFile(holidayDataPath, 'utf8'));
const countryCodes = Object.keys(holidayData.holidays || {}).sort();
let internationalOccurrenceCount = 0;
let internationalWeekdayOccurrenceCount = 0;

for (const countryCode of countryCodes) {
  const provider = new Holidays(holidayData);

  if (!provider.init(countryCode)) {
    addError(`${countryCode}: o parser recusou a inicialização.`);
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
      });
    } catch (error) {
      addError(`${countryCode}/${year}: ${error.message}`);
      continue;
    }

    holidays.forEach((holiday) => {
      const gregorianDate = String(holiday.date || '').slice(0, 10);
      const context = `${countryCode}/${year}/${holiday.rule || holiday.name}`;

      internationalOccurrenceCount += 1;
      assertRoundTrip(gregorianDate, context);

      if (weekdayRulePattern.test(String(holiday.rule || ''))) {
        internationalWeekdayOccurrenceCount += 1;
      }
    });
  }
}

/* ===========================================================
   RESULTADO DA AUDITORIA
=========================================================== */

if (errors.length > 0) {
  const visibleErrors = errors
    .slice(0, 40)
    .map((error) => `- ${error}`)
    .join('\n');
  const hiddenCount = Math.max(0, errors.length - 40);

  throw new Error(
    `A auditoria semanal encontrou ${errors.length} problema(s):\n${visibleErrors}` +
      (hiddenCount ? `\n- ... e mais ${hiddenCount}.` : ''),
  );
}

console.log(
  [
    `Regras semanais validadas na janela ${years.join(', ')}.`,
    `Verificações internas: ${internalRuleCheckCount}.`,
    `Ocorrências internacionais convertidas: ${internationalOccurrenceCount}.`,
    `Ocorrências internacionais explicitamente semanais: ${internationalWeekdayOccurrenceCount}.`,
  ].join(' '),
);
