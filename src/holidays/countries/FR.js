/* ===========================================================
   FONTES OFICIAIS DA FRANÇA
=========================================================== */

export const franceHolidaySources = Object.freeze({
  FR_SERVICE_PUBLIC: {
    title: 'Service Public — Jours fériés et ponts',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F2405',
  },

  EDITORIAL: {
    title: 'Date nationale pertinente ajoutée éditorialement',
    url: null,
  },
});

/* ===========================================================
   DEFINIÇÕES DOS FERIADOS E DATAS RELEVANTES
=========================================================== */

export const franceHolidayDefinitions = Object.freeze([
  /* =======================================================
       FESTAS LEGAIS NACIONAIS
    ======================================================= */

  {
    id: 'FR_NEW_YEAR',
    country: 'FR',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_EASTER_MONDAY',
    country: 'FR',
    nameId: 'easterMonday',
    emoji: '🐰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 1,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_LABOR_DAY',
    country: 'FR',
    nameId: 'laborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 1,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_VICTORY_1945',
    country: 'FR',
    nameId: 'victory1945',
    emoji: '🕊️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 8,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_ASCENSION',
    country: 'FR',
    nameId: 'ascensionDay',
    emoji: '✝️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 39,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_WHIT_MONDAY',
    country: 'FR',
    nameId: 'whitMonday',
    emoji: '🕊️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'easterOffset',
      days: 50,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_NATIONAL_DAY',
    country: 'FR',
    nameId: 'nationalDay',
    emoji: '🇫🇷',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 7,
      day: 14,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_ASSUMPTION',
    country: 'FR',
    nameId: 'assumption',
    emoji: '🙏',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 8,
      day: 15,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_ALL_SAINTS_DAY',
    country: 'FR',
    nameId: 'allSaintsDay',
    emoji: '🕯️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 1,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_ARMISTICE_1918',
    country: 'FR',
    nameId: 'armistice1918',
    emoji: '🕊️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 11,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  {
    id: 'FR_CHRISTMAS',
    country: 'FR',
    nameId: 'christmas',
    emoji: '🎄',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 12,
      day: 25,
    },
    sourceId: 'FR_SERVICE_PUBLIC',
  },

  /* =======================================================
       DATAS COMEMORATIVAS NACIONAIS
    ======================================================= */

  {
    id: 'FR_VALENTINES_DAY',
    country: 'FR',
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
    id: 'FR_MOTHERS_DAY',
    country: 'FR',
    nameId: 'mothersDay',
    emoji: '❤️',
    type: 'observance',
    scope: 'national',

    /*
     * Na França, a Festa das Mães ocorre normalmente
     * no último domingo de maio.
     *
     * Se essa data coincidir com Pentecostes,
     * passa para o primeiro domingo de junho.
     */
    rule: {
      kind: 'conditionalSameDate',

      primary: {
        kind: 'lastWeekday',
        month: 5,
        weekday: 0,
      },

      comparison: {
        kind: 'easterOffset',
        days: 49,
      },

      whenEqual: {
        kind: 'nthWeekday',
        month: 6,
        weekday: 0,
        occurrence: 1,
      },
    },

    sourceId: 'EDITORIAL',
  },

  {
    id: 'FR_FATHERS_DAY',
    country: 'FR',
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

  /* =======================================================
       DATAS COMERCIAIS
    ======================================================= */

  {
    id: 'FR_BLACK_FRIDAY',
    country: 'FR',
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
