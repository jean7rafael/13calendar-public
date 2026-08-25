/* ===========================================================
   FONTES OFICIAIS DA ESPANHA
=========================================================== */

export const spainHolidaySources = Object.freeze({
  ES_RD_2001_1983: {
    title: 'Real Decreto 2001/1983 — Fiestas laborales',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1983-20906',
  },

  ES_BOE_CALENDAR_2026: {
    title: 'BOE — Calendario de fiestas laborales de 2026',
    url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-21667',
  },

  EDITORIAL: {
    title: 'Fecha relevante incluida editorialmente',
    url: null,
  },
});

/* ===========================================================
   DEFINIÇÕES DOS FERIADOS E DATAS RELEVANTES
=========================================================== */

export const spainHolidayDefinitions = Object.freeze([
  /* =======================================================
       FERIADOS NACIONAIS
    ======================================================= */

  {
    id: 'ES_NEW_YEAR',
    country: 'ES',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_GOOD_FRIDAY',
    country: 'ES',
    nameId: 'goodFriday',
    emoji: '🩸',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: -2,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_LABOR_DAY',
    country: 'ES',
    nameId: 'laborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 1,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_ASSUMPTION',
    country: 'ES',
    nameId: 'assumption',
    emoji: '🙏🏻',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 8,
      day: 15,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_NATIONAL_DAY',
    country: 'ES',
    nameId: 'nationalDay',
    emoji: '🇪🇸',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 10,
      day: 12,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_ALL_SAINTS_DAY',
    country: 'ES',
    nameId: 'allSaintsDay',
    emoji: '🕯️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 1,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_CONSTITUTION_DAY',
    country: 'ES',
    nameId: 'constitutionDay',
    emoji: '📜',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 6,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_IMMACULATE_CONCEPTION',
    country: 'ES',
    nameId: 'immaculateConception',
    emoji: '🙏🏻',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 8,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  {
    id: 'ES_CHRISTMAS',
    country: 'ES',
    nameId: 'christmas',
    emoji: '🎄',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 25,
    },
    sourceId: 'ES_RD_2001_1983',
  },

  /* =======================================================
       FERIADOS NACIONAIS SUBSTITUÍVEIS OU VARIÁVEIS

       Podem depender do calendário publicado por cada
       comunidade autônoma.
    ======================================================= */

  {
    id: 'ES_EPIPHANY',
    country: 'ES',
    nameId: 'epiphany',
    emoji: '👑',
    type: 'optional',
    scope: 'national_substitutable',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 6,
    },
    sourceId: 'ES_BOE_CALENDAR_2026',
    requiresAnnualVerification: true,
  },

  {
    id: 'ES_MAUNDY_THURSDAY',
    country: 'ES',
    nameId: 'maundyThursday',
    emoji: '✝️',
    type: 'optional',
    scope: 'regional',
    rule: {
      kind: 'easterOffset',
      days: -3,
    },
    sourceId: 'ES_BOE_CALENDAR_2026',
    requiresAnnualVerification: true,
  },

  /* =======================================================
       DATAS COMEMORATIVAS
    ======================================================= */

  {
    id: 'ES_EASTER',
    country: 'ES',
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
    id: 'ES_FATHERS_DAY',
    country: 'ES',
    nameId: 'fathersDay',
    emoji: '💙',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 3,
      day: 19,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'ES_MOTHERS_DAY',
    country: 'ES',
    nameId: 'mothersDay',
    emoji: '❤️',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'nthWeekday',
      month: 5,
      weekday: 0,
      occurrence: 1,
    },
    sourceId: 'EDITORIAL',
  },

  /* =======================================================
       DATAS COMERCIAIS
    ======================================================= */

  {
    id: 'ES_BLACK_FRIDAY',
    country: 'ES',
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
