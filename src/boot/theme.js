import { Dark } from 'quasar';

import { defineBoot } from '#q-app/wrappers';

/* ===========================================================
   PREFERÊNCIA VISUAL E ARMAZENAMENTO
=========================================================== */

const THEME_STORAGE_KEY = 'calendar-app-theme';

function readSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
  } catch {
    return null;
  }
}

function prefersDarkMode() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/* ===========================================================
   ALTERAÇÃO E PERSISTÊNCIA DO TEMA
=========================================================== */

export function setAppDarkMode(isDarkMode, persist = true) {
  Dark.set(Boolean(isDarkMode));

  if (!persist) {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  } catch {
    // A troca de tema continua funcionando sem armazenamento.
  }
}

/* ===========================================================
   INICIALIZAÇÃO

   Sem preferência salva, o aplicativo acompanha a aparência
   clara ou escura escolhida no sistema operacional.
=========================================================== */

export default defineBoot(() => {
  const savedTheme = readSavedTheme();

  setAppDarkMode(savedTheme ? savedTheme === 'dark' : prefersDarkMode(), false);
});
