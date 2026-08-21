/* ===========================================================
   IMPORTAÇÕES DOS PAÍSES
   Cada país fornece regras, fontes e nomes próprios.
=========================================================== */

import { brazilHolidayDefinitions, brazilHolidaySources } from 'src/holidays/countries/BR';
import { brazilHolidayNames } from 'src/holidays/names/BR';

import {
  unitedStatesHolidayDefinitions,
  unitedStatesHolidaySources,
} from 'src/holidays/countries/US';
import { unitedStatesHolidayNames } from 'src/holidays/names/US';

import { franceHolidayDefinitions, franceHolidaySources } from 'src/holidays/countries/FR';
import { franceHolidayNames } from 'src/holidays/names/FR';

import { spainHolidayDefinitions, spainHolidaySources } from 'src/holidays/countries/ES';
import { spainHolidayNames } from 'src/holidays/names/ES';

import { germanyHolidayDefinitions, germanyHolidaySources } from 'src/holidays/countries/DE';
import { germanyHolidayNames } from 'src/holidays/names/DE';

import { russiaHolidayDefinitions, russiaHolidaySources } from 'src/holidays/countries/RU';
import { russiaHolidayNames } from 'src/holidays/names/RU';

import { allHolidayCountryMetadata, libraryHolidayCountries } from 'src/holidays/libraryCountries';

import {
  getOfficialHolidayReferences,
  hasOfficialHolidayOccurrences,
} from 'src/holidays/officialHolidayProvider';

/* ===========================================================
   REGIÕES DISPONÍVEIS NO SELETOR

   A ordem também controla a exibição quando o filtro “Todos”
   está selecionado. Oceania permanece em um único grupo.
=========================================================== */

export const HOLIDAY_REGION_GROUPS = Object.freeze([
  Object.freeze({
    continent: 'americas',
    regions: Object.freeze([
      'americasNorth',
      'americasCentral',
      'americasCaribbean',
      'americasSouth',
    ]),
  }),
  Object.freeze({
    continent: 'europe',
    regions: Object.freeze(['europeNorth', 'europeWest', 'europeSouth', 'europeEast']),
  }),
  Object.freeze({
    continent: 'asia',
    regions: Object.freeze(['asiaWest', 'asiaCentral', 'asiaSouth', 'asiaEast', 'asiaSoutheast']),
  }),
  Object.freeze({
    continent: 'africa',
    regions: Object.freeze([
      'africaNorth',
      'africaWest',
      'africaCentral',
      'africaEast',
      'africaSouthern',
    ]),
  }),
  Object.freeze({
    continent: 'oceania',
    regions: Object.freeze(['oceania']),
  }),
  Object.freeze({
    continent: 'antarctica',
    regions: Object.freeze(['antarctica']),
  }),
]);

export const HOLIDAY_REGIONS = Object.freeze([
  'all',
  ...HOLIDAY_REGION_GROUPS.flatMap(({ regions }) => regions),
]);

const holidayRegionBySubregion = Object.freeze({
  'North America': 'americasNorth',
  'Central America': 'americasCentral',
  Caribbean: 'americasCaribbean',
  'South America': 'americasSouth',
  'Northern Africa': 'africaNorth',
  'Western Africa': 'africaWest',
  'Middle Africa': 'africaCentral',
  'Eastern Africa': 'africaEast',
  'Southern Africa': 'africaSouthern',
  'Northern Europe': 'europeNorth',
  'Western Europe': 'europeWest',
  'Southern Europe': 'europeSouth',
  'Eastern Europe': 'europeEast',
  'Central Europe': 'europeEast',
  'Southeast Europe': 'europeSouth',
  'Western Asia': 'asiaWest',
  'Central Asia': 'asiaCentral',
  'Southern Asia': 'asiaSouth',
  'Eastern Asia': 'asiaEast',
  'South-Eastern Asia': 'asiaSoutheast',
  'Australia and New Zealand': 'oceania',
  Melanesia: 'oceania',
  Micronesia: 'oceania',
  Polynesia: 'oceania',
});

/* Países das zonas europeias intermediárias recebem o grupo
   mais reconhecível para a navegação simplificada do app. */
const holidayRegionOverrides = Object.freeze({
  TR: 'asiaCentral',
  GE: 'asiaCentral',
  AM: 'asiaCentral',
  AZ: 'asiaCentral',
  AF: 'asiaWest',
  IR: 'asiaWest',
  GB: 'europeWest',
  IM: 'europeWest',
  JE: 'europeWest',
  GG: 'europeWest',
  FO: 'europeNorth',
  IE: 'europeWest',
  PT: 'europeWest',
  ES: 'europeWest',
  IT: 'europeWest',
  MT: 'europeWest',
  SM: 'europeWest',
  VA: 'europeWest',
  EE: 'europeEast',
  AX: 'europeEast',
  LV: 'europeEast',
  LT: 'europeEast',
  SJ: 'europeEast',
  AT: 'europeWest',
  SI: 'europeSouth',
  BG: 'europeEast',
  RO: 'europeEast',
});

const countryMetadataByCode = new Map(
  allHolidayCountryMetadata.map((countryMetadata) => [countryMetadata.code, countryMetadata]),
);

function resolveHolidayRegion(countryCode, subregion, continent) {
  const holidayRegion =
    holidayRegionOverrides[countryCode] ||
    (continent === 'antarctica' ? 'antarctica' : holidayRegionBySubregion[subregion]);

  if (!holidayRegion) {
    throw new Error(`Região de feriados ausente para ${countryCode}: ${subregion}`);
  }

  return holidayRegion;
}

function getCountryGeography(countryCode) {
  const countryMetadata = countryMetadataByCode.get(countryCode);

  if (!countryMetadata) {
    throw new Error(`Metadados geográficos ausentes para ${countryCode}.`);
  }

  return {
    continent: countryMetadata.continent,
    holidayRegion: resolveHolidayRegion(
      countryCode,
      countryMetadata.subregion,
      countryMetadata.continent,
    ),
  };
}

/* ===========================================================
   BANDEIRAS A PARTIR DO CÓDIGO INTERNACIONAL
=========================================================== */

function countryCodeToFlag(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)));
}

/* ===========================================================
   PAÍSES COM CATÁLOGOS EDITORIAIS PRÓPRIOS
=========================================================== */

const editorialCountryRegistry = {
  BR: Object.freeze({
    code: 'BR',
    flag: '🇧🇷',
    hemisphere: 'south',
    ...getCountryGeography('BR'),
    provider: 'hybrid',

    definitions: brazilHolidayDefinitions,

    sources: brazilHolidaySources,

    names: brazilHolidayNames,
  }),

  US: Object.freeze({
    code: 'US',
    flag: '🇺🇸',
    hemisphere: 'north',
    ...getCountryGeography('US'),
    provider: 'hybrid',

    definitions: unitedStatesHolidayDefinitions,

    sources: unitedStatesHolidaySources,

    names: unitedStatesHolidayNames,
  }),

  FR: Object.freeze({
    code: 'FR',
    flag: '🇫🇷',
    hemisphere: 'north',
    ...getCountryGeography('FR'),
    provider: 'hybrid',

    definitions: franceHolidayDefinitions,

    sources: franceHolidaySources,

    names: franceHolidayNames,
  }),

  ES: Object.freeze({
    code: 'ES',
    flag: '🇪🇸',
    hemisphere: 'north',
    ...getCountryGeography('ES'),
    provider: 'hybrid',

    definitions: spainHolidayDefinitions,

    sources: spainHolidaySources,

    names: spainHolidayNames,
  }),

  DE: Object.freeze({
    code: 'DE',
    flag: '🇩🇪',
    hemisphere: 'north',
    ...getCountryGeography('DE'),
    provider: 'hybrid',

    definitions: germanyHolidayDefinitions,

    sources: germanyHolidaySources,

    names: germanyHolidayNames,
  }),

  RU: Object.freeze({
    code: 'RU',
    flag: '🇷🇺',
    hemisphere: 'north',
    ...getCountryGeography('RU'),
    provider: 'hybrid',

    definitions: russiaHolidayDefinitions,

    sources: russiaHolidaySources,

    names: russiaHolidayNames,
  }),
};

/* ===========================================================
   REGISTROS DO CATÁLOGO GEOGRÁFICO

   Países com calendário civil consultam date-holidays.
   Os demais fornecem somente eventos astronômicos até que
   uma fonte confiável seja acrescentada.
=========================================================== */

const libraryCountryRegistry = Object.fromEntries(
  libraryHolidayCountries.map(
    ({ code, continent, hasHolidayData, hemisphere, subregion, sources: references }) => [
      code,
      Object.freeze({
        code,
        flag: countryCodeToFlag(code),
        continent,
        holidayRegion: resolveHolidayRegion(code, subregion, continent),
        hemisphere,
        provider: hasHolidayData
          ? 'date-holidays'
          : hasOfficialHolidayOccurrences(code)
            ? 'official-appendix'
            : 'astronomical-only',
        definitions: Object.freeze([]),
        sources: Object.freeze({}),
        references: Object.freeze([...references, ...getOfficialHolidayReferences(code)]),
        names: null,
      }),
    ],
  ),
);

/* ===========================================================
   REGISTRO CENTRAL DOS PAÍSES DISPONÍVEIS
=========================================================== */

const holidayCountryRegistry = Object.freeze({
  ...editorialCountryRegistry,
  ...libraryCountryRegistry,
});

/* ===========================================================
   LISTA DOS CÓDIGOS DISPONÍVEIS
   Será utilizada pelo menu e pelo popup.
=========================================================== */

export const holidayCountryCodes = Object.freeze(Object.keys(holidayCountryRegistry));

/* ===========================================================
   CONSULTA SEGURA
   Retorna null quando o país não estiver cadastrado.
=========================================================== */

export function findHolidayCountryConfig(countryCode) {
  const normalizedCode = String(countryCode || '')
    .trim()
    .toUpperCase();

  return holidayCountryRegistry[normalizedCode] || null;
}

/* ===========================================================
   CONSULTA OBRIGATÓRIA
   Utilizada quando a ausência do país é um erro.
=========================================================== */

export function getHolidayCountryConfig(countryCode) {
  const countryConfig = findHolidayCountryConfig(countryCode);

  if (!countryConfig) {
    throw new Error(`País sem cadastro de feriados: ${countryCode}`);
  }

  return countryConfig;
}
