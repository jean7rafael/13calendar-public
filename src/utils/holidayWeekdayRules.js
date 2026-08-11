/* ===========================================================
   FORMATAÇÃO SEGURA DE DATAS SEM FUSO HORÁRIO
=========================================================== */

function formatIsoDate(year, month, day) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function hasValidWeekdayParameters(year, month, weekday) {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(weekday) &&
    weekday >= 0 &&
    weekday <= 6
  );
}

/* ===========================================================
   N-ÉSIMA OCORRÊNCIA DE UM DIA DA SEMANA

   weekday segue Date#getUTCDay:
   0 = domingo, 1 = segunda-feira, ... 6 = sábado.
=========================================================== */

export function calculateNthWeekday(year, month, weekday, occurrence) {
  if (
    !hasValidWeekdayParameters(year, month, weekday) ||
    !Number.isInteger(occurrence) ||
    occurrence < 1 ||
    occurrence > 5
  ) {
    return null;
  }

  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const difference = (weekday - firstDay.getUTCDay() + 7) % 7;
  const day = 1 + difference + (occurrence - 1) * 7;

  if (day > new Date(Date.UTC(year, month, 0)).getUTCDate()) {
    return null;
  }

  return formatIsoDate(year, month, day);
}

/* ===========================================================
   ÚLTIMA OCORRÊNCIA DE UM DIA DA SEMANA
=========================================================== */

export function calculateLastWeekday(year, month, weekday) {
  if (!hasValidWeekdayParameters(year, month, weekday)) {
    return null;
  }

  const lastDay = new Date(Date.UTC(year, month, 0));
  const difference = (lastDay.getUTCDay() - weekday + 7) % 7;

  return formatIsoDate(year, month, lastDay.getUTCDate() - difference);
}

/* ===========================================================
   DIA DA SEMANA NA DATA OU ANTES DELA
=========================================================== */

export function calculateWeekdayOnOrBefore(year, month, day, weekday) {
  if (
    !hasValidWeekdayParameters(year, month, weekday) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  ) {
    return null;
  }

  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const difference = (targetDate.getUTCDay() - weekday + 7) % 7;

  targetDate.setUTCDate(targetDate.getUTCDate() - difference);

  return formatIsoDate(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate(),
  );
}

/* ===========================================================
   DIA DA SEMANA NA DATA OU DEPOIS DELA
=========================================================== */

export function calculateWeekdayOnOrAfter(year, month, day, weekday) {
  if (
    !hasValidWeekdayParameters(year, month, weekday) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  ) {
    return null;
  }

  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const difference = (weekday - targetDate.getUTCDay() + 7) % 7;

  targetDate.setUTCDate(targetDate.getUTCDate() + difference);

  return formatIsoDate(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate(),
  );
}

/* ===========================================================
   DIA DA SEMANA ESTRITAMENTE ANTERIOR À DATA

   Diferentemente de "na data ou antes", quando a data-base
   já cai no dia solicitado esta função recua sete dias.
=========================================================== */

export function calculateWeekdayBefore(year, month, day, weekday) {
  if (
    !hasValidWeekdayParameters(year, month, weekday) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  ) {
    return null;
  }

  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const difference = ((targetDate.getUTCDay() - weekday + 6) % 7) + 1;

  targetDate.setUTCDate(targetDate.getUTCDate() - difference);

  return formatIsoDate(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate(),
  );
}

/* ===========================================================
   DIA DA SEMANA ESTRITAMENTE POSTERIOR À DATA

   Quando a data-base já cai no dia solicitado, avança sete
   dias. Isso representa regras como "sexta-feira depois de".
=========================================================== */

export function calculateWeekdayAfter(year, month, day, weekday) {
  if (
    !hasValidWeekdayParameters(year, month, weekday) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  ) {
    return null;
  }

  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const difference = ((weekday - targetDate.getUTCDay() + 6) % 7) + 1;

  targetDate.setUTCDate(targetDate.getUTCDate() + difference);

  return formatIsoDate(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate(),
  );
}
