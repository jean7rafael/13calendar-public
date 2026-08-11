/* ===========================================================
   REPRESENTAÇÃO COMPACTA DAS FASES DA LUA

   O mesmo emoji identifica a fase nos dois calendários e na
   legenda apresentada acima dos encartes.
=========================================================== */

const MOON_PHASE_VISUALS = Object.freeze({
  Nova: Object.freeze({ eventClass: 'moon-new', emoji: '🌑' }),
  Crescente: Object.freeze({ eventClass: 'moon-waxing', emoji: '🌓' }),
  Cheia: Object.freeze({ eventClass: 'moon-full', emoji: '🌕' }),
  Minguante: Object.freeze({ eventClass: 'moon-waning', emoji: '🌗' }),
});

/* ===========================================================
   CRIAÇÃO DO ÍNDICE DE FASES POR DATA

   O conversor opcional permite reutilizar o mecanismo no
   calendário gregoriano e no calendário de 13 meses.
=========================================================== */

export function createMoonPhaseDateMap(phases, convertDate = (date) => date) {
  const phaseMap = new Map();

  for (const phase of phases) {
    const convertedDate = convertDate(phase.data);

    if (convertedDate) {
      phaseMap.set(convertedDate.replace(/-/g, '/'), phase);
    }
  }

  return phaseMap;
}

/* Classe adicionada pelo event-color do QDate. */
export function getMoonPhaseEventClass(phaseName) {
  return MOON_PHASE_VISUALS[phaseName]?.eventClass || 'moon-new';
}

/* Emoji utilizado nas células e na legenda. */
export function getMoonPhaseEmoji(phaseName) {
  return MOON_PHASE_VISUALS[phaseName]?.emoji || '🌙';
}
