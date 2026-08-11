import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { brazilHolidayDefinitions } from '../src/holidays/countries/BR.js';
import { germanyHolidayDefinitions } from '../src/holidays/countries/DE.js';
import { spainHolidayDefinitions } from '../src/holidays/countries/ES.js';
import { franceHolidayDefinitions } from '../src/holidays/countries/FR.js';
import { russiaHolidayDefinitions } from '../src/holidays/countries/RU.js';
import { unitedStatesHolidayDefinitions } from '../src/holidays/countries/US.js';
import {
  DEFAULT_HOLIDAY_EMOJI_BY_TYPE,
  resolveInternationalHolidayEmojiDetails,
} from '../src/holidays/holidayEmojiResolver.js';
import { brazilHolidayNames } from '../src/holidays/names/BR.js';
import { germanyHolidayNames } from '../src/holidays/names/DE.js';
import { spainHolidayNames } from '../src/holidays/names/ES.js';
import { franceHolidayNames } from '../src/holidays/names/FR.js';
import { russiaHolidayNames } from '../src/holidays/names/RU.js';
import { unitedStatesHolidayNames } from '../src/holidays/names/US.js';

/* ===========================================================
   ARQUIVOS GERADOS E PAÍSES EDITORIAIS
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const translationFile = resolve(
  projectDirectory,
  'src/holidays/generated/holidayTranslations.json',
);
const countryMetadataFile = resolve(
  projectDirectory,
  'src/holidays/generated/holidayCountries.json',
);

const editorialCountries = Object.freeze([
  {
    code: 'BR',
    definitions: brazilHolidayDefinitions,
    names: brazilHolidayNames,
  },
  {
    code: 'DE',
    definitions: germanyHolidayDefinitions,
    names: germanyHolidayNames,
  },
  {
    code: 'ES',
    definitions: spainHolidayDefinitions,
    names: spainHolidayNames,
  },
  {
    code: 'FR',
    definitions: franceHolidayDefinitions,
    names: franceHolidayNames,
  },
  {
    code: 'RU',
    definitions: russiaHolidayDefinitions,
    names: russiaHolidayNames,
  },
  {
    code: 'US',
    definitions: unitedStatesHolidayDefinitions,
    names: unitedStatesHolidayNames,
  },
]);

/* Escolhas históricas deliberadas dos catálogos originais.
   Elas não devem ser normalizadas silenciosamente porque já
   fazem parte da identidade visual aprovada do aplicativo. */
const allowedEditorialVariants = new Map([
  ['DE/DE_GERMAN_UNITY_DAY', '🇩🇪'],
  ['FR/FR_VICTORY_1945', '🕊️'],
  ['FR/FR_ASSUMPTION', '🙏'],
]);

/* ===========================================================
   EQUIVALÊNCIAS GLOBAIS OBRIGATÓRIAS

   O mínimo evita que uma alteração de nome faça uma família
   inteira voltar silenciosamente para bandeiras ou genéricos.
=========================================================== */

const requiredEquivalences = Object.freeze([
  { concept: 'second_christmas_day', emoji: '🎁', minimum: 75 },
  { concept: 'labour_day', emoji: '🧰', minimum: 160 },
  { concept: 'mothers_day', emoji: '❤️', minimum: 65 },
  { concept: 'fathers_day', emoji: '💙', minimum: 30 },
  { concept: 'womens_day', emoji: '🌷', minimum: 25 },
  { concept: 'teachers_day', emoji: '🎓', minimum: 5 },
  { concept: 'christmas', emoji: '🎄', minimum: 190 },
  { concept: 'easter', emoji: '🐰', minimum: 200 },
  { concept: 'good_friday', emoji: '🩸', minimum: 120 },
]);

const requiredNamedEmojis = Object.freeze([
  { country: 'CA', name: 'Queen Victoria Day', emoji: '👑' },
  { country: 'CA', name: 'Canadian Civic Holiday', emoji: '🇨🇦' },
  { country: 'VA', name: 'Saint John the Apostle', emoji: '🙏' },
  { country: 'JP', name: 'Labor Thanksgiving Day', emoji: '🧰' },
  { country: 'KR', name: 'Korean Thanksgiving', emoji: '🌾' },
  { country: 'CH', name: 'Thanksgiving, Repentance and Prayer', emoji: '🙏' },
  { country: 'HR', name: 'Victory and Homeland Thanksgiving', emoji: '🎖️' },
  { country: 'AT', name: 'Austrian National Day', emoji: '🇦🇹' },
  { country: 'EE', name: 'Declaration of Sovereignty', emoji: '🇪🇪' },
  { country: 'AL', name: 'Sultan Nevruz', emoji: '🌱' },
  { country: 'GB', name: "Queen Elizabeth's Funeral Day", emoji: '🕯️' },
  { country: 'NO', name: 'Birthday of Princess Ingrid Alexandra', emoji: '👑' },
  { country: 'MY', name: "Yang di-Pertuan Agong's Birthday", emoji: '👑' },
  { country: 'IR', name: 'Birthday of Imam Ali', emoji: '🌙' },
  { country: 'HK', name: 'Ching Ming Festival', emoji: '🕯️' },
  { country: 'HK', name: 'Tuen Ng Festival', emoji: '🐉' },
  { country: 'TW', name: 'Qixi Festival', emoji: '💘' },
  { country: 'JP', name: 'Seven-Five-Three Festival', emoji: '🧒' },
  { country: 'BE', name: 'Belgian National Day', emoji: '🇧🇪' },
  { country: 'CV', name: 'Cape Verde National Day', emoji: '🇨🇻' },
  { country: 'TR', name: 'Youth and Sports Day', emoji: '🏆' },
  { country: 'PY', name: 'national football team', emoji: '🏆' },
  { country: 'HK', name: 'day following Good Friday', emoji: '✝️' },
  { country: 'BZ', name: "St. George's Caye Day", emoji: '🎖️' },
  { country: 'HU', name: "Saint Stephen's Day", emoji: '🇭🇺' },
  { country: 'ME', name: 'Second Day of Orthodox Christmas', emoji: '🎁' },
  { country: 'DE', name: 'Totensonntag', emoji: '🕯️' },
  { country: 'DE', name: '1. Advent', emoji: '🕯️' },
]);

const maximumUnresolvedRatio = 0.06;

const translationCache = JSON.parse(await readFile(translationFile, 'utf8'));
const countryMetadata = JSON.parse(await readFile(countryMetadataFile, 'utf8'));

/* ===========================================================
   DATA REPRESENTATIVA DAS REGRAS EDITORIAIS
=========================================================== */

function getRepresentativeDate(definition) {
  if (definition.rule?.kind !== 'fixed') {
    return '2026-06-15';
  }

  return `2026-${String(definition.rule.month).padStart(2, '0')}-${String(
    definition.rule.day,
  ).padStart(2, '0')}`;
}

/* ===========================================================
   AUDITORIA DOS SEIS CATÁLOGOS ORIGINAIS

   Um conceito conhecido nunca pode contrariar o emoji que já
   havia sido escolhido editorialmente nesses países.
=========================================================== */

const errors = [];
let editorialRuleCount = 0;

editorialCountries.forEach(({ code, definitions, names }) => {
  definitions.forEach((definition) => {
    editorialRuleCount += 1;

    const canonicalName =
      names.translations?.en?.[definition.nameId] ||
      translationCache.translations?.[code]?.en?.[definition.nameId]?.text;

    if (!canonicalName) {
      errors.push(`${code}/${definition.id}: nome inglês ausente.`);
      return;
    }

    const resolved = resolveInternationalHolidayEmojiDetails({
      country: code,
      date: getRepresentativeDate(definition),
      canonicalName,
      type: definition.type,
      substitute: false,
    });

    const editorialKey = `${code}/${definition.id}`;
    const allowedVariant = allowedEditorialVariants.get(editorialKey);

    if (
      !resolved.generic &&
      resolved.emoji !== definition.emoji &&
      allowedVariant !== definition.emoji
    ) {
      errors.push(
        `${code}/${definition.id}: ${definition.emoji} diverge de ` +
          `${resolved.emoji} (${resolved.concept}).`,
      );
    }
  });
});

/* ===========================================================
   AUDITORIA DOS PAÍSES COM CALENDÁRIO INTERNACIONAL

   Os seis países editoriais também usam a fonte internacional
   no modo híbrido. Seus IDs dateHolidays precisam passar pela
   mesma verificação de conceitos e últimos recursos genéricos.
=========================================================== */

const internationalCountryCodes = countryMetadata.countries
  .filter(({ hasHolidayData }) => hasHolidayData !== false)
  .map(({ code }) => code);

const records = [];

internationalCountryCodes.forEach((countryCode) => {
  const englishCatalog = translationCache.translations?.[countryCode]?.en;

  if (!englishCatalog) {
    errors.push(`${countryCode}: catálogo canônico em inglês ausente.`);
    return;
  }

  Object.entries(englishCatalog).forEach(([nameId, entry]) => {
    const resolved = resolveInternationalHolidayEmojiDetails({
      country: countryCode,
      date: '2026-06-15',
      canonicalName: entry.text,
      type: 'public',
      substitute: false,
    });

    records.push({
      countryCode,
      nameId,
      name: entry.text,
      ...resolved,
    });
  });
});

/* ===========================================================
   CONSISTÊNCIA DENTRO DE CADA CONCEITO
=========================================================== */

const recordsByConcept = new Map();

records.forEach((record) => {
  if (!recordsByConcept.has(record.concept)) {
    recordsByConcept.set(record.concept, []);
  }

  recordsByConcept.get(record.concept).push(record);
});

const conceptsAllowedToVaryByCountry = new Set(['national_day', 'flag_day', 'generic_public']);

for (const [concept, conceptRecords] of recordsByConcept) {
  if (conceptsAllowedToVaryByCountry.has(concept)) {
    continue;
  }

  const emojis = new Set(conceptRecords.map(({ emoji }) => emoji));

  if (emojis.size > 1) {
    errors.push(`${concept}: emojis divergentes (${[...emojis].join(', ')}).`);
  }
}

requiredEquivalences.forEach(({ concept, emoji, minimum }) => {
  const conceptRecords = recordsByConcept.get(concept) || [];
  const emojis = new Set(conceptRecords.map((record) => record.emoji));

  if (conceptRecords.length < minimum || emojis.size !== 1 || !emojis.has(emoji)) {
    errors.push(
      `${concept}: esperados ao menos ${minimum} registros com ${emoji}; ` +
        `encontrados ${conceptRecords.length} com ${[...emojis].join(', ') || 'nenhum emoji'}.`,
    );
  }
});

requiredNamedEmojis.forEach(({ country, name, emoji }) => {
  const matchingRecords = records.filter(
    (record) => record.countryCode === country && record.name.includes(name),
  );

  if (matchingRecords.length === 0 || matchingRecords.some((record) => record.emoji !== emoji)) {
    errors.push(
      `${country}/${name}: esperado ${emoji}; encontrado ` +
        `${[...new Set(matchingRecords.map((record) => record.emoji))].join(', ') || 'nenhum'}.`,
    );
  }
});

/* ===========================================================
   LIMITE DOS ÚLTIMOS RECURSOS GENÉRICOS
=========================================================== */

const unresolvedRecords = records.filter(({ generic }) => generic);
const unresolvedRatio = unresolvedRecords.length / records.length;
const visibleGenericEmojis = new Set(Object.values(DEFAULT_HOLIDAY_EMOJI_BY_TYPE));
const visiblePublicGenerics = unresolvedRecords.filter(({ emoji }) =>
  visibleGenericEmojis.has(emoji),
);

if (unresolvedRatio > maximumUnresolvedRatio) {
  errors.push(
    `Último recurso semântico em ${(unresolvedRatio * 100).toFixed(1)}% das regras; ` +
      `o limite é ${(maximumUnresolvedRatio * 100).toFixed(1)}%.`,
  );
}

if (visiblePublicGenerics.length > 0) {
  errors.push(
    `${visiblePublicGenerics.length} feriado(s) público(s) ainda exibem emoji genérico visível.`,
  );
}

/* ===========================================================
   RESULTADO
=========================================================== */

if (errors.length > 0) {
  throw new Error(
    `A auditoria de emojis encontrou ${errors.length} problema(s):\n` +
      errors.map((error) => `- ${error}`).join('\n'),
  );
}

const equivalenceSummary = requiredEquivalences
  .map(
    ({ concept, emoji }) => `${concept}=${emoji} (${recordsByConcept.get(concept)?.length || 0})`,
  )
  .join(', ');

console.log(
  [
    `Emojis auditados em ${internationalCountryCodes.length + editorialCountries.length} países`,
    `(${internationalCountryCodes.length} internacionais + ${editorialCountries.length} editoriais).`,
    `Regras: ${records.length + editorialRuleCount}.`,
    `Sem genérico visível: ${records.length - visiblePublicGenerics.length}/${records.length}.`,
    `Últimos recursos semânticos: ${unresolvedRecords.length} (${(unresolvedRatio * 100).toFixed(1)}%).`,
    `Equivalências: ${equivalenceSummary}.`,
  ].join(' '),
);
