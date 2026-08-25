/* ===========================================================
   NÚCLEO COMPARTILHADO DO CALENDÁRIO FIXO INTERNACIONAL

   O aplicativo Vue e a página incorporada usam estas funções
   para que a mesma data nunca receba conversões diferentes.
   Os 364 dias comuns ocupam 13 meses de 28 dias. O Dia do Ano
   vem depois de dezembro 28 e, em anos bissextos, o Dia
   Bissexto vem imediatamente depois do Dia do Ano.
=========================================================== */

export const INTERNATIONAL_FIXED_MONTHS = 13;
export const INTERNATIONAL_FIXED_DAYS_PER_MONTH = 28;
export const INTERNATIONAL_FIXED_REGULAR_DAYS = 364;
export const INTERNATIONAL_FIXED_SPECIAL_MONTH = 14;
export const INTERNATIONAL_FIXED_YEAR_DAY = 1;
export const INTERNATIONAL_FIXED_LEAP_DAY = 2;

/* Identifica anos bissextos pelas regras do calendário gregoriano. */
export function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/* Valida e converte uma data gregoriana em seu número ordinal no ano. */
function gregorianDayOfYear(year, month, day) {
  const timestamp = Date.UTC(year, month - 1, day);
  const normalized = new Date(timestamp);

  if (
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day
  ) {
    return null;
  }

  return Math.floor((timestamp - Date.UTC(year, 0, 1)) / 86_400_000) + 1;
}

/* Reconstrói partes gregorianas sem depender do fuso horário do navegador. */
function gregorianPartsFromDayOfYear(year, dayOfYear) {
  const date = new Date(Date.UTC(year, 0, dayOfYear));

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/* Converte partes gregorianas para os 13 meses e os Dias Especiais. */
export function gregorianPartsToInternationalFixed(year, month, day) {
  const dayOfYear = gregorianDayOfYear(year, month, day);
  if (dayOfYear === null) return null;

  if (dayOfYear === 365) {
    return {
      year,
      month: INTERNATIONAL_FIXED_SPECIAL_MONTH,
      day: INTERNATIONAL_FIXED_YEAR_DAY,
      weekday: null,
      isYearDay: true,
      isLeapDay: false,
    };
  }

  if (dayOfYear === 366 && isGregorianLeapYear(year)) {
    return {
      year,
      month: INTERNATIONAL_FIXED_SPECIAL_MONTH,
      day: INTERNATIONAL_FIXED_LEAP_DAY,
      weekday: null,
      isYearDay: false,
      isLeapDay: true,
    };
  }

  if (dayOfYear < 1 || dayOfYear > INTERNATIONAL_FIXED_REGULAR_DAYS) return null;

  const fixedMonth = Math.floor((dayOfYear - 1) / INTERNATIONAL_FIXED_DAYS_PER_MONTH) + 1;
  const fixedDay = ((dayOfYear - 1) % INTERNATIONAL_FIXED_DAYS_PER_MONTH) + 1;

  return {
    year,
    month: fixedMonth,
    day: fixedDay,
    weekday: (fixedDay - 1) % 7,
    isYearDay: false,
    isLeapDay: false,
  };
}

/* Converte os 13 meses e os Dias Especiais para partes gregorianas. */
export function internationalFixedPartsToGregorian(year, month, day) {
  let dayOfYear;

  if (month === INTERNATIONAL_FIXED_SPECIAL_MONTH) {
    if (day === INTERNATIONAL_FIXED_YEAR_DAY) {
      dayOfYear = 365;
    } else if (day === INTERNATIONAL_FIXED_LEAP_DAY && isGregorianLeapYear(year)) {
      dayOfYear = 366;
    } else {
      return null;
    }
  } else {
    const isRegularDate =
      Number.isInteger(month) &&
      Number.isInteger(day) &&
      month >= 1 &&
      month <= INTERNATIONAL_FIXED_MONTHS &&
      day >= 1 &&
      day <= INTERNATIONAL_FIXED_DAYS_PER_MONTH;

    if (!isRegularDate) return null;
    dayOfYear = (month - 1) * INTERNATIONAL_FIXED_DAYS_PER_MONTH + day;
  }

  return gregorianPartsFromDayOfYear(year, dayOfYear);
}
