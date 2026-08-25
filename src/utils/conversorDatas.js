import {
  gregorianPartsToInternationalFixed,
  internationalFixedPartsToGregorian,
} from '../../shared/internationalFixedCalendar.js';

/* Formata números de mês e dia com os dois algarismos usados pelas interfaces. */
function padDatePart(value) {
  return String(value).padStart(2, '0');
}

/* ===========================================================
   CONVERSÃO DO GREGORIANO PARA 13 MESES
=========================================================== */

export function converterPara13Meses(dataGregoriana) {
  const [ano, mes, dia] = dataGregoriana.split('-');
  const convertido = gregorianPartsToInternationalFixed(
    Number.parseInt(ano, 10),
    Number.parseInt(mes, 10),
    Number.parseInt(dia, 10),
  );

  if (!convertido) return null;

  return `${ano}-${padDatePart(convertido.month)}-${padDatePart(convertido.day)}`;
}

/* ===========================================================
   CONVERSÃO DE 13 MESES PARA O GREGORIANO
=========================================================== */

export function converterParaGregoriano(data13Meses) {
  const [ano, mes, dia] = data13Meses.split('-');
  const convertido = internationalFixedPartsToGregorian(
    Number.parseInt(ano, 10),
    Number.parseInt(mes, 10),
    Number.parseInt(dia, 10),
  );

  if (!convertido) return null;

  return `${ano}-${padDatePart(convertido.month)}-${padDatePart(convertido.day)}`;
}
