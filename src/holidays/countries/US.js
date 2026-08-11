/* ===========================================================
   FONTES OFICIAIS DOS ESTADOS UNIDOS
=========================================================== */

export const unitedStatesHolidaySources = Object.freeze({
  US_OPM: {
    title: 'U.S. Office of Personnel Management — Federal Holidays',
    url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/',
  },

  EDITORIAL: {
    title: 'Relevant national date added editorially',
    url: null,
  },
});

/* ===========================================================
   DEFINIÇÕES DOS FERIADOS E DATAS RELEVANTES
=========================================================== */

export const unitedStatesHolidayDefinitions = Object.freeze([
  /* =======================================================
       FERIADOS FEDERAIS
    ======================================================= */

  {
    id: 'US_NEW_YEAR',
    country: 'US',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_MARTIN_LUTHER_KING_DAY',
    country: 'US',
    nameId: 'martinLutherKingDay',
    emoji: '🕊️',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'nthWeekday',
      month: 1,
      weekday: 1,
      occurrence: 3,
    },
    validFrom: 1986,
    sourceId: 'US_OPM',
  },

  {
    id: 'US_WASHINGTON_BIRTHDAY',
    country: 'US',
    nameId: 'washingtonBirthday',
    emoji: '🇺🇸',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'nthWeekday',
      month: 2,
      weekday: 1,
      occurrence: 3,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_MEMORIAL_DAY',
    country: 'US',
    nameId: 'memorialDay',
    emoji: '🕯️',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'lastWeekday',
      month: 5,
      weekday: 1,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_JUNETEENTH',
    country: 'US',
    nameId: 'juneteenth',
    emoji: '✊🏿',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'fixed',
      month: 6,
      day: 19,
    },
    validFrom: 2021,
    sourceId: 'US_OPM',
  },

  {
    id: 'US_INDEPENDENCE_DAY',
    country: 'US',
    nameId: 'independenceDay',
    emoji: '🇺🇸',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'fixed',
      month: 7,
      day: 4,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_LABOR_DAY',
    country: 'US',
    nameId: 'laborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'nthWeekday',
      month: 9,
      weekday: 1,
      occurrence: 1,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_COLUMBUS_DAY',
    country: 'US',
    nameId: 'columbusDay',
    emoji: '⛵',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'nthWeekday',
      month: 10,
      weekday: 1,
      occurrence: 2,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_VETERANS_DAY',
    country: 'US',
    nameId: 'veteransDay',
    emoji: '🎖️',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 11,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_THANKSGIVING_DAY',
    country: 'US',
    nameId: 'thanksgivingDay',
    emoji: '🦃',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'nthWeekday',
      month: 11,
      weekday: 4,
      occurrence: 4,
    },
    sourceId: 'US_OPM',
  },

  {
    id: 'US_CHRISTMAS',
    country: 'US',
    nameId: 'christmas',
    emoji: '🎄',
    type: 'public',
    scope: 'federal',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 25,
    },
    sourceId: 'US_OPM',
  },

  /* =======================================================
       DATAS COMEMORATIVAS
    ======================================================= */

  {
    id: 'US_VALENTINES_DAY',
    country: 'US',
    nameId: 'valentinesDay',
    emoji: '💘',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 2,
      day: 14,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'US_MOTHERS_DAY',
    country: 'US',
    nameId: 'mothersDay',
    emoji: '❤️',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'nthWeekday',
      month: 5,
      weekday: 0,
      occurrence: 2,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'US_FATHERS_DAY',
    country: 'US',
    nameId: 'fathersDay',
    emoji: '💙',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'nthWeekday',
      month: 6,
      weekday: 0,
      occurrence: 3,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'US_HALLOWEEN',
    country: 'US',
    nameId: 'halloween',
    emoji: '🎃',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 10,
      day: 31,
    },
    sourceId: 'EDITORIAL',
  },

  /* =======================================================
       DATAS COMERCIAIS
    ======================================================= */

  {
    id: 'US_BLACK_FRIDAY',
    country: 'US',
    nameId: 'blackFriday',
    emoji: '🛍️',
    type: 'commercial',
    scope: 'national',
    rule: {
      kind: 'relativeToRule',
      days: 1,
      base: {
        kind: 'nthWeekday',
        month: 11,
        weekday: 4,
        occurrence: 4,
      },
    },
    sourceId: 'EDITORIAL',
  },
]);
