import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Holidays from 'date-holidays-parser';

import {
  addCalendar13Days,
  mapGregorianMonthToCalendar13,
  resolveEditorialCalendar13Rule,
  resolveNativeCalendar13HolidayDate,
  resolveProviderCalendar13Rule,
} from '../src/holidays/calendar13HolidayRules.js';
import { converterPara13Meses } from '../src/utils/conversorDatas.js';

/* ===========================================================
   ARQUIVO DA BASE E ANO DE REFERÊNCIA
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const holidayDataPath = resolve(projectDirectory, 'src/holidays/generated/dateHolidays.json');
const yearArgumentIndex = process.argv.indexOf('--year');
const selectedYear = Number(
  yearArgumentIndex >= 0 ? process.argv[yearArgumentIndex + 1] : new Date().getFullYear(),
);
const auditedYears = Array.from({ length: 5 }, (_value, index) => selectedYear - 2 + index);

if (!Number.isInteger(selectedYear)) {
  throw new TypeError('Use --year seguido por um ano inteiro.');
}

const errors = [];

function assertEqual(actual, expected, context) {
  if (actual !== expected) {
    errors.push(`${context}: esperado ${expected}, recebido ${actual}.`);
  }
}

function assertRegularCalendar13Date(date, context) {
  const match = String(date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const month = Number(match?.[2]);
  const day = Number(match?.[3]);

  if (!match || month < 1 || month > 13 || day < 1 || day > 28) {
    errors.push(`${context}: data regular inválida (${date}).`);
  }
}

/* ===========================================================
   CASOS DE REFERÊNCIA DO MECANISMO
=========================================================== */

assertEqual(mapGregorianMonthToCalendar13(6), 6, 'Junho');
assertEqual(mapGregorianMonthToCalendar13(7), 8, 'Julho após Solaris');
assertEqual(mapGregorianMonthToCalendar13(12), 13, 'Dezembro após Solaris');

assertEqual(
  resolveEditorialCalendar13Rule(
    { kind: 'fixed', month: 12, day: 25 },
    selectedYear,
  ),
  `${selectedYear}-13-25`,
  'Natal fixo',
);

assertEqual(
  resolveEditorialCalendar13Rule(
    { kind: 'nthWeekday', month: 8, weekday: 1, occurrence: 1 },
    selectedYear,
  ),
  `${selectedYear}-09-02`,
  'Primeira segunda-feira de agosto',
);

assertEqual(
  resolveEditorialCalendar13Rule(
    { kind: 'lastWeekday', month: 11, weekday: 5 },
    selectedYear,
  ),
  `${selectedYear}-12-27`,
  'Última sexta-feira de novembro',
);

assertEqual(
  resolveEditorialCalendar13Rule(
    {
      kind: 'relativeToRule',
      days: 1,
      base: { kind: 'nthWeekday', month: 11, weekday: 4, occurrence: 4 },
    },
    selectedYear,
  ),
  `${selectedYear}-12-27`,
  'Black Friday após a quarta quinta-feira de novembro',
);

function createNativeEasterFixture(year) {
  return `${year}-04-15`;
}

const nativeEasterFixture = createNativeEasterFixture(selectedYear);

assertEqual(
  resolveEditorialCalendar13Rule(
    { kind: 'easterOffset', days: -2 },
    selectedYear,
    { resolveNativeEaster: () => nativeEasterFixture },
  ),
  `${selectedYear}-04-13`,
  'Sexta-feira da Paixão adaptada',
);

assertEqual(
  resolveProviderCalendar13Rule(
    [
      { fn: 'gregorian', day: 1, month: 8 },
      { rule: 'dateDir', count: 1, weekday: 'monday', direction: 'after' },
    ],
    selectedYear,
  ),
  `${selectedYear}-09-02`,
  'Regra semanal da base internacional',
);

assertEqual(
  resolveProviderCalendar13Rule(
    [{ fn: 'easter', type: 'easter', offset: 1 }],
    selectedYear,
    { resolveNativeEaster: () => nativeEasterFixture },
  ),
  addCalendar13Days(nativeEasterFixture, 1),
  'Regra de Páscoa da base internacional',
);

/* Datas islâmicas, hebraicas e de outros calendários de origem
   são calculadas anualmente pela base. O calendário 13 preserva
   essa ocorrência física e registra que a decisão foi intencional. */
const sourceCalendarFixture = `${selectedYear}-09-09`;
const islamicFixture = resolveNativeCalendar13HolidayDate(
  { providerRuleTokens: [{ fn: 'islamic', month: 10, day: 1 }] },
  selectedYear,
  { correspondingDate: sourceCalendarFixture },
);

assertEqual(islamicFixture.date, sourceCalendarFixture, 'Data islâmica calculada na origem');
assertEqual(
  islamicFixture.resolution,
  'source-calendar-rule',
  'Classificação da regra islâmica',
);

const orthodoxFixture = resolveNativeCalendar13HolidayDate(
  { providerRuleTokens: [{ fn: 'easter', type: 'orthodox', offset: 0 }] },
  selectedYear,
  { correspondingDate: sourceCalendarFixture },
);

assertEqual(
  orthodoxFixture.resolution,
  'source-calendar-rule',
  'Classificação da Páscoa ortodoxa',
);

/* O Fora do Tempo continua sendo responsabilidade exclusiva do
   conversor e não participa da reinterpretação dos feriados. */
assertEqual(
  converterPara13Meses(`${selectedYear}-12-31`).slice(5),
  new Date(Date.UTC(selectedYear, 1, 29)).getUTCDate() === 29 ? '14-02' : '14-01',
  'Fora do Tempo preservado',
);

/* ===========================================================
   VARREDURA DAS REGRAS INTERNACIONAIS

   Toda regra semanal recorrente com âncora entre os dias 1 e 28
   deve ser adaptável. Calendários religiosos e astronômicos são
   calculados pela origem; exceções contextuais preservam a data
   civil. Somente uma regra sem classificação é fallback real.
=========================================================== */

const holidayData = JSON.parse(await readFile(holidayDataPath, 'utf8'));
const countryCodes = Object.keys(holidayData.holidays || {}).sort();
let occurrenceCount = 0;
let adaptedCount = 0;
let weeklyRuleCount = 0;
let easterRuleCount = 0;
let sourceCalendarRuleCount = 0;
let astronomicalRuleCount = 0;
let protectedContextRuleCount = 0;
let unknownFallbackCount = 0;
const sourceCalendarByBaseType = new Map();
const unknownFallbackByBaseType = new Map();

for (const countryCode of countryCodes) {
  const provider = new Holidays(holidayData);

  if (!provider.init(countryCode)) {
    errors.push(`${countryCode}: não foi possível iniciar a base.`);
    continue;
  }

  for (const auditedYear of auditedYears) {
    let holidays;

    try {
      holidays = provider.getHolidays(auditedYear, 'en');
    } catch (error) {
      errors.push(`${countryCode}/${auditedYear}: ${error.message}`);
      continue;
    }

    holidays.forEach((holiday) => {
      const tokens = provider.holidays?.[holiday.rule]?.fn?.rules || null;
      const baseToken = tokens?.find((token) => token.fn) || null;
      const hasWeeklyMovement = tokens?.some(
        (token) => token.rule === 'dateDir' || token.rule === 'dateIfThen',
      );
      const hasContextDependency = tokens?.some(
        (token) => token.rule === 'bridge' || token.rule === 'ruleIfHoliday',
      );
      const hasSubstituteModifier = tokens?.some(
        (token) => token.modifier === 'substitutes',
      );
      const correspondingDate = converterPara13Meses(String(holiday.date).slice(0, 10));
      const nativeResolution = resolveNativeCalendar13HolidayDate(
        { providerRuleTokens: tokens },
        auditedYear,
        {
          correspondingDate,
          resolveNativeEaster: (year, type) =>
            type === 'easter' ? createNativeEasterFixture(year) : null,
        },
      );
      const nativeDate = nativeResolution.date;

      occurrenceCount += 1;

      if (hasWeeklyMovement) {
        weeklyRuleCount += 1;
      }

      if (baseToken?.fn === 'easter' && baseToken.type === 'easter') {
        easterRuleCount += 1;
      }

      if (nativeResolution.resolution === 'provider-rule') {
        adaptedCount += 1;
        assertRegularCalendar13Date(
          nativeDate,
          `${countryCode}/${auditedYear}/${holiday.rule}`,
        );
      } else if (nativeResolution.resolution === 'source-calendar-rule') {
        sourceCalendarRuleCount += 1;

        const baseType =
          baseToken?.fn === 'easter' ? `easter-${baseToken.type}` : baseToken?.fn;

        sourceCalendarByBaseType.set(
          baseType,
          (sourceCalendarByBaseType.get(baseType) || 0) + 1,
        );
      } else if (nativeResolution.resolution === 'astronomical-source-rule') {
        astronomicalRuleCount += 1;
      } else if (
        ['provider-context-rule', 'unrepresentable-fixed-day'].includes(
          nativeResolution.resolution,
        )
      ) {
        protectedContextRuleCount += 1;
      } else {
        unknownFallbackCount += 1;

        const baseType = baseToken?.fn || 'sem-base';

        unknownFallbackByBaseType.set(
          baseType,
          (unknownFallbackByBaseType.get(baseType) || 0) + 1,
        );
      }

      const safelyAdaptableWeeklyRule =
        hasWeeklyMovement &&
        !hasContextDependency &&
        !hasSubstituteModifier &&
        baseToken?.fn === 'gregorian' &&
        baseToken.year == null &&
        Number(baseToken.day) >= 1 &&
        Number(baseToken.day) <= 28;

      if (safelyAdaptableWeeklyRule && nativeResolution.resolution !== 'provider-rule') {
        errors.push(
          `${countryCode}/${auditedYear}/${holiday.rule}: ` +
            'regra semanal recorrente não foi adaptada.',
        );
      }
    });
  }
}

/* ===========================================================
   RESULTADO
=========================================================== */

if (errors.length > 0) {
  const visibleErrors = errors
    .slice(0, 40)
    .map((error) => `- ${error}`)
    .join('\n');
  const hiddenCount = Math.max(0, errors.length - 40);

  throw new Error(
    `A auditoria do calendário 13 encontrou ${errors.length} problema(s):\n${visibleErrors}` +
      (hiddenCount ? `\n- ... e mais ${hiddenCount}.` : ''),
  );
}

const sourceCalendarSummary = [...sourceCalendarByBaseType.entries()]
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([type, count]) => `${type}: ${count}`)
  .join(', ');
const unknownFallbackSummary = [...unknownFallbackByBaseType.entries()]
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([type, count]) => `${type}: ${count}`)
  .join(', ');

console.log(
  [
    `Calendário 13 auditado na janela ${auditedYears.at(0)}–${auditedYears.at(-1)}.`,
    `Países: ${countryCodes.length}.`,
    `Ocorrências: ${occurrenceCount}.`,
    `Adaptadas: ${adaptedCount}.`,
    `Regras semanais: ${weeklyRuleCount}.`,
    `Regras pascais ocidentais: ${easterRuleCount}.`,
    `Preservadas pelo calendário de origem: ${sourceCalendarRuleCount}` +
      ` (${sourceCalendarSummary || 'nenhuma'}).`,
    `Eventos astronômicos preservados: ${astronomicalRuleCount}.`,
    `Exceções contextuais protegidas: ${protectedContextRuleCount}.`,
    `Fallbacks desconhecidos: ${unknownFallbackCount}` +
      ` (${unknownFallbackSummary || 'nenhum'}).`,
  ].join(' '),
);
