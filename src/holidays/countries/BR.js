/* ===========================================================
   FONTES LEGAIS E EDITORIAIS DO BRASIL
=========================================================== */

export const brazilHolidaySources = Object.freeze({
  BR_LEI_662: {
    title: 'Lei nº 662/1949',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l0662.htm',
  },

  BR_LEI_6802: {
    title: 'Lei nº 6.802/1980',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l6802.htm',
  },

  BR_LEI_9093: {
    title: 'Lei nº 9.093/1995',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l9093.htm',
  },

  BR_LEI_14402: {
    title: 'Lei nº 14.402/2022',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14402.htm',
  },

  BR_LEI_14759: {
    title: 'Lei nº 14.759/2023',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14759.htm',
  },

  BR_MGI_CALENDAR: {
    title: 'Calendário anual da Administração Pública Federal',
    url: 'https://www.gov.br/gestao/pt-br/assuntos/gestao-e-inovacao/feriados-e-pontos-facultativos',
  },

  EDITORIAL: {
    title: 'Data relevante incluída editorialmente',
    url: null,
  },
});

/* ===========================================================
   REGRAS DOS FERIADOS E DATAS RELEVANTES DO BRASIL
=========================================================== */

export const brazilHolidayDefinitions = Object.freeze([
  {
    id: 'BR_NEW_YEAR',
    country: 'BR',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_CARNIVAL_MONDAY',
    country: 'BR',
    nameId: 'carnivalMonday',
    emoji: '🎭',
    type: 'optional',
    scope: 'federal',
    rule: {
      kind: 'easterOffset',
      days: -48,
    },
    sourceId: 'BR_MGI_CALENDAR',
    requiresAnnualVerification: true,
  },

  {
    id: 'BR_CARNIVAL_TUESDAY',
    country: 'BR',
    nameId: 'carnivalTuesday',
    emoji: '🎭',
    type: 'optional',
    scope: 'federal',
    rule: {
      kind: 'easterOffset',
      days: -47,
    },
    sourceId: 'BR_MGI_CALENDAR',
    requiresAnnualVerification: true,
  },

  {
    id: 'BR_ASH_WEDNESDAY',
    country: 'BR',
    nameId: 'ashWednesday',
    emoji: '✝️',
    type: 'optional',
    scope: 'federal',
    rule: {
      kind: 'easterOffset',
      days: -46,
    },
    partialDay: true,
    endsAt: '14:00',
    sourceId: 'BR_MGI_CALENDAR',
    requiresAnnualVerification: true,
  },

  {
    id: 'BR_WOMENS_DAY',
    country: 'BR',
    nameId: 'womensDay',
    emoji: '🌷',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 3,
      day: 8,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_GOOD_FRIDAY',
    country: 'BR',
    nameId: 'goodFriday',
    emoji: '🩸',
    type: 'public',
    scope: 'widely_observed',
    rule: {
      kind: 'easterOffset',
      days: -2,
    },
    sourceId: 'BR_LEI_9093',
  },

  {
    id: 'BR_EASTER',
    country: 'BR',
    nameId: 'easter',
    emoji: '🐰',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 0,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_INDIGENOUS_PEOPLES_DAY',
    country: 'BR',
    nameId: 'indigenousPeoplesDay',
    emoji: '🌴',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 4,
      day: 19,
    },
    sourceId: 'BR_LEI_14402',
  },

  {
    id: 'BR_TIRADENTES',
    country: 'BR',
    nameId: 'tiradentes',
    emoji: '🦷',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 4,
      day: 21,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_LABOR_DAY',
    country: 'BR',
    nameId: 'laborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 1,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_MOTHERS_DAY',
    country: 'BR',
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
    id: 'BR_CORPUS_CHRISTI',
    country: 'BR',
    nameId: 'corpusChristi',
    emoji: '✝️',
    type: 'optional',
    scope: 'federal',
    rule: {
      kind: 'easterOffset',
      days: 60,
    },
    sourceId: 'BR_MGI_CALENDAR',
    requiresAnnualVerification: true,
  },

  {
    id: 'BR_ENVIRONMENT_DAY',
    country: 'BR',
    nameId: 'environmentDay',
    emoji: '🌎',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 6,
      day: 5,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_VALENTINES_DAY',
    country: 'BR',
    nameId: 'valentinesDay',
    emoji: '💘',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 6,
      day: 12,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_SAINT_JOHNS_DAY',
    country: 'BR',
    nameId: 'saintJohnsDay',
    emoji: '🪵',
    type: 'observance',
    scope: 'regional',
    rule: {
      kind: 'fixed',
      month: 6,
      day: 24,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_FATHERS_DAY',
    country: 'BR',
    nameId: 'fathersDay',
    emoji: '💙',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'nthWeekday',
      month: 8,
      weekday: 0,
      occurrence: 2,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_INDEPENDENCE_DAY',
    country: 'BR',
    nameId: 'independenceDay',
    emoji: '🇧🇷',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 9,
      day: 7,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_OUR_LADY_APARECIDA',
    country: 'BR',
    nameId: 'ourLadyAparecida',
    emoji: '🙏🏻',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 10,
      day: 12,
    },
    sourceId: 'BR_LEI_6802',
  },

  {
    id: 'BR_TEACHERS_DAY',
    country: 'BR',
    nameId: 'teachersDay',
    emoji: '🎓',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 10,
      day: 15,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'BR_ALL_SOULS_DAY',
    country: 'BR',
    nameId: 'allSoulsDay',
    emoji: '🕯️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 2,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_REPUBLIC_DAY',
    country: 'BR',
    nameId: 'republicDay',
    emoji: '📣',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 15,
    },
    sourceId: 'BR_LEI_662',
  },

  {
    id: 'BR_BLACK_AWARENESS_DAY',
    country: 'BR',
    nameId: 'blackAwarenessDay',
    emoji: '✊🏿',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 20,
    },
    sourceId: 'BR_LEI_14759',
  },

  {
    id: 'BR_BLACK_FRIDAY',
    country: 'BR',
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

  {
    id: 'BR_CHRISTMAS',
    country: 'BR',
    nameId: 'christmas',
    emoji: '🎄',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 25,
    },
    sourceId: 'BR_LEI_662',
  },
]);
