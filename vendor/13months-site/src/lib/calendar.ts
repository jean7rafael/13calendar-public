import {
  gregorianPartsToInternationalFixed,
  internationalFixedPartsToGregorian,
  isGregorianLeapYear,
} from '../../../../shared/internationalFixedCalendar.js';

export const IFC_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'Sol',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const IFC_WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const IFC_WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const GREGORIAN_MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface IFCDate {
  month: number | null;
  day: number | null;
  year: number;
  monthName: string;
  weekday: number | null;
  isYearDay: boolean;
  isLeapDay: boolean;
}

export function isLeapYear(year: number): boolean {
  return isGregorianLeapYear(year);
}

export function fromIFC(year: number, monthNumber: number, day: number): Date {
  const converted = internationalFixedPartsToGregorian(year, monthNumber, day);
  return converted
    ? new Date(converted.year, converted.month - 1, converted.day)
    : new Date(Number.NaN);
}

export function fromIFCYearDay(year: number): Date {
  const converted = internationalFixedPartsToGregorian(year, 14, 1)!;
  return new Date(converted.year, converted.month - 1, converted.day);
}

export function fromIFCLeapDay(year: number): Date | null {
  const converted = internationalFixedPartsToGregorian(year, 14, 2);
  return converted ? new Date(converted.year, converted.month - 1, converted.day) : null;
}

export function toIFC(gregorian: Date): IFCDate {
  const year = gregorian.getFullYear();
  const converted = gregorianPartsToInternationalFixed(
    year,
    gregorian.getMonth() + 1,
    gregorian.getDate(),
  );

  if (!converted) {
    return {
      month: null,
      day: null,
      year,
      monthName: '',
      weekday: null,
      isYearDay: false,
      isLeapDay: false,
    };
  }

  if (converted.isYearDay) {
    return {
      month: null,
      day: null,
      year,
      monthName: 'Year Day',
      weekday: null,
      isYearDay: true,
      isLeapDay: false,
    };
  }

  if (converted.isLeapDay) {
    return {
      month: null,
      day: null,
      year,
      monthName: 'Leap Day',
      weekday: null,
      isYearDay: false,
      isLeapDay: true,
    };
  }

  const monthIndex = converted.month - 1;

  return {
    month: monthIndex + 1,
    day: converted.day,
    year,
    monthName: IFC_MONTH_NAMES[monthIndex],
    weekday: converted.weekday,
    isYearDay: false,
    isLeapDay: false,
  };
}

export function formatIFC(ifc: IFCDate): string {
  if (ifc.isYearDay) return `Year Day, ${ifc.year}`;
  if (ifc.isLeapDay) return `Leap Day, ${ifc.year}`;
  return `${IFC_WEEKDAY_NAMES[ifc.weekday!]}, ${ifc.monthName} ${ifc.day}, ${ifc.year}`;
}

export function formatGregorian(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ===========================================================
   ORDEM LOCALIZADA DE MÊS E DIA

   O Calendário Fixo não pode concatenar sempre "mês + dia":
   português e espanhol usam preposição, alemão usa ponto e os
   idiomas do leste asiático acrescentam seus próprios sufixos.
   O Intl fornece a ordem e a gramática dos 12 meses comuns. Para
   Sol, preservamos o mesmo molde e trocamos somente o nome do mês.
=========================================================== */

export function formatIFCMonthDay(
  monthName: string,
  day: number,
  locale = 'en-US',
  localizedSol = 'Sol',
): string {
  const gregorianMonthIndex = GREGORIAN_MONTH_NAMES.indexOf(monthName);
  const templateMonthIndex = gregorianMonthIndex >= 0 ? gregorianMonthIndex : 0;
  const templateDate = new Date(Date.UTC(2024, templateMonthIndex, day));
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  if (monthName !== 'Sol') {
    return formatter.format(templateDate);
  }

  return formatter
    .formatToParts(templateDate)
    .map((part) => (part.type === 'month' ? localizedSol : part.value))
    .join('');
}

export function formatGregorianMonthDay(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  });
}

export function generateFullYear(year: number) {
  const months = IFC_MONTH_NAMES.map((name, i) => ({
    name,
    monthNumber: i + 1,
    days: Array.from({ length: 28 }, (_, d) => ({
      day: d + 1,
      weekday: d % 7,
    })),
  }));

  return { months, hasLeapDay: isLeapYear(year) };
}
