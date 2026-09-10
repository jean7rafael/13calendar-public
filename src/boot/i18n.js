import { defineBoot } from '#q-app';
import { createI18n } from 'vue-i18n';
import { Lang } from 'quasar';

import langPtBR from 'quasar/lang/pt-BR.js';
import langEnUS from 'quasar/lang/en-US.js';
import langFr from 'quasar/lang/fr.js';
import langEs from 'quasar/lang/es.js';
import langDeDE from 'quasar/lang/de-DE.js';
import langRu from 'quasar/lang/ru.js';
import langIt from 'quasar/lang/it.js';
import langZhCN from 'quasar/lang/zh-CN.js';
import langJa from 'quasar/lang/ja.js';
import langAr from 'quasar/lang/ar.js';
import langHi from 'quasar/lang/hi.js';
import langKoKR from 'quasar/lang/ko-KR.js';

import messages from 'src/i18n';

/* ===========================================================
   CONFIGURAÇÃO DOS IDIOMAS SUPORTADOS
=========================================================== */

const DEFAULT_LOCALE = 'en-US';
const STORAGE_KEY = 'calendar-app-locale';

const languagePacks = {
  'pt-BR': langPtBR,
  'en-US': langEnUS,
  'fr-FR': langFr,
  'es-ES': langEs,
  'de-DE': langDeDE,
  'ru-RU': langRu,
  'it-IT': langIt,
  'zh-CN': langZhCN,
  'ja-JP': langJa,
  'ar-SA': langAr,
  'hi-IN': langHi,
  'ko-KR': langKoKR,
};

/* ===========================================================
   NORMALIZAÇÃO DO IDIOMA RECEBIDO
=========================================================== */

function normalizeLocale(locale) {
  const supportedLocales = [
    'pt-BR',
    'en-US',
    'fr-FR',
    'es-ES',
    'de-DE',
    'ru-RU',
    'it-IT',
    'zh-CN',
    'ja-JP',
    'ar-SA',
    'hi-IN',
    'ko-KR',
  ];

  if (supportedLocales.includes(locale)) {
    return locale;
  }

  const normalizedLocale = String(locale || '').toLowerCase();

  const languagePrefix = normalizedLocale.split('-')[0];

  const localeByPrefix = {
    pt: 'pt-BR',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    de: 'de-DE',
    ru: 'ru-RU',
    it: 'it-IT',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ar: 'ar-SA',
    hi: 'hi-IN',
    ko: 'ko-KR',
  };

  return localeByPrefix[languagePrefix] || DEFAULT_LOCALE;
}

/* ===========================================================
   ESCOLHA DO IDIOMA INICIAL

   Prioridade: preferência salva, idioma do navegador e,
   por último, inglês dos Estados Unidos.
=========================================================== */

function getPreferredLocale() {
  try {
    const savedLocale = localStorage.getItem(STORAGE_KEY);

    if (savedLocale) {
      return normalizeLocale(savedLocale);
    }
  } catch {
    // O aplicativo continua mesmo se o armazenamento não estiver disponível.
  }

  if (typeof navigator !== 'undefined') {
    return normalizeLocale(navigator.language);
  }

  return DEFAULT_LOCALE;
}

/* A primeira árvore do navegador precisa coincidir com o HTML SSG. A
   preferência local é aplicada depois da hidratação pelo layout público. */
const initialLocale = DEFAULT_LOCALE;

/* ===========================================================
   INSTÂNCIA GLOBAL DO VUE I18N
=========================================================== */

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
});

/* ===========================================================
   APLICAÇÃO E PERSISTÊNCIA DO IDIOMA
=========================================================== */

function setAppLanguage(locale, persist = true, ssrContext) {
  const normalizedLocale = normalizeLocale(locale);

  i18n.global.locale.value = normalizedLocale;

  Lang.set(languagePacks[normalizedLocale], ssrContext);

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, normalizedLocale);
    } catch {
      // A troca funciona mesmo sem salvar a preferência.
    }
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizedLocale;
    document.documentElement.dir = languagePacks[normalizedLocale]?.rtl === true ? 'rtl' : 'ltr';
  }
}

/* ===========================================================
   INICIALIZAÇÃO DO PLUGIN NO QUASAR
=========================================================== */

export default defineBoot(({ app, ssrContext }) => {
  setAppLanguage(initialLocale, false, ssrContext);
  app.use(i18n);
});

function applyPreferredAppLanguage() {
  setAppLanguage(getPreferredLocale(), false);
}

export { applyPreferredAppLanguage, i18n, setAppLanguage };
