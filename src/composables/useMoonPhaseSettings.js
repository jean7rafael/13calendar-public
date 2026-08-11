import { ref, watch } from 'vue';

/* ===========================================================
   CONFIGURAÇÃO E ARMAZENAMENTO
=========================================================== */

const SHOW_TIME_STORAGE_KEY = 'calendar-app-moon-phase-show-time';

function readInitialShowTime() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(SHOW_TIME_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistShowTime(showTime) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(SHOW_TIME_STORAGE_KEY, String(showTime));
  } catch {
    // O filtro continua funcionando durante a sessão
    // mesmo sem acesso ao armazenamento local.
  }
}

/* ===========================================================
   ESTADO GLOBAL COMPARTILHADO

   Os dois encartes usam a mesma preferência. O valor inicial é
   falso, portanto os horários começam ocultos.
=========================================================== */

const showMoonPhaseTime = ref(readInitialShowTime());

watch(showMoonPhaseTime, persistShowTime);

/* ===========================================================
   ACESSO À CONFIGURAÇÃO DAS FASES DA LUA
=========================================================== */

export function useMoonPhaseSettings() {
  return {
    showMoonPhaseTime,
  };
}
