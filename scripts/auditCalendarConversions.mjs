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

console.log('Conversões compartilhadas auditadas: Dia do Ano e Dia Bissexto estão consistentes.');
