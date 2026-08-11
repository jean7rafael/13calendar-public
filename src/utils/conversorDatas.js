import { tabela365, tabela366 } from './tabelaDias.js';

/* ===========================================================
   IDENTIFICAÇÃO DE ANOS BISSEXTOS
=========================================================== */

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/* ===========================================================
   CONVERSÃO DO GREGORIANO PARA 13 MESES
=========================================================== */

export function converterPara13Meses(dataGregoriana) {
  const [ano, mes, dia] = dataGregoriana.split('-');
  const anoInt = parseInt(ano, 10);
  const tabela = isLeapYear(anoInt) ? tabela366 : tabela365;

  const encontrado = tabela.find((entrada) => entrada.gregoriano === `${mes}-${dia}`);

  if (!encontrado) {
    return null;
  }

  return `${ano}-${encontrado.trezeMeses}`;
}

/* ===========================================================
   CONVERSÃO DE 13 MESES PARA O GREGORIANO
=========================================================== */

export function converterParaGregoriano(data13Meses) {
  const [ano, mes, dia] = data13Meses.split('-');
  const anoInt = parseInt(ano, 10);
  const tabela = isLeapYear(anoInt) ? tabela366 : tabela365;

  const encontrado = tabela.find((entrada) => entrada.trezeMeses === `${mes}-${dia}`);

  if (!encontrado) {
    return null;
  }

  return `${ano}-${encontrado.gregoriano}`;
}
