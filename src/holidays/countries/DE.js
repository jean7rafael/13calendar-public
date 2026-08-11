/* ===========================================================
   FONTES OFICIAIS DA ALEMANHA
=========================================================== */

export const germanyHolidaySources = Object.freeze({
  DE_BMAS_LABOUR_LAW: {
    title: 'Bundesministerium für Arbeit und Soziales — Arbeitsrecht',
    url: 'https://www.bmas.de/SharedDocs/Downloads/DE/Publikationen/a711-arbeitsrecht.pdf?__blob=publicationFile&v=1',
  },

  EDITORIAL: {
    title: 'National relevante Gedenk- oder Aktionstage',
    url: null,
  },
});

/* ===========================================================
   DEFINIÇÕES DOS FERIADOS E DATAS RELEVANTES
=========================================================== */

export const germanyHolidayDefinitions = Object.freeze([
  /* =======================================================
       FERIADOS VÁLIDOS EM TODO O TERRITÓRIO ALEMÃO
    ======================================================= */

  {
    id: 'DE_NEW_YEAR',
    country: 'DE',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_GOOD_FRIDAY',
    country: 'DE',
    nameId: 'goodFriday',
    emoji: '🩸',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: -2,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_EASTER_MONDAY',
    country: 'DE',
    nameId: 'easterMonday',
    emoji: '🐰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 1,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_LABOR_DAY',
    country: 'DE',
    nameId: 'laborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 1,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_ASCENSION',
    country: 'DE',
    nameId: 'ascensionDay',
    emoji: '✝️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 39,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_WHIT_MONDAY',
    country: 'DE',
    nameId: 'whitMonday',
    emoji: '🕊️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 50,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_GERMAN_UNITY_DAY',
    country: 'DE',
    nameId: 'germanUnityDay',
    emoji: '🇩🇪',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 10,
      day: 3,
    },
    validFrom: 1990,
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_CHRISTMAS_DAY',
    country: 'DE',
    nameId: 'christmasDay',
    emoji: '🎄',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 25,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  {
    id: 'DE_SECOND_CHRISTMAS_DAY',
    country: 'DE',
    nameId: 'secondChristmasDay',
    emoji: '🎁',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 26,
    },
    sourceId: 'DE_BMAS_LABOUR_LAW',
  },

  /* =======================================================
       DATAS COMEMORATIVAS NACIONAIS
    ======================================================= */

  {
    id: 'DE_VALENTINES_DAY',
    country: 'DE',
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
    id: 'DE_MOTHERS_DAY',
    country: 'DE',
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

  /*
   * Na Alemanha, o Dia dos Pais é celebrado
   * na mesma data da Ascensão.
   */
  {
    id: 'DE_FATHERS_DAY',
    country: 'DE',
    nameId: 'fathersDay',
    emoji: '💙',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 39,
    },
    sourceId: 'EDITORIAL',
  },

  /* =======================================================
       DATAS COMERCIAIS
    ======================================================= */

  {
    id: 'DE_BLACK_FRIDAY',
    country: 'DE',
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
