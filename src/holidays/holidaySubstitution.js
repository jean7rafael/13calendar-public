import { shouldKeepObservedHolidayAlongsideNominal } from './holidayOccurrencePolicy.js';

/* ===========================================================
   IDENTIFICAÇÃO DE DATAS SUBSTITUTAS

   A base internacional representa transferências de duas
   maneiras:
   - uma regra separada iniciada por “substitutes”;
   - a mesma regra marcada com substitute: true.

   Em ambos os casos, o aplicativo deve exibir somente a data
   final e manter o nome original do feriado.
=========================================================== */

export function getSubstituteBaseRule(holiday) {
  const rule = String(holiday?.rule || '').trim();

  const explicitSubstitute = rule.match(/^substitutes\s+(.+?)\s+if\b/i);

  if (explicitSubstitute) {
    return explicitSubstitute[1];
  }

  if (holiday?.substitute === true) {
    return rule;
  }

  return null;
}

/* ===========================================================
   REMOÇÃO DO SUFIXO DA BIBLIOTECA

   Esta é apenas uma segurança para países em que a biblioteca
   já devolve somente a data transferida, sem a data original.
=========================================================== */

export function removeSubstituteSuffix(name) {
  return String(name || '')
    .replace(
      /\s*\((?:substitute day|substitute holiday|observed|día sustituto|jour substitut|ersatztag|день замены)\)\s*$/iu,
      '',
    )
    .trim();
}

/* Normaliza nomes para relacionar duas regras que representem
   o mesmo feriado com identificadores internos diferentes. */
function normalizeComparableName(name) {
  return removeSubstituteSuffix(name)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replaceAll('’', "'")
    .toLowerCase();
}

/* Transferências automáticas normalmente ficam a poucos dias da
   data original. O limite impede relacionar, por engano, o Ano-Novo
   de janeiro ao feriado observado do Ano-Novo seguinte em dezembro. */
const MAX_AUTOMATIC_TRANSFER_DISTANCE_DAYS = 14;

function calculateDateDistance(firstDate, secondDate) {
  const firstTime = Date.parse(`${String(firstDate).slice(0, 10)}T00:00:00Z`);
  const secondTime = Date.parse(`${String(secondDate).slice(0, 10)}T00:00:00Z`);

  if (!Number.isFinite(firstTime) || !Number.isFinite(secondTime)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(firstTime - secondTime) / 86_400_000;
}

/* Recupera a data civil de uma regra fixa quando a biblioteca
   fornece apenas a folga observada. Isso acontece, por exemplo,
   em 31 de dezembro para o Ano-Novo do ano seguinte. */
function resolveNominalDateFromRule(rule, observedDate) {
  const nominalDate = String(rule || '').match(/^(\d{2})-(\d{2})\b/);
  const observedYear = Number(String(observedDate || '').slice(0, 4));

  if (!nominalDate || !Number.isInteger(observedYear)) {
    return null;
  }

  const candidates = [observedYear - 1, observedYear, observedYear + 1]
    .map((year) => `${String(year).padStart(4, '0')}-${nominalDate[1]}-${nominalDate[2]}`)
    .map((date) => ({ date, distance: calculateDateDistance(date, observedDate) }))
    .sort((first, second) => first.distance - second.distance);

  return candidates[0]?.distance <= MAX_AUTOMATIC_TRANSFER_DISTANCE_DAYS
    ? candidates[0].date
    : null;
}

function findClosestOriginalHoliday(sourceHolidays, substituteHoliday, predicate) {
  const candidates = sourceHolidays
    .filter(
      (candidate) =>
        candidate !== substituteHoliday &&
        candidate.substitute !== true &&
        predicate(candidate),
    )
    .map((candidate) => ({
      candidate,
      distance: calculateDateDistance(candidate.date, substituteHoliday.date),
    }))
    .filter(({ distance }) => distance <= MAX_AUTOMATIC_TRANSFER_DISTANCE_DAYS)
    .sort((first, second) => first.distance - second.distance);

  return candidates[0]?.candidate || null;
}

/* ===========================================================
   REMOÇÃO DE COINCIDÊNCIAS APÓS A TRANSFERÊNCIA

   Um feriado de vários dias pode ter uma data transferida
   para outro dia que já possui exatamente o mesmo nome. Nesse
   caso, o calendário precisa de uma única linha naquela data.

   A ocorrência normal da data tem prioridade sobre a movida;
   em seguida, um feriado oficial tem prioridade sobre tipos
   informativos com o mesmo nome.
=========================================================== */

function deduplicateIdenticalHolidayDates(holidays) {
  const holidaysByDateAndName = new Map();

  holidays.forEach((holiday) => {
    const date = String(holiday.date || '').slice(0, 10);
    const comparableName = normalizeComparableName(holiday.name);
    const key = `${date}|${comparableName}`;
    const currentHoliday = holidaysByDateAndName.get(key);

    if (!currentHoliday) {
      holidaysByDateAndName.set(key, holiday);
      return;
    }

    const currentPriority =
      (currentHoliday.movedFromDate ? 0 : 2) + (currentHoliday.type === 'public' ? 1 : 0);
    const candidatePriority = (holiday.movedFromDate ? 0 : 2) + (holiday.type === 'public' ? 1 : 0);

    if (candidatePriority > currentPriority) {
      holidaysByDateAndName.set(key, holiday);
    }
  });

  return [...holidaysByDateAndName.values()];
}

/* ===========================================================
   REGRAS "AND IF" SEM MARCA DE SUBSTITUIÇÃO

   Alguns países retornam a data original e a transferida com a
   mesma regra, mas sem substitute:true. Quando as duas ocorrências
   ficam próximas, preservamos apenas a transferida, conforme a regra
   visual adotada pelo aplicativo.
=========================================================== */

function consolidateUnmarkedConditionalMoves(holidays) {
  const sourceHolidays = Array.isArray(holidays) ? holidays : [];
  const groupedHolidays = Map.groupBy(
    sourceHolidays,
    (holiday) => `${holiday.rule}|${normalizeComparableName(holiday.name)}`,
  );
  const removedHolidays = new Set();
  const movedHolidays = [];

  groupedHolidays.forEach((sameRuleHolidays) => {
    const rule = String(sameRuleHolidays[0]?.rule || '');

    if (!/\band if\b/i.test(rule) || sameRuleHolidays.length < 2) {
      return;
    }

    const nominalDateMatch = rule.match(/^(\d{2})-(\d{2})\b/);

    if (!nominalDateMatch) {
      return;
    }

    const nominalMonthDay = `${nominalDateMatch[1]}-${nominalDateMatch[2]}`;
    const sortedHolidays = [...sameRuleHolidays].sort((first, second) =>
      String(first.date).localeCompare(String(second.date)),
    );

    sortedHolidays.forEach((originalHoliday) => {
      if (!String(originalHoliday.date).slice(5, 10).startsWith(nominalMonthDay)) {
        return;
      }

      const movedHoliday = sortedHolidays
        .filter((candidate) => candidate !== originalHoliday)
        .map((candidate) => ({
          candidate,
          distance: calculateDateDistance(candidate.date, originalHoliday.date),
        }))
        .filter(
          ({ distance }) =>
            distance > 0 && distance <= MAX_AUTOMATIC_TRANSFER_DISTANCE_DAYS,
        )
        .sort((first, second) => first.distance - second.distance)[0]?.candidate;

      if (!movedHoliday || removedHolidays.has(movedHoliday)) {
        return;
      }

      removedHolidays.add(movedHoliday);
      movedHolidays.push({
        ...movedHoliday,
        substitute: true,
        occurrenceKind: 'observed',
        observedForDate: String(originalHoliday.date || '').slice(0, 10),
        movedFromDate: originalHoliday.date,
      });
    });
  });

  return [
    ...sourceHolidays.filter((holiday) => !removedHolidays.has(holiday)),
    ...movedHolidays,
  ];
}

/* ===========================================================
   CONSOLIDAÇÃO DAS TRANSFERÊNCIAS

   Quando a data original e a substituta coexistem:
   - remove as duas entradas recebidas;
   - recria uma única entrada na data substituta;
   - preserva nome, regra, tipo e demais dados do feriado base.

   Quando a biblioteca já omite a data original, apenas limpa
   o sufixo “substitute day”.
=========================================================== */

export function consolidateSubstituteHolidays(
  holidays,
  { country = null, isSubstituteRule = null } = {},
) {
  const sourceHolidays = (Array.isArray(holidays) ? holidays : []).map((holiday) => {
    const nominalDate = resolveNominalDateFromRule(holiday.rule, holiday.date);
    const actualDate = String(holiday.date || '').slice(0, 10);
    const shiftedByRule = nominalDate && nominalDate !== actualDate;

    /* Algumas definições da biblioteca marcam a regra como
       substituível, mas a ocorrência devolvida não traz substitute.
       O metadado da regra permite recuperar essa informação. */
    if (
      holiday.substitute !== true &&
      shiftedByRule &&
      typeof isSubstituteRule === 'function' &&
      isSubstituteRule(holiday)
    ) {
      return {
        ...holiday,
        substitute: true,
      };
    }

    return holiday;
  });

  const removedHolidays = new Set();
  const movedHolidays = [];

  sourceHolidays.forEach((substituteHoliday) => {
    const baseRule = getSubstituteBaseRule(substituteHoliday);

    if (!baseRule) {
      return;
    }

    const originalHolidayByRule = findClosestOriginalHoliday(
      sourceHolidays,
      substituteHoliday,
      (candidate) => candidate.rule === baseRule,
    );

    const substituteName = normalizeComparableName(substituteHoliday.name);

    const originalHolidayByName = findClosestOriginalHoliday(
      sourceHolidays,
      substituteHoliday,
      (candidate) => normalizeComparableName(candidate.name) === substituteName,
    );

    const originalHoliday = originalHolidayByRule || originalHolidayByName;

    removedHolidays.add(substituteHoliday);

    /* Uma folga observada não deve apagar a data civil do
       feriado. Nesses países mantemos as duas ocorrências e
       marcamos a adicional para a interface explicar sua função. */
    if (
      shouldKeepObservedHolidayAlongsideNominal({
        country,
        originalHoliday,
        substituteHoliday,
      })
    ) {
      const observedForDate =
        String(originalHoliday?.date || '').slice(0, 10) ||
        resolveNominalDateFromRule(baseRule, substituteHoliday.date);

      /* Se a fonte omitiu por completo a data civil, ela é
         reconstruída a partir da regra fixa antes de acrescentar
         a ocorrência observada. */
      if (!originalHoliday && observedForDate) {
        movedHolidays.push({
          ...substituteHoliday,
          date: observedForDate,
          name: removeSubstituteSuffix(substituteHoliday.name),
          rule: baseRule,
          substitute: false,
          occurrenceKind: 'holiday',
          observedForDate: null,
          movedFromDate: null,
        });
      }

      movedHolidays.push({
        ...substituteHoliday,
        name: removeSubstituteSuffix(originalHoliday?.name || substituteHoliday.name),
        rule: baseRule,
        substitute: true,
        occurrenceKind: 'observed',
        observedForDate,
        movedFromDate: observedForDate,
      });
      return;
    }

    if (originalHoliday) {

      removedHolidays.add(originalHoliday);

      movedHolidays.push({
        ...originalHoliday,
        date: substituteHoliday.date,
        start: substituteHoliday.start,
        end: substituteHoliday.end,
        substitute: false,
        movedFromDate: originalHoliday.date,
      });

      return;
    }

    movedHolidays.push({
      ...substituteHoliday,
      name: removeSubstituteSuffix(substituteHoliday.name),
      rule: baseRule,
      substitute: false,
    });
  });

  const consolidatedHolidays = [
    ...sourceHolidays.filter((holiday) => !removedHolidays.has(holiday)),
    ...movedHolidays,
  ];

  return deduplicateIdenticalHolidayDates(
    consolidateUnmarkedConditionalMoves(consolidatedHolidays),
  ).sort((first, second) => String(first.date).localeCompare(String(second.date)));
}
