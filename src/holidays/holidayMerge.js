import { resolveInternationalHolidayEmojiDetails } from './holidayEmojiResolver.js';

/* ===========================================================
   ASSINATURAS DAS REGRAS RECORRENTES

   O tipo e o nome podem divergir entre a base geral e o catálogo
   editorial. A assinatura compara o mecanismo que realmente gera
   a data: fixa, relativa à Páscoa ou vinculada à semana.
=========================================================== */

const WEEKDAY_NAMES = Object.freeze([
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

function createGregorianRuleKey(month, day) {
  return `gregorian:${Number(month)}:${Number(day)}`;
}

function appendWeekdayDirection(ruleKey, direction, weekday, count = 1) {
  return `${ruleKey}|${direction}:${weekday}:${Number(count) || 1}`;
}

export function resolveEditorialMergeRuleKey(rule) {
  if (!rule?.kind) {
    return null;
  }

  switch (rule.kind) {
    case 'fixed':
      return createGregorianRuleKey(rule.month, rule.day);

    case 'easterOffset':
      return `easter:easter:${Number(rule.days) || 0}`;

    case 'nthWeekday':
      return appendWeekdayDirection(
        createGregorianRuleKey(rule.month, 1),
        'after',
        WEEKDAY_NAMES[Number(rule.weekday)],
        rule.occurrence,
      );

    case 'lastWeekday': {
      const month = Number(rule.month);

      /* A última ocorrência equivale ao dia procurado antes do
         primeiro dia do mês seguinte. Dezembro cruza o limite do
         ano e permanece para as outras etapas de comparação. */
      if (month < 1 || month >= 12) {
        return null;
      }

      return appendWeekdayDirection(
        createGregorianRuleKey(month + 1, 1),
        'before',
        WEEKDAY_NAMES[Number(rule.weekday)],
        1,
      );
    }

    case 'weekdayBefore':
    case 'weekdayAfter':
      return appendWeekdayDirection(
        createGregorianRuleKey(rule.month, rule.day),
        rule.kind === 'weekdayBefore' ? 'before' : 'after',
        WEEKDAY_NAMES[Number(rule.weekday)],
        1,
      );

    default:
      return null;
  }
}

export function resolveProviderMergeRuleKey(ruleTokens) {
  if (!Array.isArray(ruleTokens)) {
    return null;
  }

  const baseTokens = ruleTokens.filter((token) => token?.fn);

  if (baseTokens.length !== 1 || baseTokens[0].year != null) {
    return null;
  }

  const baseToken = baseTokens[0];
  let ruleKey;

  if (baseToken.fn === 'gregorian') {
    ruleKey = createGregorianRuleKey(baseToken.month, baseToken.day);
  } else if (baseToken.fn === 'easter') {
    ruleKey = `easter:${baseToken.type}:${Number(baseToken.offset) || 0}`;
  } else {
    return null;
  }

  for (const token of ruleTokens.slice(ruleTokens.indexOf(baseToken) + 1)) {
    if (token.rule === 'dateDir') {
      ruleKey = appendWeekdayDirection(
        ruleKey,
        token.direction,
        token.weekday,
        token.count,
      );
      continue;
    }

    /* Condições de transferência não mudam a identidade da
       regra-base. Dependências de outros feriados, por outro lado,
       não podem ser comparadas isoladamente. */
    if (token.rule === 'bridge' || token.rule === 'ruleIfHoliday') {
      return null;
    }
  }

  return ruleKey;
}

/* ===========================================================
   NORMALIZAÇÃO DOS IDENTIFICADORES EDITORIAIS

   Os arquivos próprios usam identificadores como mothersDay.
   A conversão para palavras permite compará-los aos conceitos
   sem depender do idioma em que o nome será exibido.
=========================================================== */

function identifierToWords(identifier) {
  return String(identifier || '')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .toLowerCase()
    .trim();
}

function isGenericConcept(concept) {
  return !concept || concept.startsWith('generic_');
}

function resolveEditorialConcept(holiday) {
  return resolveInternationalHolidayEmojiDetails({
    country: holiday.country,
    date: holiday.date,
    canonicalName: identifierToWords(holiday.nameId),
    type: holiday.type,
    substitute: false,
  }).concept;
}

/* ===========================================================
   BUSCA DA OCORRÊNCIA EQUIVALENTE NA BASE GERAL

   Prioridades:
   1. mesma data e mesmo conceito semântico;
   2. conceito único no país/ano, mesmo que a data oficial tenha
      sido transferida para outro dia;
   3. única ocorrência na data com o mesmo tipo.
=========================================================== */

function findProviderMatchIndex(
  providerHolidays,
  editorialHoliday,
  usedProviderIndexes,
  editorialConceptCounts,
) {
  const editorialConcept = resolveEditorialConcept(editorialHoliday);
  const editorialRuleKey = resolveEditorialMergeRuleKey(editorialHoliday.rule);
  const availableEntries = providerHolidays
    .map((holiday, index) => ({ holiday, index }))
    .filter(({ index }) => !usedProviderIndexes.has(index));

  /* A regra recorrente é a identidade mais estável. Ela une, por
     exemplo, Carnaval e Corpus Christi mesmo quando as duas fontes
     discordam se o evento é bancário, facultativo ou oficial. */
  if (editorialRuleKey) {
    const matchingRules = availableEntries.filter(
      ({ holiday }) =>
        resolveProviderMergeRuleKey(holiday.providerRuleTokens) === editorialRuleKey,
    );

    if (matchingRules.length === 1) {
      return matchingRules[0].index;
    }

    const matchingRuleOnSameDate = matchingRules.filter(
      ({ holiday }) => holiday.date === editorialHoliday.date,
    );

    if (matchingRuleOnSameDate.length === 1) {
      return matchingRuleOnSameDate[0].index;
    }
  }

  const exactSemanticMatch = availableEntries.find(
    ({ holiday }) =>
      holiday.date === editorialHoliday.date &&
      !isGenericConcept(editorialConcept) &&
      holiday.concept === editorialConcept,
  );

  if (exactSemanticMatch) {
    return exactSemanticMatch.index;
  }

  if (!isGenericConcept(editorialConcept)) {
    const semanticMatches = availableEntries.filter(
      ({ holiday }) => holiday.concept === editorialConcept,
    );

    const conceptIsUnique = editorialConceptCounts.get(editorialConcept) === 1;
    const matchRepresentsMove = Boolean(semanticMatches[0]?.holiday.movedFromDate);

    /* Um conceito repetido em vários dias não pode ser unido
       somente pelo nome. Sem essa proteção, um dia das férias
       russas de Ano-Novo poderia ocupar a ocorrência de outro.
       A comparação entre datas diferentes continua válida para
       um conceito único ou uma transferência identificada. */
    if (semanticMatches.length === 1 && (conceptIsUnique || matchRepresentsMove)) {
      return semanticMatches[0].index;
    }
  }

  const sameDateAndType = availableEntries.filter(
    ({ holiday }) =>
      holiday.date === editorialHoliday.date && holiday.type === editorialHoliday.type,
  );

  return sameDateAndType.length === 1 ? sameDateAndType[0].index : -1;
}

/* ===========================================================
   UNIÃO DA BASE MUNDIAL COM OS COMPLEMENTOS EDITORIAIS

   A base mundial define a ocorrência civil do ano. Quando há
   correspondência, o catálogo editorial acrescenta nome, emoji,
   fonte e regra estruturada sem apagar a gramática internacional.
   Definições sem equivalente são adicionadas como complementos.
=========================================================== */

export function mergeProviderAndEditorialHolidays(providerHolidays, editorialHolidays) {
  const mergedHolidays = providerHolidays.map((holiday) => ({ ...holiday }));
  const usedProviderIndexes = new Set();
  const editorialConceptCounts = new Map();

  editorialHolidays.forEach((holiday) => {
    const concept = resolveEditorialConcept(holiday);

    if (!isGenericConcept(concept)) {
      editorialConceptCounts.set(concept, (editorialConceptCounts.get(concept) || 0) + 1);
    }
  });

  editorialHolidays.forEach((editorialHoliday) => {
    const providerIndex = findProviderMatchIndex(
      providerHolidays,
      editorialHoliday,
      usedProviderIndexes,
      editorialConceptCounts,
    );

    if (providerIndex < 0) {
      /* Se a base já trouxe a ocorrência transferida e ela foi
         enriquecida pela definição principal, uma segunda definição
         editorial do tipo substitute não deve recriar a mesma linha. */
      const duplicatesMovedProvider =
        editorialHoliday.type === 'substitute' &&
        providerHolidays.some(
          (providerHoliday) =>
            providerHoliday.date === editorialHoliday.date &&
            Boolean(providerHoliday.movedFromDate),
        );

      if (duplicatesMovedProvider) {
        return;
      }

      mergedHolidays.push({
        ...editorialHoliday,
        concept: resolveEditorialConcept(editorialHoliday),
      });
      return;
    }

    const providerHoliday = mergedHolidays[providerIndex];

    usedProviderIndexes.add(providerIndex);

    mergedHolidays[providerIndex] = {
      ...providerHoliday,
      ...editorialHoliday,
      /* A ocorrência publicada pela base geral continua sendo a
         data do encarte gregoriano. A regra editorial será usada
         apenas quando o calendário 13 estiver no modo adaptado. */
      date: providerHoliday.date,
      providerDate: providerHoliday.date,
      providerRule: providerHoliday.providerRule,
      providerRuleTokens: providerHoliday.providerRuleTokens,
      movedFromDate: providerHoliday.movedFromDate,
      canonicalName: providerHoliday.canonicalName,
      concept: providerHoliday.concept,
      providerSource: providerHoliday.source,
      source: editorialHoliday.source || providerHoliday.source,
    };
  });

  return mergedHolidays.sort((first, second) => first.date.localeCompare(second.date));
}
