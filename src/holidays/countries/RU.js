/* ===========================================================
   FONTES OFICIAIS DA RÚSSIA
=========================================================== */

export const russiaHolidaySources = Object.freeze({
  RU_LABOUR_CODE_112: {
    title: 'Трудовой кодекс РФ — статья 112',
    url: 'https://git11.rostrud.gov.ru/deyatelnost-gosudarstvennoy-inspektsii-truda/razyasneniya-i-konsultatsii/2025-go45454578d/1561639.html',
  },

  RU_GOVERNMENT_2026: {
    title: 'Правительство России — перенос выходных дней в 2026 году',
    url: 'https://government.ru/docs/all/161028/',
  },

  EDITORIAL: {
    title: 'Памятная дата, добавленная редакционно',
    url: null,
  },
});

/* ===========================================================
   DIAS DAS FÉRIAS DE ANO-NOVO

   Os dias 2, 3, 4, 5, 6 e 8 de janeiro possuem
   a mesma classificação e o mesmo nome oficial.
=========================================================== */

const russianNewYearHolidayDays = Object.freeze([2, 3, 4, 5, 6, 8]);

const russianNewYearHolidayDefinitions = russianNewYearHolidayDays.map((day) => ({
  id: `RU_NEW_YEAR_HOLIDAY_${day}`,

  country: 'RU',

  nameId: `newYearHolidayJanuary${day}`,

  emoji: '🎆',

  type: 'public',

  scope: 'national',

  rule: {
    kind: 'fixed',
    month: 1,
    day,
  },

  sourceId: 'RU_LABOUR_CODE_112',
}));

/* ===========================================================
   DEFINIÇÕES DOS FERIADOS E DATAS RELEVANTES
=========================================================== */

export const russiaHolidayDefinitions = Object.freeze([
  /* =======================================================
       FERIADOS NACIONAIS
    ======================================================= */

  {
    id: 'RU_NEW_YEAR',
    country: 'RU',
    nameId: 'newYear',
    emoji: '💥',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 1,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  ...russianNewYearHolidayDefinitions,

  {
    id: 'RU_ORTHODOX_CHRISTMAS',
    country: 'RU',
    nameId: 'orthodoxChristmas',
    emoji: '🎄',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 1,
      day: 7,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_DEFENDER_OF_FATHERLAND_DAY',
    country: 'RU',
    nameId: 'defenderOfFatherlandDay',
    emoji: '🎖️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 2,
      day: 23,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_WOMENS_DAY',
    country: 'RU',
    nameId: 'womensDay',
    emoji: '🌷',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 3,
      day: 8,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_SPRING_AND_LABOR_DAY',
    country: 'RU',
    nameId: 'springAndLaborDay',
    emoji: '🧰',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 1,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_VICTORY_DAY',
    country: 'RU',
    nameId: 'victoryDay',
    emoji: '🎖️',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 5,
      day: 9,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_RUSSIA_DAY',
    country: 'RU',
    nameId: 'russiaDay',
    emoji: '🇷🇺',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 6,
      day: 12,
    },
    sourceId: 'RU_LABOUR_CODE_112',
  },

  {
    id: 'RU_NATIONAL_UNITY_DAY',
    country: 'RU',
    nameId: 'nationalUnityDay',
    emoji: '🤝',
    type: 'public',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 11,
      day: 4,
    },
    validFrom: 2005,
    sourceId: 'RU_LABOUR_CODE_112',
  },

  /* =======================================================
       DIAS DE DESCANSO TRANSFERIDOS EM 2026

       Estes dias não são novos feriados. São dias de
       descanso decorrentes das regras de transferência.
    ======================================================= */

  {
    id: 'RU_TRANSFERRED_DAY_2026_01_09',
    country: 'RU',
    nameId: 'dayOffTransferredFromJanuary3',
    emoji: '↪️',
    type: 'substitute',
    scope: 'annual_transfer',
    rule: {
      kind: 'yearSpecific',
      dates: {
        2026: {
          month: 1,
          day: 9,
        },
      },
    },
    sourceId: 'RU_GOVERNMENT_2026',
    requiresAnnualVerification: true,
  },

  {
    id: 'RU_TRANSFERRED_DAY_2026_03_09',
    country: 'RU',
    nameId: 'dayOffForWomensDay',
    emoji: '↪️',
    type: 'substitute',
    scope: 'automatic_substitute',
    rule: {
      kind: 'yearSpecific',
      dates: {
        2026: {
          month: 3,
          day: 9,
        },
      },
    },
    sourceId: 'RU_LABOUR_CODE_112',
    requiresAnnualVerification: true,
  },

  {
    id: 'RU_TRANSFERRED_DAY_2026_05_11',
    country: 'RU',
    nameId: 'dayOffForVictoryDay',
    emoji: '↪️',
    type: 'substitute',
    scope: 'automatic_substitute',
    rule: {
      kind: 'yearSpecific',
      dates: {
        2026: {
          month: 5,
          day: 11,
        },
      },
    },
    sourceId: 'RU_LABOUR_CODE_112',
    requiresAnnualVerification: true,
  },

  {
    id: 'RU_TRANSFERRED_DAY_2026_12_31',
    country: 'RU',
    nameId: 'dayOffTransferredFromJanuary4',
    emoji: '↪️',
    type: 'substitute',
    scope: 'annual_transfer',
    rule: {
      kind: 'yearSpecific',
      dates: {
        2026: {
          month: 12,
          day: 31,
        },
      },
    },
    sourceId: 'RU_GOVERNMENT_2026',
    requiresAnnualVerification: true,
  },

  /* =======================================================
       DATAS COMEMORATIVAS NACIONAIS
    ======================================================= */

  {
    id: 'RU_VALENTINES_DAY',
    country: 'RU',
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
    id: 'RU_COSMONAUTICS_DAY',
    country: 'RU',
    nameId: 'cosmonauticsDay',
    emoji: '🚀',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'fixed',
      month: 4,
      day: 12,
    },
    sourceId: 'EDITORIAL',
  },

  {
    id: 'RU_FATHERS_DAY',
    country: 'RU',
    nameId: 'fathersDay',
    emoji: '💙',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'nthWeekday',
      month: 10,
      weekday: 0,
      occurrence: 3,
    },
    validFrom: 2021,
    sourceId: 'EDITORIAL',
  },

  {
    id: 'RU_MOTHERS_DAY',
    country: 'RU',
    nameId: 'mothersDay',
    emoji: '❤️',
    type: 'observance',
    scope: 'national',
    rule: {
      kind: 'lastWeekday',
      month: 11,
      weekday: 0,
    },
    sourceId: 'EDITORIAL',
  },

  /* =======================================================
       DATAS COMERCIAIS
    ======================================================= */

  {
    id: 'RU_BLACK_FRIDAY',
    country: 'RU',
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
