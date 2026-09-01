import {
  gregorianPartsToInternationalFixed,
  internationalFixedPartsToGregorian,
  isGregorianLeapYear,
} from '../../shared/internationalFixedCalendar.js';

/* ===========================================================
   UTILITÁRIOS COMPARTILHADOS DAS FERRAMENTAS

   Cartões, aniversários, planejador e widget usam estas mesmas
   operações. Nenhum componente deve reconstruir a conversão.
=========================================================== */

export function localDateToIso(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function isoToGregorianParts(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const parts = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };

  return gregorianPartsToInternationalFixed(parts.year, parts.month, parts.day)
    ? parts
    : null;
}

export function gregorianPartsToIso(parts) {
  return [
    String(parts.year).padStart(4, '0'),
    String(parts.month).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join('-');
}

export function gregorianPartsToUtcDate(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function formatGregorianParts(parts, locale, options = {}) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  }).format(gregorianPartsToUtcDate(parts));
}

/* ===========================================================
   DIAS DA SEMANA EM COMPARAÇÕES DIRETAS

   Comparações entre os dois calendários nunca misturam nomes
   abreviados e completos. Em português, a forma destacada não
   usa o sufixo "-feira"; os demais idiomas preservam o nome
   longo natural fornecido pelo Intl.
=========================================================== */

function capitalizeFirstCharacter(value, locale) {
  const [firstCharacter = '', ...remainingCharacters] = Array.from(value);
  return `${firstCharacter.toLocaleUpperCase(locale)}${remainingCharacters.join('')}`;
}

export function formatComparisonWeekday(weekday, locale) {
  const numericWeekday = Number(weekday);
  if (!Number.isInteger(numericWeekday) || numericWeekday < 0 || numericWeekday > 6) return '';

  const referenceSunday = new Date(Date.UTC(2024, 0, 7 + numericWeekday));
  const localizedWeekday = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(referenceSunday);
  const proportionalWeekday = String(locale).toLowerCase().startsWith('pt')
    ? localizedWeekday.replace(/-feira$/iu, '')
    : localizedWeekday;

  return capitalizeFirstCharacter(proportionalWeekday, locale);
}

function keepComparisonSegmentTogether(value) {
  return String(value).replace(/\s/gu, '\u00a0');
}

function composeComparisonTitle(weekday, localizedDate) {
  return `${keepComparisonSegmentTogether(weekday)}\u00a0· ${keepComparisonSegmentTogether(
    localizedDate,
  )}`;
}

export function splitComparisonTitle(title) {
  const match = /^(.*?)\s*·\s*(.+)$/u.exec(String(title || ''));
  if (!match) return null;

  return {
    weekday: match[1].trim(),
    date: match[2].trim(),
  };
}

export function formatGregorianComparison(parts, locale, options = {}) {
  const date = gregorianPartsToUtcDate(parts);
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  delete dateOptions.weekday;
  const formatter = new Intl.DateTimeFormat(locale, {
    ...dateOptions,
    timeZone: 'UTC',
  });
  const weekday = formatComparisonWeekday(date.getUTCDay(), locale);

  return composeComparisonTitle(weekday, formatter.format(date));
}

function matchLocalizedCapitalization(value, referenceValue, locale) {
  const [referenceFirstCharacter = ''] = Array.from(referenceValue);
  const isLowercase =
    referenceFirstCharacter === referenceFirstCharacter.toLocaleLowerCase(locale) &&
    referenceFirstCharacter !== referenceFirstCharacter.toLocaleUpperCase(locale);

  if (isLowercase) {
    const [firstCharacter = '', ...remainingCharacters] = Array.from(value);
    return `${firstCharacter.toLocaleLowerCase(locale)}${remainingCharacters.join('')}`;
  }

  return capitalizeFirstCharacter(value, locale);
}

function gregorianMonthIndexForFixedMonth(fixedMonth) {
  if (fixedMonth >= 1 && fixedMonth <= 6) return fixedMonth - 1;
  if (fixedMonth >= 8 && fixedMonth <= 13) return fixedMonth - 2;
  return null;
}

function formatSolarisMonthDay(day, monthLabel, locale) {
  const referenceMonth = 7;
  const date = new Date(Date.UTC(2024, referenceMonth - 1, day));
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const parts = formatter.formatToParts(date);
  const monthPartIndex = parts.findIndex((part) => part.type === 'month');
  const referenceMonthPart = parts[monthPartIndex]?.value || '';
  const localizedReferenceNumber = new Intl.NumberFormat(locale, {
    useGrouping: false,
  }).format(referenceMonth);
  const monthAffix = referenceMonthPart.includes(localizedReferenceNumber)
    ? referenceMonthPart.replace(localizedReferenceNumber, '')
    : '';
  let localizedMonthLabel = matchLocalizedCapitalization(
    monthLabel,
    referenceMonthPart,
    locale,
  );

  if (monthAffix && !localizedMonthLabel.endsWith(monthAffix)) {
    localizedMonthLabel += monthAffix;
  }

  return parts
    .map((part, index) => {
      if (part.type === 'month') return localizedMonthLabel;

      if (part.type === 'literal' && index === monthPartIndex + 1) {
        const literalSuffix = part.value.trim();
        if (literalSuffix && localizedMonthLabel.endsWith(literalSuffix)) {
          return part.value.replace(literalSuffix, '');
        }
      }

      return part.value;
    })
    .join('');
}

export function formatInternationalFixedMonthDay(day, month, monthLabels, locale) {
  const gregorianMonthIndex = gregorianMonthIndexForFixedMonth(month);
  if (gregorianMonthIndex !== null) {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2024, gregorianMonthIndex, day)));
  }

  return formatSolarisMonthDay(day, monthLabels[month - 1], locale);
}

export function describeInternationalFixedDate(parts, labels, locale = 'en-US') {
  const fixed = gregorianPartsToInternationalFixed(parts.year, parts.month, parts.day);
  if (!fixed) return null;

  if (fixed.isYearDay || fixed.isLeapDay) {
    return {
      ...fixed,
      title: fixed.isYearDay ? labels.yearDay : labels.leapDay,
      caption: labels.specialDays,
    };
  }

  return {
    ...fixed,
    title: composeComparisonTitle(
      labels.weekdays[fixed.weekday],
      formatInternationalFixedMonthDay(fixed.day, fixed.month, labels.months, locale),
    ),
    caption: labels.position(fixed.month, Math.ceil(fixed.day / 7)),
  };
}

/* ===========================================================
   APRESENTAÇÃO ÚNICA PARA COMPARAÇÕES DE DATAS

   Toda superfície comparativa recebe os mesmos quatro dados:
   nome gregoriano completo, nome IFC completo, ano comum aos
   dois calendários e posição IFC. A camada visual decide apenas
   o tamanho, nunca quais informações omitir.
=========================================================== */

export function buildDateComparisonPresentation(parts, locale, labels) {
  const fixed = describeInternationalFixedDate(parts, labels, locale);
  if (!fixed) return null;

  return {
    year: fixed.year,
    gregorianTitle: formatGregorianComparison(parts, locale, { year: undefined }),
    fixedTitle: fixed.title,
    fixedCaption: fixed.caption,
    fixed,
  };
}

export function buildInternationalFixedYear(year) {
  const numericYear = Number(year);
  const months = Array.from({ length: 13 }, (_, index) => {
    const month = index + 1;
    return {
      month,
      start: internationalFixedPartsToGregorian(numericYear, month, 1),
      end: internationalFixedPartsToGregorian(numericYear, month, 28),
      weekday: 0,
    };
  });

  const specialDays = [
    {
      kind: 'year-day',
      gregorian: internationalFixedPartsToGregorian(numericYear, 14, 1),
    },
  ];

  if (isGregorianLeapYear(numericYear)) {
    specialDays.push({
      kind: 'leap-day',
      gregorian: internationalFixedPartsToGregorian(numericYear, 14, 2),
    });
  }

  return { months, specialDays };
}

function escapeIcsText(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll('\n', '\\n');
}

function toIcsDate(parts) {
  return gregorianPartsToIso(parts).replaceAll('-', '');
}

function nextGregorianDay(parts) {
  const date = gregorianPartsToUtcDate(parts);
  date.setUTCDate(date.getUTCDate() + 1);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function createIcsEvent({ date, summary, uid, description = '' }) {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}@13calendar.pages.dev`,
    `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${toIcsDate(date)}`,
    `DTEND;VALUE=DATE:${toIcsDate(nextGregorianDay(date))}`,
    `SUMMARY:${escapeIcsText(summary)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  lines.push('TRANSP:TRANSPARENT', 'END:VEVENT');
  return lines;
}

function foldIcsLine(line) {
  const encoder = new TextEncoder();
  const folded = [];
  let segment = '';

  for (const character of String(line)) {
    const byteLimit = folded.length ? 74 : 75;
    if (segment && encoder.encode(`${segment}${character}`).length > byteLimit) {
      folded.push(segment);
      segment = character;
    } else {
      segment += character;
    }
  }

  if (segment || !folded.length) folded.push(segment);
  return folded.map((value, index) => (index ? ` ${value}` : value));
}

function createIcsCalendar(calendarName, events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//13 Calendar//International Fixed Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    ...events,
    'END:VCALENDAR',
    '',
  ];

  return lines.flatMap(foldIcsLine).join('\r\n');
}

export function createAnnualPlannerIcs(year, monthNames, specialLabels, calendarName = `IFC ${year}`) {
  const plan = buildInternationalFixedYear(year);
  const events = plan.months.flatMap((month) =>
    createIcsEvent({
      date: month.start,
      summary: `${monthNames[month.month - 1]} 1 — IFC`,
      uid: `${year}-ifc-month-${month.month}`,
    }),
  );

  for (const specialDay of plan.specialDays) {
    const summary =
      specialDay.kind === 'year-day' ? specialLabels.yearDay : specialLabels.leapDay;
    events.push(
      ...createIcsEvent({
        date: specialDay.gregorian,
        summary: `${summary} — IFC`,
        uid: `${year}-ifc-${specialDay.kind}`,
      }),
    );
  }

  return createIcsCalendar(calendarName, events);
}

export function createDailyInternationalFixedIcs(year, labels, locale) {
  const numericYear = Number(year);
  const cursor = new Date(Date.UTC(numericYear, 0, 1));
  const events = [];

  while (cursor.getUTCFullYear() === numericYear) {
    const date = {
      year: cursor.getUTCFullYear(),
      month: cursor.getUTCMonth() + 1,
      day: cursor.getUTCDate(),
    };
    const fixed = describeInternationalFixedDate(date, labels, locale);
    const gregorian = formatGregorianComparison(date, locale);

    events.push(
      ...createIcsEvent({
        date,
        summary: `${fixed.title} — IFC`,
        description: `${labels.gregorianDate}: ${gregorian}\n${labels.fixedDate}: ${fixed.title}`,
        uid: `${gregorianPartsToIso(date)}-ifc-daily`,
      }),
    );
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return createIcsCalendar(labels.calendarName, events);
}

export function createFavoriteDatesIcs(favorites, labels, locale) {
  const events = favorites.flatMap((favorite) => {
    const date = isoToGregorianParts(favorite.date);
    if (!date) return [];

    const fixed = describeInternationalFixedDate(date, labels, locale);
    const gregorian = formatGregorianComparison(date, locale);
    const summary = favorite.label || fixed.title;

    return createIcsEvent({
      date,
      summary,
      description: `${labels.gregorianDate}: ${gregorian}\n${labels.fixedDate}: ${fixed.title}`,
      uid: `${favorite.date}-ifc-favorite`,
    });
  });

  return createIcsCalendar(labels.calendarName, events);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas-blob-unavailable'));
    }, type, quality);
  });
}

export async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  document.execCommand('copy');
  input.remove();
}

export function createAbsoluteRouteUrl(path, query = {}) {
  const url = new URL(path, window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && String(value) !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}
