#!/usr/bin/env node

/* ===========================================================
   AUDITORIA DO NÚCLEO COMPARTILHADO DE CONVERSÃO

   Protege especialmente a posição dos Dias Especiais. Assim,
   qualquer mudança futura precisa manter o Dia do Ano após os
   364 dias comuns e o Dia Bissexto imediatamente depois dele.
=========================================================== */

import assert from 'node:assert/strict';
import {
  gregorianPartsToInternationalFixed,
  internationalFixedPartsToGregorian,
} from '../shared/internationalFixedCalendar.js';
import { converterPara13Meses, converterParaGregoriano } from '../src/utils/conversorDatas.js';
import {
  buildDateComparisonPresentation,
  createAnnualPlannerIcs,
  createDailyInternationalFixedIcs,
  createFavoriteDatesIcs,
  formatComparisonWeekday,
} from '../src/utils/calendarTools.js';

const conversionCases = [
  ['2027-12-30', '2027-13-28'],
  ['2027-12-31', '2027-14-01'],
  ['2028-12-29', '2028-13-28'],
  ['2028-12-30', '2028-14-01'],
  ['2028-12-31', '2028-14-02'],
];

for (const [gregorian, fixed] of conversionCases) {
  assert.equal(converterPara13Meses(gregorian), fixed, `${gregorian} deveria resultar em ${fixed}`);
  assert.equal(
    converterParaGregoriano(fixed),
    gregorian,
    `${fixed} deveria resultar em ${gregorian}`,
  );
}

assert.equal(internationalFixedPartsToGregorian(2027, 14, 2), null);
assert.deepEqual(internationalFixedPartsToGregorian(2028, 14, 2), {
  year: 2028,
  month: 12,
  day: 31,
});
assert.deepEqual(gregorianPartsToInternationalFixed(2028, 12, 31), {
  year: 2028,
  month: 14,
  day: 2,
  weekday: null,
  isYearDay: false,
  isLeapDay: true,
});

/* ===========================================================
   ORDEM VISUAL DE MÊS E DIA NOS 12 IDIOMAS

   O Intl define se cada idioma escreve "August 27" ou
   "27 de agosto". A apresentação IFC precisa seguir a mesma
   ordem do lado gregoriano e os dois usam o ponto intermediário.
=========================================================== */

const supportedLocales = [
  'pt-BR',
  'en-US',
  'fr-FR',
  'es-ES',
  'de-DE',
  'ru-RU',
  'it-IT',
  'zh-CN',
  'ja-JP',
  'ar-SA',
  'hi-IN',
  'ko-KR',
];
const comparisonParts = { year: 2026, month: 8, day: 27 };

function tokenPrecedes(text, firstToken, secondToken) {
  const firstIndex = text.indexOf(firstToken);
  const secondIndex = text.indexOf(secondToken);
  assert.notEqual(firstIndex, -1, `${firstToken} deveria aparecer em ${text}`);
  assert.notEqual(secondIndex, -1, `${secondToken} deveria aparecer em ${text}`);
  return firstIndex < secondIndex;
}

for (const locale of supportedLocales) {
  const catalog = (await import(`../src/i18n/${locale}.js`)).default;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const gregorianDate = new Date(Date.UTC(2026, 7, 27));
  const fixedDate = new Date(Date.UTC(2026, 7, 15));
  const gregorianParts = dateFormatter.formatToParts(gregorianDate);
  const monthToken = gregorianParts.find((part) => part.type === 'month').value;
  const gregorianDayToken = gregorianParts.find((part) => part.type === 'day').value;
  const fixedDayToken = dateFormatter
    .formatToParts(fixedDate)
    .find((part) => part.type === 'day').value;
  const expectedMonthFirst =
    gregorianParts.findIndex((part) => part.type === 'month') <
    gregorianParts.findIndex((part) => part.type === 'day');
  const comparison = buildDateComparisonPresentation(comparisonParts, locale, {
    months: catalog.calendar.months13Long,
    weekdays: Array.from({ length: 7 }, (_, index) =>
      formatComparisonWeekday(index, locale),
    ),
    yearDay: catalog.calendar.specialDays.yearDay,
    leapDay: catalog.calendar.specialDays.leapDay,
    specialDays: catalog.calendar.specialDays.title,
    position: (month, week) => `${month}/${week}`,
  });

  assert.ok(comparison.gregorianTitle.includes('\u00a0· '));
  assert.ok(comparison.fixedTitle.includes('\u00a0· '));
  assert.equal(comparison.gregorianTitle.split('· ')[1].includes(' '), false);
  assert.equal(comparison.fixedTitle.split('· ')[1].includes(' '), false);
  assert.equal(
    tokenPrecedes(comparison.gregorianTitle, monthToken, gregorianDayToken),
    expectedMonthFirst,
    `${locale}: a ordem gregoriana deve seguir o idioma`,
  );
  assert.equal(
    tokenPrecedes(comparison.fixedTitle, monthToken, fixedDayToken),
    expectedMonthFirst,
    `${locale}: a ordem IFC deve acompanhar o lado gregoriano`,
  );
}

/* ===========================================================
   EXPORTAÇÕES PARA APLICATIVOS DE CALENDÁRIO

   O ICS continua gregoriano por compatibilidade, mas precisa
   preservar a equivalência IFC nos três níveis de detalhe.
=========================================================== */

const icsLabels = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'Solaris',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  yearDay: 'Year Day',
  leapDay: 'Leap Day',
  specialDays: 'Special Days',
  position: (month, week) => `${month}/${week}`,
  gregorianDate: 'Gregorian date',
  fixedDate: 'IFC date',
  calendarName: 'IFC 2026',
};

const milestoneIcs = createAnnualPlannerIcs(
  2026,
  icsLabels.months,
  icsLabels,
  icsLabels.calendarName,
);
const dailyIcs = createDailyInternationalFixedIcs(2026, icsLabels, 'en-US');
const leapDailyIcs = createDailyInternationalFixedIcs(
  2028,
  { ...icsLabels, calendarName: 'IFC 2028' },
  'en-US',
);
const favoriteIcs = createFavoriteDatesIcs(
  [{ date: '2026-08-29', label: 'Review' }],
  icsLabels,
  'en-US',
);
const countEvents = (contents) => (contents.match(/BEGIN:VEVENT/g) || []).length;
const longestIcsLine = (contents) =>
  Math.max(
    ...contents
      .split('\r\n')
      .map((line) => new TextEncoder().encode(line).length),
  );

assert.equal(countEvents(milestoneIcs), 14);
assert.equal(countEvents(dailyIcs), 365);
assert.equal(countEvents(leapDailyIcs), 366);
assert.equal(countEvents(favoriteIcs), 1);
assert.ok(milestoneIcs.includes('DTSTART;VALUE=DATE:20260910'));
assert.ok(milestoneIcs.includes('SUMMARY:September 1 — IFC'));
assert.ok(dailyIcs.includes('SUMMARY:Year Day — IFC'));
assert.ok(favoriteIcs.includes('SUMMARY:Review'));
assert.ok(longestIcsLine(milestoneIcs) <= 75);
assert.ok(longestIcsLine(dailyIcs) <= 75);
assert.ok(longestIcsLine(favoriteIcs) <= 75);

console.log(
  'Conversões compartilhadas auditadas: Dias Especiais, comparações nos 12 idiomas e três modos ICS estão consistentes.',
);
