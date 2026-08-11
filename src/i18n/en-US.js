/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
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

const months12Short = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Date conversion: Gregorian Calendar – International Fixed Calendar',
  },

  introduction: {
    eyebrow: 'Visual integration',
    title: 'A natural companion to 13months.net',
    description:
      "This page explores the same family of colors, contrast, borders, and shapes as the reference project without changing the application's main screen.",
  },

  footer: {
    ariaLabel: 'Information footer',
    title: 'Dates deserve context',
    description: 'Compare calendars with transparent sources and clearly stated limitations.',
    sourcesTitle: 'Sources',
    sourcesText:
      'Holiday data combines date-holidays with reviewed official sources. Moon phases and date conversions are calculated locally.',
    privacyTitle: 'Privacy',
    privacyText:
      'No account is required. Your language, theme, and country preferences stay in this browser.',
    limitationsTitle: 'Data limitations',
    limitationsText:
      'Government holiday coverage varies by country and year. The app identifies years without confirmed official dates.',
    disclaimer:
      'An independent companion for the International Fixed Calendar. Not affiliated with 13months.net or any standards body.',
    linksLabel: 'Footer links',
    dataSourcesLink: 'Data sources',
    sourceCodeLink: 'Source code',
  },

  navigation: {
    menu: 'Menu',
    backToHome: 'Back to the home page',
  },

  language: {
    title: 'Interface language',
  },

  theme: {
    useLight: 'Use light mode',
    useDark: 'Use dark mode',
  },

  holidaySettings: {
    countryTitle: 'Holidays by country',
    chooseCountry: 'Choose the holiday country',
    countryHint: 'The interface language and the holiday country can be different.',
    observedDateFor: 'Observed date for {holiday}',
    coverage: {
      title: 'Official holiday coverage',
      limitedYears: 'Official dates for this country are confirmed only for {years}.',
      missingOfficialYear: 'No government holidays are confirmed for {year}. Published years: {years}.',
      noCivilCalendar:
        'No government holidays are confirmed for {year}.',
      futureYear:
        'Government holidays for {year} use current rules and may change after new official publications.',
      historicalYear:
        'Government holidays for {year} were reconstructed from available rules; that year\'s official source is not archived.',
      otherDatesRemain:
        'Astronomical events, calculable religious dates, and observances remain available.',
      openSource: 'Open official source',
      close: 'Close notice',
    },
    regionFilter: 'Region',
    continents: {
      americas: 'Americas',
      europe: 'Europe',
      africa: 'Africa',
      asia: 'Asia',
      oceania: 'Oceania',
      antarctica: 'Antarctica',
    },
    regions: {
      all: 'All Regions',
      americasNorth: 'North America',
      americasCentral: 'Central America',
      americasCaribbean: 'Caribbean',
      americasSouth: 'South America',
      africaNorth: 'Northern Africa',
      africaWest: 'Western Africa',
      africaCentral: 'Central Africa',
      africaEast: 'Eastern Africa',
      africaSouthern: 'Southern Africa',
      europeNorth: 'Nordic Europe',
      europeWest: 'Western Europe',
      europeSouth: 'Southern Europe',
      europeEast: 'Eastern Europe',
      asiaWest: 'Middle East',
      asiaCentral: 'Central Asia',
      asiaSouth: 'Southern Asia',
      asiaEast: 'Eastern Asia',
      asiaSoutheast: 'South-Eastern Asia',
      oceania: 'Oceania',
      antarctica: 'Antarctica',
    },
    cancel: 'Cancel',
    calendar13Mode: {
      title: 'Dates in the 13-month calendar',
      native: 'Adapted dates',
      nativeCaption: 'Reapplies fixed dates and weekday rules in the 13-month calendar.',
      corresponding: 'Corresponding dates',
      correspondingCaption: 'Keeps the same physical day as the Gregorian calendar.',
    },
    filters: {
      open: 'Open filters',
      title: 'Show in the list',
      public: 'Public holidays',
      substitute: 'Substitute days',
      optional: 'Optional holidays',
      observance: 'Observances',
      bank: 'Bank holidays',
      school: 'School dates',
      commercial: 'Commercial dates',
      astronomical: 'Astronomical events',
      enableAll: 'Enable all',
    },
  },

  calendar: {
    selectedDate: 'Selected date',
    noDate: 'No date selected',
    gregorian: 'Gregorian',
    today: 'Today',
    goToToday: 'Go to today',
    gregorianTitle: 'Current Calendar — Gregorian',
    fixedCalendarTitle: 'International Fixed Calendar',
    daysThisMonth: '{count} days this month',
    daysEveryMonth: '28 days every month',

    weekDaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Special Days',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'SPD'],

    specialDays: {
      title: 'Special Days',
      yearDay: 'Year Day',
      yearDayTiming: 'Every year · after December 28',
      yearDayDescription:
        'A worldwide holiday outside of any week or month. The 365th day, connecting one year to the next.',
      leapDay: 'Leap Day',
      leapYearTiming: '{year} is a leap year · after Year Day',
      commonYearTiming: '{year} is not a leap year',
      leapDayDescription:
        'An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.',
      regularDays: 'Regular days',
      total: 'Total',
      totalDays: '{count} days',
    },
  },

  panels: {
    holidays: 'Holidays',
    moonPhases: 'Moon Phases',
    noHolidays: 'No holidays this month!',
    noMoonPhases: 'No moon phases this month!',
    loadError: 'Error while loading',
  },

  moonPhases: {
    new: 'New Moon',
    waxing: 'First Quarter',
    full: 'Full Moon',
    waning: 'Last Quarter',
    filters: {
      open: 'Open Moon phase filters',
      title: 'Show in the card',
      showTime: 'Show phase times',
      timeCaption: 'Device local time',
    },
  },
};
