/* ===========================================================
   REGISTRO DOS PAÍSES
=========================================================== */

import { findHolidayCountryConfig } from 'src/holidays/countryRegistry';

/* ===========================================================
   ESTAÇÕES DO ANO
=========================================================== */

import { seasonHolidayNames } from 'src/holidays/names/SEASONS';

/* ===========================================================
   TRADUÇÕES GERADAS CARREGADAS PARA O PAÍS ATUAL
=========================================================== */

import { getLoadedHolidayTranslations } from 'src/holidays/holidayTranslationRuntime';

/* ===========================================================
   CORREÇÕES MANUAIS OPCIONAIS
=========================================================== */

import { holidayTranslationOverrides } from 'src/holidays/holidayTranslationOverrides';

import { resolveHolidayTranslationFamily } from 'src/holidays/holidayTranslationFamilies';

/* ===========================================================
   NORMALIZAÇÃO DO IDIOMA
=========================================================== */

function normalizeLocale(locale) {
  return String(locale || '')
    .trim()
    .replace('_', '-');
}

/* ===========================================================
   CONSULTA DE UMA TRADUÇÃO
=========================================================== */

function findTranslation(translations, locale, language, nameId) {
  return translations?.[locale]?.[nameId] || translations?.[language]?.[nameId] || null;
}

/* ===========================================================
   CONSULTA DO CACHE GERADO

   Cada entrada do cache contém:
   - source: nome original que foi traduzido;
   - text: resultado da tradução.
=========================================================== */

function findGeneratedTranslation(countryCode, language, nameId) {
  const generatedEntry = getLoadedHolidayTranslations(countryCode)?.[language]?.[nameId];

  if (typeof generatedEntry === 'string') {
    return generatedEntry;
  }

  return generatedEntry?.text || null;
}

/* ===========================================================
   RESOLUÇÃO DO NOME DO FERIADO

   Ordem de prioridade:

   1. Correção manual opcional;
   2. Tradução já cadastrada no país;
   3. Tradução automática armazenada no cache;
   4. Nome oficial no idioma nativo;
   5. Identificador interno.
=========================================================== */

export function resolveHolidayName(holiday, locale) {
  if (!holiday?.country || !holiday?.nameId) {
    return holiday?.localizedName || '';
  }

  const countryCode = String(holiday.country).trim().toUpperCase();

  const countryConfig = findHolidayCountryConfig(countryCode);

  const catalogCode = String(holiday.nameCatalog || countryCode)
    .trim()
    .toUpperCase();

  const catalog = catalogCode === 'SEASONS' ? seasonHolidayNames : countryConfig?.names;

  const normalizedLocale = normalizeLocale(locale);

  const language = normalizedLocale.split('-')[0].toLowerCase();

  const manualOverride = findTranslation(
    holidayTranslationOverrides[catalogCode],
    normalizedLocale,
    language,
    holiday.nameId,
  );

  if (manualOverride) {
    return manualOverride;
  }

  const familyTranslation = resolveHolidayTranslationFamily({
    catalogCode,
    nameId: holiday.nameId,
    language,
  });

  if (familyTranslation) {
    return familyTranslation;
  }

  const catalogTranslation = findTranslation(
    catalog?.translations,
    normalizedLocale,
    language,
    holiday.nameId,
  );

  if (catalogTranslation) {
    return catalogTranslation;
  }

  const generatedTranslation = findGeneratedTranslation(catalogCode, language, holiday.nameId);

  if (generatedTranslation) {
    return generatedTranslation;
  }

  if (holiday.localizedName) {
    return holiday.localizedName;
  }

  const nativeTranslation = catalog?.translations?.[catalog.defaultLanguage]?.[holiday.nameId];

  return nativeTranslation || holiday.nameId;
}
