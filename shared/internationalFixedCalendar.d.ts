export interface GregorianDateParts {
  year: number;
  month: number;
  day: number;
}

export interface InternationalFixedDateParts extends GregorianDateParts {
  weekday: number | null;
  isYearDay: boolean;
  isLeapDay: boolean;
}

export const INTERNATIONAL_FIXED_MONTHS: 13;
export const INTERNATIONAL_FIXED_DAYS_PER_MONTH: 28;
export const INTERNATIONAL_FIXED_REGULAR_DAYS: 364;
export const INTERNATIONAL_FIXED_SPECIAL_MONTH: 14;
export const INTERNATIONAL_FIXED_YEAR_DAY: 1;
export const INTERNATIONAL_FIXED_LEAP_DAY: 2;

export function isGregorianLeapYear(year: number): boolean;

export function gregorianPartsToInternationalFixed(
  year: number,
  month: number,
  day: number,
): InternationalFixedDateParts | null;

export function internationalFixedPartsToGregorian(
  year: number,
  month: number,
  day: number,
): GregorianDateParts | null;
