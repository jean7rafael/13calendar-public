import holidayCountryMetadata from 'src/holidays/generated/holidayCountries.json';

/* ===========================================================
   PAÍSES COM CURADORIA EDITORIAL PRÓPRIA

   Eles também existem na base internacional. Seus catálogos
   detalhados agora complementam e enriquecem a base geral.
=========================================================== */

export const EDITORIAL_HOLIDAY_COUNTRY_CODES = Object.freeze(['BR', 'DE', 'ES', 'FR', 'RU', 'US']);

const editorialCountryCodes = new Set(EDITORIAL_HOLIDAY_COUNTRY_CODES);

/* ===========================================================
   METADADOS INTEGRAIS DO CATÁLOGO GEOGRÁFICO
=========================================================== */

export const allHolidayCountryMetadata = Object.freeze(
  holidayCountryMetadata.countries.map((country) => Object.freeze(country)),
);

/* ===========================================================
   PAÍSES E TERRITÓRIOS DO REGISTRO AUTOMÁTICO

   A lista combina o catálogo geográfico completo com os países
   cobertos pela fonte. Os seis países híbridos são retirados
   somente desta lista automática porque já possuem registros
   manuais no registro central. Países sem calendário civil ainda
   recebem os eventos astronômicos calculados pelo aplicativo.
=========================================================== */

export const libraryHolidayCountries = Object.freeze(
  allHolidayCountryMetadata.filter(({ code }) => !editorialCountryCodes.has(code)),
);
