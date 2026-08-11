import { SearchMoonQuarter, NextMoonQuarter } from 'astronomy-engine';

/* ===========================================================
   NOMES INTERNOS DAS FASES

   O Astronomy Engine utiliza:
   0 = Lua Nova
   1 = Quarto Crescente
   2 = Lua Cheia
   3 = Quarto Minguante
=========================================================== */

const MOON_PHASE_NAMES = Object.freeze(['Nova', 'Crescente', 'Cheia', 'Minguante']);

/* ===========================================================
   CACHE DE FASES POR ANO

   Depois que um ano é calculado, o resultado permanece em
   memória para evitar novos cálculos durante a navegação.
=========================================================== */

const moonPhasesByYear = new Map();

/* ===========================================================
   CRIAÇÃO SEGURA DE UMA DATA UTC

   setUTCFullYear evita o comportamento especial do JavaScript
   para anos situados entre 0 e 99.
=========================================================== */

function createUtcDate(year, month, day) {
  const date = new Date(0);

  date.setUTCFullYear(year, month, day);

  date.setUTCHours(0, 0, 0, 0);

  return date;
}

/* ===========================================================
   FORMATAÇÃO NA DATA LOCAL DO USUÁRIO

   Uma fase lunar é um instante astronômico. Dependendo do fuso,
   ela pode acontecer no fim de um dia ou início do seguinte.

   Usar a data local mantém o comportamento atual do aplicativo.
   Em São Paulo, por exemplo, as fases de agosto de 2026 continuam
   aparecendo nos dias 5, 12, 19 e 28.
=========================================================== */

function formatLocalIsoDate(date) {
  return [
    String(date.getFullYear()).padStart(4, '0'),

    String(date.getMonth() + 1).padStart(2, '0'),

    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/* ===========================================================
   CÁLCULO DAS FASES DE UM ANO

   A pesquisa começa dois dias antes e termina dois dias depois
   do ano em UTC. Essa margem impede a perda de uma fase próxima
   da virada do ano por causa do fuso horário.
=========================================================== */

function calculateMoonPhasesForYear(year) {
  const numericYear = Number(year);

  if (!Number.isInteger(numericYear)) {
    throw new TypeError('O ano precisa ser um número inteiro.');
  }

  if (moonPhasesByYear.has(numericYear)) {
    return moonPhasesByYear.get(numericYear);
  }

  const searchStart = createUtcDate(numericYear, 0, 1);

  searchStart.setUTCDate(searchStart.getUTCDate() - 2);

  const searchEnd = createUtcDate(numericYear + 1, 0, 1);

  searchEnd.setUTCDate(searchEnd.getUTCDate() + 2);

  const phases = [];

  let moonQuarter = SearchMoonQuarter(searchStart);

  while (moonQuarter.time.date < searchEnd) {
    const eventDate = moonQuarter.time.date;

    if (eventDate.getFullYear() === numericYear) {
      phases.push({
        data: formatLocalIsoDate(eventDate),

        fase: MOON_PHASE_NAMES[moonQuarter.quarter],

        /* O instante UTC é preservado para que a interface possa
           apresentar o horário correto no fuso local do usuário. */
        instante: eventDate.toISOString(),
      });
    }

    moonQuarter = NextMoonQuarter(moonQuarter);
  }

  moonPhasesByYear.set(numericYear, phases);

  return phases;
}

/* ===========================================================
   TODAS AS FASES DE UM ANO

   Utilizado pelo calendário de 13 meses, que posteriormente
   converte as datas gregorianas para o calendário de 13 meses.
=========================================================== */

export async function obterFasesLuaDoAno(year) {
  return [...calculateMoonPhasesForYear(year)];
}

/* ===========================================================
   FASES DE UM MÊS GREGORIANO

   Mantém a mesma interface que Fases12Lua.vue já utilizava.
=========================================================== */

export async function obterFasesLua(year, month) {
  const numericMonth = Number(month);

  if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12) {
    throw new TypeError('O mês precisa estar entre 1 e 12.');
  }

  const expectedMonth = String(numericMonth).padStart(2, '0');

  const phases = calculateMoonPhasesForYear(year);

  return phases.filter((phase) => {
    const phaseMonth = phase.data.split('-')[1];

    return phaseMonth === expectedMonth;
  });
}
