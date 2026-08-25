import { resolve as resolvePath } from 'node:path';

import { readFile } from 'node:fs/promises';

import { createServer } from 'vite';

import {
  mergeProviderAndEditorialHolidays,
  resolveEditorialMergeRuleKey,
  resolveProviderMergeRuleKey,
} from '../src/holidays/holidayMerge.js';
import { consolidateSubstituteHolidays } from '../src/holidays/holidaySubstitution.js';

import Holidays from 'date-holidays-parser';

const dateHolidaysData = JSON.parse(
  await readFile(resolvePath(process.cwd(), 'src/holidays/generated/dateHolidays.json'), 'utf8'),
);

/* ===========================================================
   UTILITÁRIOS DA AUDITORIA
=========================================================== */

const errors = [];

function assertEqual(actual, expected, context) {
  if (actual !== expected) {
    errors.push(`${context}: esperado ${expected}, recebido ${actual}.`);
  }
}

function createProviderHoliday({ id, date, type, concept, providerRuleTokens }) {
  return {
    id,
    country: 'XX',
    date,
    type,
    concept,
    providerRule: id,
    providerRuleTokens,
  };
}

function createEditorialHoliday({ id, date, type, nameId, rule }) {
  return {
    id,
    country: 'XX',
    date,
    type,
    nameId,
    rule,
  };
}

/* ===========================================================
   EQUIVALÊNCIA ENTRE AS DUAS GRAMÁTICAS
=========================================================== */

assertEqual(
  resolveEditorialMergeRuleKey({ kind: 'fixed', month: 1, day: 6 }),
  resolveProviderMergeRuleKey([{ fn: 'gregorian', month: 1, day: 6 }]),
  'Data fixa',
);

assertEqual(
  resolveEditorialMergeRuleKey({ kind: 'easterOffset', days: -48 }),
  resolveProviderMergeRuleKey([{ fn: 'easter', type: 'easter', offset: -48 }]),
  'Deslocamento da Páscoa',
);

assertEqual(
  resolveEditorialMergeRuleKey({
    kind: 'nthWeekday',
    month: 5,
    weekday: 0,
    occurrence: 2,
  }),
  resolveProviderMergeRuleKey([
    { fn: 'gregorian', month: 5, day: 1 },
    { rule: 'dateDir', direction: 'after', weekday: 'sunday', count: 2 },
  ]),
  'Segunda ocorrência semanal',
);

/* ===========================================================
   REGRESSÕES DOS SEIS PAÍSES HÍBRIDOS
=========================================================== */

const carnivalMonday = createProviderHoliday({
  id: 'provider-carnival-monday',
  date: '2026-02-16',
  type: 'bank',
  concept: 'generic_bank',
  providerRuleTokens: [{ fn: 'easter', type: 'easter', offset: -48 }],
});
const carnivalTuesday = createProviderHoliday({
  id: 'provider-carnival-tuesday',
  date: '2026-02-17',
  type: 'bank',
  concept: 'generic_bank',
  providerRuleTokens: [{ fn: 'easter', type: 'easter', offset: -47 }],
});
const mergedCarnival = mergeProviderAndEditorialHolidays(
  [carnivalMonday, carnivalTuesday],
  [
    createEditorialHoliday({
      id: 'editorial-carnival-monday',
      date: '2026-02-16',
      type: 'optional',
      nameId: 'carnivalMonday',
      rule: { kind: 'easterOffset', days: -48 },
    }),
    createEditorialHoliday({
      id: 'editorial-carnival-tuesday',
      date: '2026-02-17',
      type: 'optional',
      nameId: 'carnivalTuesday',
      rule: { kind: 'easterOffset', days: -47 },
    }),
  ],
);

assertEqual(mergedCarnival.length, 2, 'Carnaval sem duplicação');
assertEqual(mergedCarnival[0].date, '2026-02-16', 'Segunda-feira de Carnaval');
assertEqual(mergedCarnival[1].date, '2026-02-17', 'Terça-feira de Carnaval');

const mergedEpiphany = mergeProviderAndEditorialHolidays(
  [
    createProviderHoliday({
      id: 'provider-epiphany',
      date: '2026-01-06',
      type: 'public',
      concept: 'generic_public',
      providerRuleTokens: [{ fn: 'gregorian', month: 1, day: 6 }],
    }),
  ],
  [
    createEditorialHoliday({
      id: 'editorial-epiphany',
      date: '2026-01-06',
      type: 'optional',
      nameId: 'epiphany',
      rule: { kind: 'fixed', month: 1, day: 6 },
    }),
  ],
);

assertEqual(mergedEpiphany.length, 1, 'Epifania sem duplicação');

/* Duas comemorações realmente distintas na mesma data precisam
   continuar separadas, como Ascensão e Dia dos Pais na Alemanha. */
const mergedDistinctEvents = mergeProviderAndEditorialHolidays(
  [
    createProviderHoliday({
      id: 'provider-ascension',
      date: '2026-05-14',
      type: 'public',
      concept: 'generic_public',
      providerRuleTokens: [{ fn: 'easter', type: 'easter', offset: 39 }],
    }),
  ],
  [
    createEditorialHoliday({
      id: 'editorial-ascension',
      date: '2026-05-14',
      type: 'public',
      nameId: 'ascensionDay',
      rule: { kind: 'easterOffset', days: 39 },
    }),
    createEditorialHoliday({
      id: 'editorial-fathers-day',
      date: '2026-05-14',
      type: 'observance',
      nameId: 'fathersDay',
      rule: { kind: 'easterOffset', days: 39 },
    }),
  ],
);

assertEqual(mergedDistinctEvents.length, 2, 'Eventos distintos na mesma data');

/* Uma sequência de vários dias com o mesmo conceito não pode
   usar a correspondência semântica para trocar um dia por outro.
   A base russa agrupa parte das férias de Ano-Novo, enquanto o
   complemento editorial registra cada data oficial separadamente. */
const mergedRussianNewYearHolidays = mergeProviderAndEditorialHolidays(
  [
    createProviderHoliday({
      id: 'provider-new-year-january-2',
      date: '2026-01-02',
      type: 'public',
      concept: 'new_year',
      providerRuleTokens: [{ fn: 'gregorian', month: 1, day: 2 }],
    }),
    createProviderHoliday({
      id: 'provider-new-year-january-8',
      date: '2026-01-08',
      type: 'public',
      concept: 'new_year',
      providerRuleTokens: [{ fn: 'gregorian', month: 1, day: 8 }],
    }),
  ],
  [
    createEditorialHoliday({
      id: 'editorial-new-year-january-2',
      date: '2026-01-02',
      type: 'public',
      nameId: 'newYearHolidayJanuary2',
      rule: { kind: 'fixed', month: 1, day: 2 },
    }),
    createEditorialHoliday({
      id: 'editorial-new-year-january-3',
      date: '2026-01-03',
      type: 'public',
      nameId: 'newYearHolidayJanuary3',
      rule: { kind: 'fixed', month: 1, day: 3 },
    }),
    createEditorialHoliday({
      id: 'editorial-new-year-january-8',
      date: '2026-01-08',
      type: 'public',
      nameId: 'newYearHolidayJanuary8',
      rule: { kind: 'fixed', month: 1, day: 8 },
    }),
  ],
);

assertEqual(mergedRussianNewYearHolidays.length, 3, 'Férias russas sem perda ou duplicação');
assertEqual(mergedRussianNewYearHolidays[0].date, '2026-01-02', 'Ano-Novo russo em 2 de janeiro');
assertEqual(mergedRussianNewYearHolidays[1].date, '2026-01-03', 'Ano-Novo russo em 3 de janeiro');
assertEqual(mergedRussianNewYearHolidays[2].date, '2026-01-08', 'Ano-Novo russo em 8 de janeiro');

/* Uma regra condicional sem substitute:true também deve preservar
   a data civil e identificar separadamente a data observada. */
const consolidatedConditionalMove = consolidateSubstituteHolidays([
  {
    date: '2026-03-08',
    name: "International Women's Day",
    rule: '03-08 and if sunday then next monday',
    type: 'public',
  },
  {
    date: '2026-03-09',
    name: "International Women's Day",
    rule: '03-08 and if sunday then next monday',
    type: 'public',
  },
]);

assertEqual(consolidatedConditionalMove.length, 2, 'Data civil e data observada preservadas');
assertEqual(consolidatedConditionalMove[0].date, '2026-03-08', 'Data civil preservada');
assertEqual(consolidatedConditionalMove[1].date, '2026-03-09', 'Data observada preservada');
assertEqual(
  consolidatedConditionalMove[1].occurrenceKind,
  'observed',
  'Data condicional identificada como observada',
);

/* Um feriado observado no fim do ano pode pertencer ao ano civil
   seguinte. Ele não pode apagar a ocorrência do janeiro anterior. */
const consolidatedCrossYear = consolidateSubstituteHolidays([
  {
    date: '2027-01-01',
    name: "New Year's Day",
    rule: '01-01 and if sunday then next monday if saturday then previous friday',
    type: 'public',
  },
  {
    date: '2027-12-31',
    name: "New Year's Day (substitute day)",
    rule: '01-01 and if sunday then next monday if saturday then previous friday',
    type: 'public',
    substitute: true,
  },
]);

assertEqual(consolidatedCrossYear.length, 3, 'Transferência entre anos preservada');
assertEqual(
  consolidatedCrossYear[1].observedForDate,
  '2028-01-01',
  'Data civil do ano seguinte identificada',
);

const mergedMovedHoliday = mergeProviderAndEditorialHolidays(
  [
    createProviderHoliday({
      id: 'provider-womens-day',
      date: '2026-03-09',
      type: 'public',
      concept: 'generic_public',
      providerRuleTokens: [{ fn: 'gregorian', month: 3, day: 8 }],
    }),
  ].map((holiday) => ({
    ...holiday,
    movedFromDate: '2026-03-08',
  })),
  [
    createEditorialHoliday({
      id: 'editorial-womens-day',
      date: '2026-03-08',
      type: 'public',
      nameId: 'womensDay',
      rule: { kind: 'fixed', month: 3, day: 8 },
    }),
    createEditorialHoliday({
      id: 'editorial-womens-day-off',
      date: '2026-03-09',
      type: 'substitute',
      nameId: 'dayOffForWomensDay',
      rule: { kind: 'yearSpecific', dates: { 2026: { month: 3, day: 9 } } },
    }),
  ],
);

assertEqual(mergedMovedHoliday.length, 1, 'Complemento da transferência sem duplicação');

/* ===========================================================
   VARREDURA REAL DOS SEIS PAÍSES HÍBRIDOS

   O carregamento pelo Vite utiliza os mesmos aliases e módulos
   da aplicação. Assim, a auditoria percorre a saída final depois
   das traduções, transferências e complementos editoriais.
=========================================================== */

const auditedCountries = ['BR', 'US', 'FR', 'ES', 'DE', 'RU'];
const centralYear = Number(process.argv.at(-1)) || new Date().getFullYear();
const auditedYears = Array.from({ length: 5 }, (_value, index) => centralYear - 2 + index);
const viteServer = await createServer({
  root: process.cwd(),
  resolve: {
    alias: {
      src: resolvePath(process.cwd(), 'src'),
    },
  },
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
  logLevel: 'silent',
});
let auditedOccurrenceCount = 0;

try {
  const holidayEngine = await viteServer.ssrLoadModule('/src/holidays/holidayEngine.js');
  const dateHolidayProvider = await viteServer.ssrLoadModule(
    '/src/holidays/dateHolidayProvider.js',
  );

  dateHolidayProvider.initializeDateHolidayProvider({
    Holidays,
    data: dateHolidaysData,
  });

  for (const country of auditedCountries) {
    for (const year of auditedYears) {
      const holidays = [];

      for (let month = 1; month <= 12; month += 1) {
        holidays.push(
          ...holidayEngine.getGregorianHolidaysForMonth({
            country,
            year,
            month,
            locale: 'pt-BR',
          }),
        );
      }

      auditedOccurrenceCount += holidays.length;

      /* Toda folga editorial ou internacional classificada como
         substitutiva precisa chegar à interface como observada. */
      holidays
        .filter((holiday) => holiday.type === 'substitute')
        .forEach((holiday) => {
          if (holiday.occurrenceKind !== 'observed') {
            errors.push(
              `${country}/${year}/${holiday.date}: substituição ` +
                `${holiday.id} não foi classificada como observada.`,
            );
          }
        });

      /* Nenhum ajuste de expediente gregoriano deve vazar para o
         calendário 13, em nenhum dos seus dois modos. Períodos
         oficiais permanecem porque usam o tipo civil normal. */
      for (const mode of ['native', 'corresponding']) {
        for (let month = 1; month <= 14; month += 1) {
          const calendar13Holidays = holidayEngine.getThirteenMonthHolidaysForMonth({
            country,
            year,
            month,
            locale: 'pt-BR',
            mode,
          });

          calendar13Holidays
            .filter(
              (holiday) => holiday.type === 'substitute' || holiday.occurrenceKind === 'observed',
            )
            .forEach((holiday) => {
              errors.push(
                `${country}/${year}/${mode}/${holiday.date13}: substituição ` +
                  `${holiday.id} apareceu no calendário 13.`,
              );
            });
        }
      }

      const holidaysByDate = Map.groupBy(holidays, (holiday) => holiday.date);

      holidaysByDate.forEach((sameDateHolidays, date) => {
        const holidaysByRuleKey = new Map();

        sameDateHolidays.forEach((holiday) => {
          const ruleKey =
            resolveEditorialMergeRuleKey(holiday.rule) ||
            resolveProviderMergeRuleKey(holiday.providerRuleTokens);

          if (!ruleKey) {
            return;
          }

          const previousHoliday = holidaysByRuleKey.get(ruleKey);
          const previousIsUnmergedProvider = previousHoliday?.id?.includes('_DH_');
          const currentIsUnmergedProvider = holiday.id?.includes('_DH_');

          /* Duas datas editoriais podem compartilhar de propósito a
             mesma regra, como Ascensão e Dia dos Pais na Alemanha.
             A falha de mesclagem exige que uma das linhas ainda seja
             uma ocorrência bruta da base (_DH_). */
          if (
            previousHoliday &&
            previousIsUnmergedProvider !== currentIsUnmergedProvider &&
            (previousIsUnmergedProvider || currentIsUnmergedProvider)
          ) {
            errors.push(
              `${country}/${year}/${date}: regra ${ruleKey} permaneceu separada ` +
                `em ${previousHoliday.nameId} e ${holiday.nameId}.`,
            );
            return;
          }

          if (!previousHoliday || previousIsUnmergedProvider) {
            holidaysByRuleKey.set(ruleKey, holiday);
          }
        });
      });
    }
  }
} finally {
  await viteServer.close();
}

/* ===========================================================
   RESULTADO
=========================================================== */

if (errors.length > 0) {
  throw new Error(`A auditoria da mesclagem encontrou problemas:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Mesclagem híbrida auditada em ${auditedOccurrenceCount} ocorrências de ` +
    `${auditedCountries.length} países na janela ${auditedYears.at(0)}–${auditedYears.at(-1)}.`,
);
