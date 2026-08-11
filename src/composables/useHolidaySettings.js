import { reactive, ref, watch } from 'vue';

import { DEFAULT_HOLIDAY_FILTERS, HOLIDAY_TYPES } from 'src/holidays/holidayEngine';

import { HOLIDAY_REGIONS, findHolidayCountryConfig } from 'src/holidays/countryRegistry';

import {
  CALENDAR_13_HOLIDAY_MODES,
  DEFAULT_CALENDAR_13_HOLIDAY_MODE,
} from 'src/holidays/calendar13HolidayRules';

/* ===========================================================
   CONFIGURAÇÕES DE ARMAZENAMENTO
=========================================================== */

const DEFAULT_COUNTRY = 'US';

const COUNTRY_STORAGE_KEY = 'calendar-app-holiday-country';

const FILTERS_STORAGE_KEY = 'calendar-app-holiday-filters';

const REGION_STORAGE_KEY = 'calendar-app-holiday-region';

const CALENDAR_13_MODE_STORAGE_KEY = 'calendar-app-calendar13-holiday-mode';

const DEFAULT_REGION = 'all';

/* ===========================================================
   LEITURA SEGURA DO ARMAZENAMENTO
=========================================================== */

function readStorage(storageKey) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

/* ===========================================================
   GRAVAÇÃO SEGURA NO ARMAZENAMENTO
=========================================================== */

function writeStorage(storageKey, value) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // O aplicativo continua funcionando
    // mesmo sem acesso ao armazenamento.
  }
}

/* ===========================================================
   PAÍS INICIAL
=========================================================== */

function getInitialCountry() {
  const savedCountry = readStorage(COUNTRY_STORAGE_KEY);

  const countryConfig = findHolidayCountryConfig(savedCountry);

  if (countryConfig) {
    return countryConfig.code;
  }

  return getBrowserCountry() || DEFAULT_COUNTRY;
}

/* ===========================================================
   DETECÇÃO PRIVADA DO PAÍS PELO NAVEGADOR

   A região do idioma é utilizada somente na primeira visita.
   Não há geolocalização, consulta por IP nem permissão. Uma
   escolha manual salva sempre continua tendo prioridade.
=========================================================== */

function getBrowserLocales() {
  if (typeof navigator === 'undefined') {
    return [];
  }

  const locales = Array.isArray(navigator.languages) ? navigator.languages : [];

  return [...new Set([...locales, navigator.language].filter(Boolean))];
}

function getExplicitLocaleRegion(locale) {
  const localeParts = String(locale).replace(/_/g, '-').split('-').slice(1);
  const region = localeParts.find((part) => /^[A-Za-z]{2}$/.test(part));

  return region?.toUpperCase() || null;
}

function getLikelyLocaleRegion(locale) {
  if (typeof Intl === 'undefined' || typeof Intl.Locale !== 'function') {
    return null;
  }

  try {
    return new Intl.Locale(locale).maximize().region?.toUpperCase() || null;
  } catch {
    return null;
  }
}

function getRegisteredCountryCode(region) {
  return findHolidayCountryConfig(region)?.code || null;
}

function getBrowserCountry() {
  const browserLocales = getBrowserLocales();

  /* Regiões declaradas explicitamente, como BR, GB ou MX,
     prevalecem sobre qualquer inferência baseada só no idioma. */
  for (const locale of browserLocales) {
    const countryCode = getRegisteredCountryCode(getExplicitLocaleRegion(locale));

    if (countryCode) {
      return countryCode;
    }
  }

  /* Idiomas sem região, como "en" ou "pt", usam a região
     mais provável definida pelo padrão internacional do navegador. */
  for (const locale of browserLocales) {
    const countryCode = getRegisteredCountryCode(getLikelyLocaleRegion(locale));

    if (countryCode) {
      return countryCode;
    }
  }

  return null;
}

/* ===========================================================
   REGIÃO INICIAL DO SELETOR
=========================================================== */

function getInitialRegion() {
  const savedRegion = readStorage(REGION_STORAGE_KEY);

  return HOLIDAY_REGIONS.includes(savedRegion) ? savedRegion : DEFAULT_REGION;
}

/* ===========================================================
   FILTROS INICIAIS

   Somente valores booleanos válidos são recuperados.
   Filtros ausentes continuam ativados por padrão.
=========================================================== */

function getInitialFilters() {
  const initialFilters = {
    ...DEFAULT_HOLIDAY_FILTERS,
  };

  const savedFilters = readStorage(FILTERS_STORAGE_KEY);

  if (!savedFilters) {
    return initialFilters;
  }

  try {
    const parsedFilters = JSON.parse(savedFilters);

    HOLIDAY_TYPES.forEach((type) => {
      if (typeof parsedFilters?.[type] === 'boolean') {
        initialFilters[type] = parsedFilters[type];
      }
    });
  } catch {
    // Se o conteúdo salvo for inválido,
    // utilizamos os filtros padrão.
  }

  return initialFilters;
}

/* ===========================================================
   MODO INICIAL DO ENCARTE DE 13 MESES
=========================================================== */

function getInitialCalendar13HolidayMode() {
  const savedMode = readStorage(CALENDAR_13_MODE_STORAGE_KEY);

  return Object.values(CALENDAR_13_HOLIDAY_MODES).includes(savedMode)
    ? savedMode
    : DEFAULT_CALENDAR_13_HOLIDAY_MODE;
}

/* ===========================================================
   ESTADO GLOBAL COMPARTILHADO

   Como estes estados ficam fora da função composable,
   todos os componentes utilizam a mesma seleção.
=========================================================== */

const holidayCountry = ref(getInitialCountry());

const holidayRegion = ref(getInitialRegion());

const holidayFilters = reactive(getInitialFilters());

const calendar13HolidayMode = ref(getInitialCalendar13HolidayMode());

/* ===========================================================
   PERSISTÊNCIA AUTOMÁTICA DO PAÍS
=========================================================== */

watch(holidayCountry, (countryCode) => {
  writeStorage(COUNTRY_STORAGE_KEY, countryCode);
});

/* ===========================================================
   PERSISTÊNCIA AUTOMÁTICA DA REGIÃO
=========================================================== */

watch(holidayRegion, (region) => {
  writeStorage(REGION_STORAGE_KEY, region);
});

/* ===========================================================
   PERSISTÊNCIA AUTOMÁTICA DOS FILTROS
=========================================================== */

watch(
  holidayFilters,
  (filters) => {
    writeStorage(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  },
  {
    deep: true,
  },
);

/* ===========================================================
   PERSISTÊNCIA DO MODO DO CALENDÁRIO DE 13 MESES
=========================================================== */

watch(calendar13HolidayMode, (mode) => {
  writeStorage(CALENDAR_13_MODE_STORAGE_KEY, mode);
});

/* ===========================================================
   ACESSO ÀS CONFIGURAÇÕES DE FERIADOS
=========================================================== */

export function useHolidaySettings() {
  function setHolidayCountry(countryCode) {
    const countryConfig = findHolidayCountryConfig(countryCode);

    if (!countryConfig) {
      return false;
    }

    holidayCountry.value = countryConfig.code;

    return true;
  }

  function resetHolidayFilters() {
    Object.assign(holidayFilters, DEFAULT_HOLIDAY_FILTERS);
  }

  function setCalendar13HolidayMode(mode) {
    if (!Object.values(CALENDAR_13_HOLIDAY_MODES).includes(mode)) {
      return false;
    }

    calendar13HolidayMode.value = mode;

    return true;
  }

  return {
    holidayCountry,
    holidayRegion,
    holidayFilters,
    calendar13HolidayMode,
    setHolidayCountry,
    setCalendar13HolidayMode,
    resetHolidayFilters,
  };
}
