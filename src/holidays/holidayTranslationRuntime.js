/* ===========================================================
   TRADUÇÕES CARREGADAS SOB DEMANDA

   O navegador baixa apenas o arquivo do país selecionado. As
   promessas são compartilhadas entre os dois calendários para
   que cada país seja transferido somente uma vez por sessão.
=========================================================== */

const translationsByCountry = new Map();
const pendingLoadsByCountry = new Map();

function normalizeCountryCode(countryCode) {
  return String(countryCode || '')
    .trim()
    .toUpperCase();
}

function resolveCountryTranslationUrl(countryCode) {
  return `${import.meta.env.BASE_URL}holiday-data/translations/${countryCode}.json`;
}

/* ===========================================================
   CARREGAMENTO ASSÍNCRONO
=========================================================== */

export async function loadHolidayTranslations(countryCode) {
  const normalizedCountryCode = normalizeCountryCode(countryCode);

  if (!normalizedCountryCode) {
    return {};
  }

  if (translationsByCountry.has(normalizedCountryCode)) {
    return translationsByCountry.get(normalizedCountryCode);
  }

  if (!pendingLoadsByCountry.has(normalizedCountryCode)) {
    const pendingLoad = fetch(resolveCountryTranslationUrl(normalizedCountryCode))
      .then(async (response) => {
        if (response.status === 404) {
          return {};
        }

        if (!response.ok) {
          throw new Error(
            `Falha ao carregar traduções de ${normalizedCountryCode}: ${response.status}.`,
          );
        }

        return response.json();
      })
      .then((translations) => {
        translationsByCountry.set(normalizedCountryCode, translations);
        pendingLoadsByCountry.delete(normalizedCountryCode);

        return translations;
      })
      .catch((error) => {
        pendingLoadsByCountry.delete(normalizedCountryCode);
        throw error;
      });

    pendingLoadsByCountry.set(normalizedCountryCode, pendingLoad);
  }

  return pendingLoadsByCountry.get(normalizedCountryCode);
}

/* ===========================================================
   LEITURA SÍNCRONA DE UM PACOTE JÁ CARREGADO
=========================================================== */

export function getLoadedHolidayTranslations(countryCode) {
  return translationsByCountry.get(normalizeCountryCode(countryCode)) || {};
}
