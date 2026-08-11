/* ===========================================================
   MODOS DE EXIBIÇÃO DOS FERIADOS NO CALENDÁRIO DE 13 MESES

   native:
   reaplica a regra do feriado dentro do calendário de 13 meses.

   corresponding:
   preserva o mesmo dia físico do calendário gregoriano.
=========================================================== */

export const CALENDAR_13_HOLIDAY_MODES = Object.freeze({
  NATIVE: 'native',
  CORRESPONDING: 'corresponding',
});

export const DEFAULT_CALENDAR_13_HOLIDAY_MODE = CALENDAR_13_HOLIDAY_MODES.NATIVE;

/* ===========================================================
   CONSTANTES DO CALENDÁRIO REGULAR DE 13 MESES

   Os treze meses regulares possuem 28 dias e sempre começam
   no domingo. Os Dias Especiais não participam destes cálculos.
=========================================================== */

const REGULAR_MONTHS_PER_YEAR = 13;

const DAYS_PER_REGULAR_MONTH = 28;

const REGULAR_DAYS_PER_YEAR = REGULAR_MONTHS_PER_YEAR * DAYS_PER_REGULAR_MONTH;

const WEEKDAYS_BY_NAME = Object.freeze({
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
});

/* Calendários religiosos, lunares, lunissolares e civis não
   gregorianos já calculam a ocorrência real em cada ano. Como não
   possuem um mês homônimo dentro do calendário 13, preservamos esse
   instante físico de maneira explícita, em vez de tratá-lo como
   data fixa ou falha. A lista corresponde às funções realmente
   presentes na base internacional do aplicativo. */
const SOURCE_CALENDAR_FUNCTIONS = new Set([
  'bengali-revised',
  'chinese',
  'hebrew',
  'islamic',
  'jalaali',
  'julian',
  'korean',
  'vietnamese',
]);

/* Eventos astronômicos também representam um instante físico,
   mas recebem uma classificação separada dos calendários de origem
   para que a auditoria possa distingui-los. */
const ASTRONOMICAL_SOURCE_FUNCTIONS = new Set(['equinox']);

/* ===========================================================
   FORMATAÇÃO E VALIDAÇÃO DAS DATAS INTERNAS
=========================================================== */

function formatCalendar13Date(year, month, day) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function createRegularCalendar13Date(year, month, day) {
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);

  if (
    !Number.isInteger(numericYear) ||
    !Number.isInteger(numericMonth) ||
    !Number.isInteger(numericDay) ||
    numericMonth < 1 ||
    numericMonth > REGULAR_MONTHS_PER_YEAR ||
    numericDay < 1 ||
    numericDay > DAYS_PER_REGULAR_MONTH
  ) {
    return null;
  }

  return {
    year: numericYear,
    month: numericMonth,
    day: numericDay,
  };
}

function serializeCalendar13Date(date) {
  return date ? formatCalendar13Date(date.year, date.month, date.day) : null;
}

function parseCalendar13Date(isoDate) {
  const [year, month, day] = String(isoDate || '')
    .split('-')
    .map(Number);

  return createRegularCalendar13Date(year, month, day);
}

/* ===========================================================
   CORRESPONDÊNCIA DOS NOMES DOS MESES

   Solaris ocupa a posição 7. Por isso, janeiro a junho mantêm
   o número e julho a dezembro avançam uma posição.
=========================================================== */

export function mapGregorianMonthToCalendar13(gregorianMonth) {
  const month = Number(gregorianMonth);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return month <= 6 ? month : month + 1;
}

/* ===========================================================
   DIA DA SEMANA E DESLOCAMENTOS REGULARES
=========================================================== */

function getCalendar13Weekday(date) {
  return (date.day - 1) % 7;
}

function addRegularCalendar13Days(date, amount) {
  if (!date || !Number.isInteger(amount)) {
    return null;
  }

  const currentIndex = (date.month - 1) * DAYS_PER_REGULAR_MONTH + date.day - 1;
  const destinationIndex = currentIndex + amount;

  /* O mecanismo não atravessa o limite anual, pois isso exigiria
     atribuir um dia da semana aos Dias Especiais. Nesses casos, o
     chamador utiliza com segurança a data correspondente. */
  if (destinationIndex < 0 || destinationIndex >= REGULAR_DAYS_PER_YEAR) {
    return null;
  }

  return createRegularCalendar13Date(
    date.year,
    Math.floor(destinationIndex / DAYS_PER_REGULAR_MONTH) + 1,
    (destinationIndex % DAYS_PER_REGULAR_MONTH) + 1,
  );
}

/* Desloca uma data regular já serializada. A função é pública
   para que o cálculo astronômico da Páscoa possa escolher o
   domingo seguinte sem conhecer os detalhes internos do mês. */
export function addCalendar13Days(isoDate, amount) {
  return serializeCalendar13Date(
    addRegularCalendar13Days(parseCalendar13Date(isoDate), Number(amount)),
  );
}

/* Localiza a próxima ocorrência estrita de um dia da semana. */
export function findNextCalendar13Weekday(isoDate, weekday) {
  const date = parseCalendar13Date(isoDate);

  if (!date || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    return null;
  }

  const currentWeekday = getCalendar13Weekday(date);
  const offset = ((7 - currentWeekday + weekday) % 7) || 7;

  return serializeCalendar13Date(addRegularCalendar13Days(date, offset));
}

function moveToWeekday(date, targetWeekday, direction, occurrence = 1) {
  if (!date || !Number.isInteger(targetWeekday) || !Number.isInteger(occurrence)) {
    return null;
  }

  const currentWeekday = getCalendar13Weekday(date);
  const isBefore = direction === 'before' || direction === 'previous';
  let completedOccurrences = occurrence - 1;
  let offset;

  if (isBefore) {
    /* before e previous são estritos na gramática utilizada pela
       biblioteca: se a âncora já estiver no dia procurado, volta
       uma semana completa. */
    if (currentWeekday === targetWeekday) {
      completedOccurrences += 1;
    }

    offset = -(
      ((7 + currentWeekday - targetWeekday) % 7) +
      completedOccurrences * 7
    );
  } else {
    /* after aceita a própria data; next exige a próxima ocorrência. */
    if (direction === 'next' && currentWeekday === targetWeekday) {
      completedOccurrences += 1;
    }

    offset = (7 - currentWeekday + targetWeekday) % 7 + completedOccurrences * 7;
  }

  return addRegularCalendar13Days(date, offset);
}

function moveByCalendar13WeekdayRule(date, weekday, direction, occurrence = 1) {
  if (weekday === 'day') {
    const signal = direction === 'before' || direction === 'previous' ? -1 : 1;

    return addRegularCalendar13Days(date, signal * occurrence);
  }

  const targetWeekday = WEEKDAYS_BY_NAME[weekday];

  return moveToWeekday(date, targetWeekday, direction, occurrence);
}

/* ===========================================================
   REGRAS EDITORIAIS ESTRUTURADAS

   Regras lunares, astronômicas e datas publicadas apenas para
   um ano continuam no mesmo dia físico. O motor principal faz
   essa conversão quando esta função retorna null.
=========================================================== */

export function resolveEditorialCalendar13Rule(rule, year, options = {}) {
  if (!rule?.kind) {
    return null;
  }

  const mappedMonth = mapGregorianMonthToCalendar13(rule.month);

  switch (rule.kind) {
    case 'fixed':
      return serializeCalendar13Date(
        createRegularCalendar13Date(year, mappedMonth, Number(rule.day)),
      );

    case 'nthWeekday': {
      const day = Number(rule.weekday) + 1 + (Number(rule.occurrence) - 1) * 7;

      return serializeCalendar13Date(createRegularCalendar13Date(year, mappedMonth, day));
    }

    case 'lastWeekday': {
      const day = 22 + Number(rule.weekday);

      return serializeCalendar13Date(createRegularCalendar13Date(year, mappedMonth, day));
    }

    case 'weekdayOnOrBefore':
    case 'weekdayBefore':
    case 'weekdayOnOrAfter':
    case 'weekdayAfter': {
      const anchor = createRegularCalendar13Date(year, mappedMonth, Number(rule.day));

      if (!anchor) {
        return null;
      }

      const currentWeekday = getCalendar13Weekday(anchor);
      const targetWeekday = Number(rule.weekday);
      const strictlyBefore = rule.kind === 'weekdayBefore';
      const strictlyAfter = rule.kind === 'weekdayAfter';
      let offset;

      if (rule.kind === 'weekdayOnOrBefore' || strictlyBefore) {
        offset = -((7 + currentWeekday - targetWeekday) % 7);

        if (strictlyBefore && offset === 0) {
          offset = -7;
        }
      } else {
        offset = (7 - currentWeekday + targetWeekday) % 7;

        if (strictlyAfter && offset === 0) {
          offset = 7;
        }
      }

      return serializeCalendar13Date(addRegularCalendar13Days(anchor, offset));
    }

    case 'relativeToRule': {
      const baseDate = resolveEditorialCalendar13Rule(rule.base, year, options);

      if (!baseDate) {
        return null;
      }

      const [baseYear, baseMonth, baseDay] = baseDate.split('-').map(Number);
      const shiftedDate = addRegularCalendar13Days(
        createRegularCalendar13Date(baseYear, baseMonth, baseDay),
        Number(rule.days),
      );

      return serializeCalendar13Date(shiftedDate);
    }

    case 'conditionalSameDate': {
      const primaryDate = resolveEditorialCalendar13Rule(rule.primary, year, options);

      if (!primaryDate) {
        return null;
      }

      const comparisonDate =
        resolveEditorialCalendar13Rule(rule.comparison, year, options) ||
        options.resolveCorrespondingRule?.(rule.comparison, year) ||
        null;

      if (comparisonDate && primaryDate === comparisonDate) {
        return resolveEditorialCalendar13Rule(rule.whenEqual, year, options);
      }

      return primaryDate;
    }

    case 'easterOffset': {
      const nativeEaster = options.resolveNativeEaster?.(year, 'easter') || null;

      return nativeEaster ? addCalendar13Days(nativeEaster, Number(rule.days) || 0) : null;
    }

    case 'seasonEvent':
    case 'yearSpecific':
    default:
      return null;
  }
}

/* ===========================================================
   REGRAS NORMALIZADAS DA BIBLIOTECA INTERNACIONAL

   A própria biblioteca já transforma sua gramática em tokens.
   Somente regras com uma âncora gregoriana recorrente podem ser
   reinterpretadas. Calendários lunares e eventos astronômicos
   permanecem, por definição, no mesmo instante físico.
=========================================================== */

export function resolveProviderCalendar13Rule(ruleTokens, year, options = {}) {
  if (!Array.isArray(ruleTokens) || ruleTokens.length === 0) {
    return null;
  }

  const dateTokens = ruleTokens.filter((token) => Boolean(token?.fn));
  const baseToken = dateTokens[0];

  if (dateTokens.length !== 1 || baseToken?.year != null) {
    return null;
  }

  let date;

  if (baseToken.fn === 'gregorian') {
    const mappedMonth = mapGregorianMonthToCalendar13(baseToken.month);

    date = createRegularCalendar13Date(year, mappedMonth, Number(baseToken.day));
  } else if (baseToken.fn === 'easter' && baseToken.type === 'easter') {
    const nativeEaster = options.resolveNativeEaster?.(year, baseToken.type) || null;
    const shiftedEaster = nativeEaster
      ? addCalendar13Days(nativeEaster, Number(baseToken.offset) || 0)
      : null;

    date = parseCalendar13Date(shiftedEaster);
  } else {
    return null;
  }

  let modifier = null;
  let conditionalRuleMatched = false;
  let conditionalRuleLocked = false;

  if (!date) {
    return null;
  }

  for (const token of ruleTokens.slice(ruleTokens.indexOf(baseToken) + 1)) {
    if (token.modifier) {
      modifier = token.modifier;
      continue;
    }

    if (token.rule === 'dateDir') {
      date = moveByCalendar13WeekdayRule(
        date,
        token.weekday,
        token.direction,
        Number(token.count) || 1,
      );

      if (!date) {
        return null;
      }

      continue;
    }

    if (token.rule === 'dateIfThen') {
      const currentWeekdayName = Object.keys(WEEKDAYS_BY_NAME).find(
        (weekdayName) => WEEKDAYS_BY_NAME[weekdayName] === getCalendar13Weekday(date),
      );
      const conditionMatches = token.if?.includes(currentWeekdayName);

      if (conditionMatches && !conditionalRuleLocked) {
        date = moveByCalendar13WeekdayRule(date, token.then, token.direction, 1);
        conditionalRuleMatched = true;
        conditionalRuleLocked = true;

        if (!date) {
          return null;
        }
      }

      continue;
    }

    if (token.rule === 'weekday') {
      const currentWeekdayName = Object.keys(WEEKDAYS_BY_NAME).find(
        (weekdayName) => WEEKDAYS_BY_NAME[weekdayName] === getCalendar13Weekday(date),
      );
      const conditionMatches = token.if?.includes(currentWeekdayName);

      if (conditionMatches === Boolean(token.not)) {
        return null;
      }

      continue;
    }

    /* Horário, duração e limites de vigência não mudam a data.
       Pontes e dependências de outros feriados exigem o contexto
       completo do país e usam o fallback correspondente. */
    if (token.rule === 'bridge' || token.rule === 'ruleIfHoliday') {
      return null;
    }
  }

  if (modifier === 'substitutes' && !conditionalRuleMatched) {
    return null;
  }

  return serializeCalendar13Date(date);
}

/* ===========================================================
   RESOLUÇÃO UNIFICADA DE UM FERIADO
=========================================================== */

export function resolveNativeCalendar13HolidayDate(holiday, year, options = {}) {
  const editorialDate = resolveEditorialCalendar13Rule(holiday?.rule, year, options);

  if (editorialDate) {
    return {
      date: editorialDate,
      resolution: 'editorial-rule',
    };
  }

  const providerDate = resolveProviderCalendar13Rule(
    holiday?.providerRuleTokens,
    year,
    options,
  );

  if (providerDate) {
    return {
      date: providerDate,
      resolution: 'provider-rule',
    };
  }

  const providerBaseToken = holiday?.providerRuleTokens?.find((token) => token?.fn);
  const preservesSourceCalendar =
    SOURCE_CALENDAR_FUNCTIONS.has(providerBaseToken?.fn) ||
    (providerBaseToken?.fn === 'easter' && providerBaseToken.type === 'orthodox');

  if (preservesSourceCalendar && options.correspondingDate) {
    return {
      date: options.correspondingDate,
      resolution: 'source-calendar-rule',
    };
  }

  if (
    ASTRONOMICAL_SOURCE_FUNCTIONS.has(providerBaseToken?.fn) &&
    options.correspondingDate
  ) {
    return {
      date: options.correspondingDate,
      resolution: 'astronomical-source-rule',
    };
  }

  /* Os meses regulares terminam no dia 28. Uma regra que exige
     literalmente 29, 30 ou 31 não pode conservar simultaneamente
     nome do mês e número do dia; por isso ela preserva o dia físico. */
  const editorialFixedDay =
    holiday?.rule?.kind === 'fixed' ? Number(holiday.rule.day) : null;
  const providerFixedDay =
    providerBaseToken?.fn === 'gregorian' ? Number(providerBaseToken.day) : null;

  if (
    options.correspondingDate &&
    (editorialFixedDay > DAYS_PER_REGULAR_MONTH ||
      providerFixedDay > DAYS_PER_REGULAR_MONTH)
  ) {
    return {
      date: options.correspondingDate,
      resolution: 'unrepresentable-fixed-day',
    };
  }

  if (
    ['seasonEvent', 'yearSpecific'].includes(holiday?.rule?.kind) &&
    options.correspondingDate
  ) {
    return {
      date: options.correspondingDate,
      resolution: 'physical-occurrence-rule',
    };
  }

  /* Pontes, dependências entre feriados, substituições que não
     se aplicaram e regras com mais de uma base precisam do contexto
     completo do país. A base internacional já calculou a data civil
     correta; preservá-la evita inventar uma aproximação. */
  if (providerBaseToken && options.correspondingDate) {
    return {
      date: options.correspondingDate,
      resolution: 'provider-context-rule',
    };
  }

  return {
    date: null,
    resolution: 'corresponding-fallback',
  };
}
