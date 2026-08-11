import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

import { dirname, resolve } from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

import Holidays from 'date-holidays-parser';

import { resolveHolidayTranslationSource } from '../src/holidays/holidayTranslationContexts.js';

import { holidaySourceTranslationOverrides } from '../src/holidays/holidayTranslationOverrides.js';

import { resolveHolidayTranslationFamily } from '../src/holidays/holidayTranslationFamilies.js';

import {
  getSubstituteBaseRule,
  removeSubstituteSuffix,
} from '../src/holidays/holidaySubstitution.js';

import { getHolidayCountryExtensionTranslationRecords } from '../src/holidays/holidayCountryExtensions.js';

/* ===========================================================
   CAMINHOS DO PROJETO
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

const projectDirectory = resolve(scriptDirectory, '..');

const holidayNamesDirectory = resolve(projectDirectory, 'src/holidays/names');

const i18nDirectory = resolve(projectDirectory, 'src/i18n');

const outputFile = resolve(projectDirectory, 'src/holidays/generated/holidayTranslations.json');

const internationalHolidayDataFile = resolve(
  projectDirectory,
  'src/holidays/generated/dateHolidays.json',
);

const internationalCountryMetadataFile = resolve(
  projectDirectory,
  'src/holidays/generated/holidayCountries.json',
);

const officialHolidayAppendixFile = resolve(
  projectDirectory,
  'src/holidays/generated/officialHolidayAppendix.json',
);

const manualTranslationDirectory = resolve(projectDirectory, 'manual-holiday-translations');

const manualSourceDirectory = resolve(manualTranslationDirectory, 'source');

const manualTranslatedDirectory = resolve(manualTranslationDirectory, 'translated');

const manualManifestFile = resolve(manualTranslationDirectory, 'manifest.json');

const manualInstructionsFile = resolve(manualTranslationDirectory, 'INSTRUCOES.txt');

const MANUAL_TRANSLATION_PROVIDER = 'manual-google-translate-web';

const MAX_MANUAL_FILE_CHARACTERS = 4500;

const checkOnly = process.argv.includes('--check');

const planOnly = process.argv.includes('--plan');

const exportManualTranslations = process.argv.includes('--export-manual');

const importManualTranslations = process.argv.includes('--import-manual');

/* ===========================================================
   DESCOBERTA AUTOMÁTICA DOS IDIOMAS DA INTERFACE

   Exemplo:
   pt-BR.js → pt
   en-US.js → en
=========================================================== */

async function discoverTargetLanguages() {
  const files = await readdir(i18nDirectory);

  const languages = files
    .map((fileName) => {
      const match = fileName.match(/^([a-z]{2,3})(?:-[A-Z]{2})?\.js$/);

      return match?.[1]?.toLowerCase() || null;
    })
    .filter(Boolean);

  return [...new Set(languages)].sort();
}

/* ===========================================================
   DESCOBERTA AUTOMÁTICA DOS CATÁLOGOS DOS PAÍSES

   Qualquer arquivo no formato XX.js será carregado.
=========================================================== */

async function discoverHolidayCatalogs() {
  const files = (await readdir(holidayNamesDirectory))
    .filter((fileName) => /^[A-Z][A-Z0-9_]*\.js$/.test(fileName))
    .sort();

  const catalogs = [];

  for (const fileName of files) {
    const countryCode = fileName.replace(/\.js$/, '');

    const filePath = resolve(holidayNamesDirectory, fileName);

    const fileModule = await import(pathToFileURL(filePath).href);

    const catalog = Object.values(fileModule).find(
      (value) =>
        value &&
        typeof value === 'object' &&
        typeof value.defaultLanguage === 'string' &&
        value.translations,
    );

    if (!catalog) {
      throw new Error(`Catálogo inválido: ${fileName}`);
    }

    const sourceLanguage = catalog.defaultLanguage.toLowerCase();

    const nativeNames = catalog.translations?.[sourceLanguage];

    if (!nativeNames || typeof nativeNames !== 'object') {
      throw new Error(
        `O catálogo ${fileName} não possui nomes no idioma nativo ${sourceLanguage}.`,
      );
    }

    catalogs.push({
      countryCode,
      sourceLanguage,
      nativeNames,
      catalogTranslations: catalog.translations,

      translationSources: catalog.translationSources || {},
    });
  }

  return catalogs;
}

/* ===========================================================
   IDENTIFICADOR DAS REGRAS DA BASE INTERNACIONAL

   Precisa usar o mesmo algoritmo aplicado durante a exibição
   em src/holidays/dateHolidayProvider.js.
=========================================================== */

function hashRule(rule) {
  let hash = 5381;

  for (const character of String(rule || '')) {
    hash = (hash * 33) ^ character.codePointAt(0);
  }

  return (hash >>> 0).toString(36);
}

/* ===========================================================
   DETECÇÃO DE NOMES GENÉRICOS

   A geração deve parar quando a base internacional trouxer um
   rótulo que não explique a data. Isso impede que novos países
   voltem a exibir apenas “Feriado” ou “Dia Nacional”.
=========================================================== */

const genericHolidayNamePattern =
  /^(public|national|state|civic|bank|school|optional|additional|special|official|legal|federal)?\s*(holiday|holidays|day|day off|non-working day|observance)$|^(additional day|bridge day|voting day|first monday in (june|august)|october bank holiday|spring bank holiday|early may bank holiday|día adicional|feriado adicional|feriado|día festivo|jour férié|feiertag|праздник)$/iu;

/* ===========================================================
   LEITURA DOS NOMES DIRETAMENTE DAS REGRAS

   O cache de traduções é organizado por regra, não por ano.
   Assim, regras históricas e futuras são descobertas sem
   simular calendários entre 1900 e 2100.
=========================================================== */

function findPreferredName(nameSource, preferredLanguages = []) {
  if (typeof nameSource === 'string') {
    return nameSource;
  }

  if (!nameSource || typeof nameSource !== 'object') {
    return null;
  }

  const languageOrder = ['en', ...preferredLanguages];

  for (const language of languageOrder) {
    const translatedName = nameSource[language];

    if (typeof translatedName === 'string' && translatedName.trim()) {
      return translatedName;
    }
  }

  return Object.values(nameSource).find(
    (translatedName) => typeof translatedName === 'string' && translatedName.trim(),
  );
}

function resolveInternationalRuleName({ definition, countryData, holidayData }) {
  if (typeof definition.name === 'string') {
    return definition.name;
  }

  if (definition.name?.en) {
    return definition.name.en;
  }

  const sharedName = definition._name ? holidayData.names?.[definition._name]?.name : null;

  return (
    findPreferredName(sharedName, countryData.langs) ||
    findPreferredName(definition.name, countryData.langs) ||
    definition._name ||
    null
  );
}

function normalizeComparableRuleName(name) {
  return removeSubstituteSuffix(name)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replaceAll('’', "'")
    .toLowerCase();
}

function discoverCountryRuleRecords({ countryCode, holidayData }) {
  const countryData = holidayData.holidays?.[countryCode];

  if (!countryData) {
    throw new Error(`A base internacional não possui o país ${countryCode}.`);
  }

  const provider = new Holidays(holidayData);

  if (!provider.init(countryCode)) {
    throw new Error(`O parser não conseguiu inicializar o país ${countryCode}.`);
  }

  const records = Object.entries(provider.holidays)
    .filter(
      ([, definition]) => definition && definition !== false && typeof definition === 'object',
    )
    .map(([rule, definition]) => ({
      rule,
      definition,
      name: resolveInternationalRuleName({
        definition,
        countryData,
        holidayData,
      }),
    }))
    .filter((record) => Boolean(record.name));

  getHolidayCountryExtensionTranslationRecords(countryCode).forEach(
    ({ rule, sourceName: name }) => {
      if (rule && name) {
        records.push({
          rule,
          name,
          definition: {},
        });
      }
    },
  );

  return records.map((record) => {
    let canonicalRule = getSubstituteBaseRule({
      rule: record.rule,
      substitute: record.definition.substitute,
    });

    if (record.definition.substitute === true && canonicalRule === record.rule) {
      const comparableName = normalizeComparableRuleName(record.name);

      const originalRecord = records.find(
        (candidate) =>
          candidate !== record &&
          candidate.definition.substitute !== true &&
          normalizeComparableRuleName(candidate.name) === comparableName,
      );

      canonicalRule = originalRecord?.rule || canonicalRule;
    }

    return {
      ...record,
      canonicalRule: canonicalRule || record.rule,
    };
  });
}

/* ===========================================================
   CATÁLOGOS GERADOS A PARTIR DA BASE INTERNACIONAL
=========================================================== */

async function discoverInternationalHolidayCatalogs() {
  const fileContent = await readFile(internationalHolidayDataFile, 'utf8');
  const holidayData = JSON.parse(fileContent);

  const metadataContent = await readFile(internationalCountryMetadataFile, 'utf8');

  const countryMetadata = JSON.parse(metadataContent);

  /* Os seis países com catálogo editorial também utilizam a base
     internacional no modo híbrido. Por isso, suas regras gerais
     precisam participar da tradução junto com os complementos. */
  const internationalCountryCodes = countryMetadata.countries
    .filter(({ hasHolidayData }) => hasHolidayData !== false)
    .map(({ code }) => code);

  const genericIssues = [];

  const catalogs = internationalCountryCodes.map((countryCode) => {
    const nativeNames = {};
    const catalogTranslations = {};
    const translationSources = {};
    const unresolvedGenericNames = new Set();

    const ruleRecords = discoverCountryRuleRecords({
      countryCode,
      holidayData,
    });

    ruleRecords.forEach(({ canonicalRule, definition, name }) => {
      const nameId = `dateHolidays.${hashRule(canonicalRule)}`;
      const translationSource = resolveHolidayTranslationSource({
        country: countryCode,
        rule: canonicalRule,
        name,
      });

      if (!nativeNames[nameId]) {
        nativeNames[nameId] = name;
        translationSources[nameId] = translationSource;

        /* Traduções mantidas pela própria fonte têm prioridade
           quando o nome não precisou receber contexto adicional. */
        if (translationSource === name && definition.name && typeof definition.name === 'object') {
          Object.entries(definition.name).forEach(([languageCode, translatedName]) => {
            const language = languageCode.split('-')[0].toLowerCase();

            if (typeof translatedName === 'string' && translatedName.trim()) {
              catalogTranslations[language] ||= {};
              catalogTranslations[language][nameId] ||= translatedName;
            }
          });
        }

        if (genericHolidayNamePattern.test(translationSource)) {
          unresolvedGenericNames.add(`${name} [${canonicalRule}]`);
        }
      }
    });

    if (unresolvedGenericNames.size > 0) {
      genericIssues.push(`${countryCode}: ${[...unresolvedGenericNames].join(', ')}`);
    }

    return {
      countryCode,
      /*
        “auto” mantém o inglês entre os idiomas de saída.
        As descrições internacionais ampliadas são escritas em
        inglês, por isso esse é o idioma enviado ao tradutor.
      */
      sourceLanguage: 'auto',
      requestSourceLanguage: 'en',
      nativeNames,
      catalogTranslations,
      translationSources,
    };
  });

  if (genericIssues.length > 0) {
    throw new Error(
      `Existem nomes genéricos sem contexto:\n${genericIssues
        .map((issue) => `- ${issue}`)
        .join('\n')}`,
    );
  }

  return catalogs;
}

/* ===========================================================
   CATÁLOGOS DO APÊNDICE OFICIAL

   Ocorrências anuais usam identificadores estáveis e entram
   no mesmo cache central. Assim, um novo país oficial não exige
   copiar seus nomes para os doze arquivos de interface.
=========================================================== */

async function discoverOfficialAppendixCatalogs() {
  const appendix = JSON.parse(await readFile(officialHolidayAppendixFile, 'utf8'));

  return Object.entries(appendix.occurrences || {})
    .map(([countryCode, years]) => {
      const nativeNames = {};
      const translationSources = {};

      Object.values(years).forEach((occurrences) => {
        occurrences.forEach((occurrence) => {
          const nameId = `official.${occurrence.id}`;
          const sourceName = resolveHolidayTranslationSource({
            country: countryCode,
            rule: `official ${occurrence.id}`,
            name: occurrence.name,
          });

          nativeNames[nameId] ||= occurrence.name;
          translationSources[nameId] ||= sourceName;
        });
      });

      return {
        countryCode,
        sourceLanguage: 'auto',
        requestSourceLanguage: 'en',
        nativeNames,
        catalogTranslations: {},
        translationSources,
      };
    })
    .filter(({ nativeNames }) => Object.keys(nativeNames).length > 0);
}

/* ===========================================================
   LEITURA DO CACHE EXISTENTE
=========================================================== */

async function readTranslationCache() {
  try {
    const fileContent = await readFile(outputFile, 'utf8');

    const parsedCache = JSON.parse(fileContent);

    return {
      generatedAt: parsedCache.generatedAt || null,

      provider: parsedCache.provider || null,

      translations:
        parsedCache.translations && typeof parsedCache.translations === 'object'
          ? parsedCache.translations
          : {},
    };
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }

    return {
      generatedAt: null,
      provider: null,
      translations: {},
    };
  }
}

/* ===========================================================
   ELIMINAÇÃO DE TRADUÇÕES REPETIDAS

   Um mesmo nome pode aparecer em dezenas de países. Ele vira
   uma unidade manual e o resultado é aplicado a todos os IDs.
=========================================================== */

function createTranslationUnits(translationJobs) {
  const unitsBySignature = new Map();

  translationJobs.forEach((job) => {
    const signature = JSON.stringify([job.requestSourceLanguage, job.targetLanguage, job.source]);

    if (!unitsBySignature.has(signature)) {
      unitsBySignature.set(signature, {
        sourceLanguage: job.requestSourceLanguage,
        targetLanguage: job.targetLanguage,
        source: job.source,
        jobs: [],
      });
    }

    unitsBySignature.get(signature).jobs.push(job);
  });

  return [...unitsBySignature.values()].sort(
    (first, second) =>
      first.targetLanguage.localeCompare(second.targetLanguage) ||
      first.sourceLanguage.localeCompare(second.sourceLanguage) ||
      first.source.localeCompare(second.source),
  );
}

/* ===========================================================
   MANIFESTO ESTÁVEL DOS ARQUIVOS MANUAIS
=========================================================== */

function createManualManifest(translationUnits) {
  const units = translationUnits.map((unit, index) => ({
    id: `HT${String(index + 1).padStart(6, '0')}`,
    sourceLanguage: unit.sourceLanguage,
    targetLanguage: unit.targetLanguage,
    source: unit.source,
    targets: unit.jobs.map(({ countryCode, nameId }) => ({
      countryCode,
      nameId,
    })),
  }));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    units,
    files: [],
  };
}

/* ===========================================================
   DIVISÃO EM ARQUIVOS DE ATÉ 4.500 CARACTERES
=========================================================== */

function createManualFiles(manifest) {
  const unitsByLanguagePair = new Map();

  manifest.units.forEach((unit) => {
    const pairKey = `${unit.targetLanguage}-from-${unit.sourceLanguage}`;

    if (!unitsByLanguagePair.has(pairKey)) {
      unitsByLanguagePair.set(pairKey, []);
    }

    unitsByLanguagePair.get(pairKey).push(unit);
  });

  const files = [];

  for (const [pairKey, units] of unitsByLanguagePair) {
    let currentLines = [];
    let currentCharacterCount = 0;
    let fileIndex = 1;

    function closeCurrentFile() {
      if (currentLines.length === 0) {
        return;
      }

      files.push({
        fileName: `${pairKey}-${String(fileIndex).padStart(3, '0')}.txt`,
        ids: currentLines.map(({ id }) => id),
        content: `${currentLines.map(({ id, source }) => `[[${id}]] ${source}`).join('\n')}\n`,
      });

      currentLines = [];
      currentCharacterCount = 0;
      fileIndex += 1;
    }

    units.forEach((unit) => {
      const lineLength = unit.id.length + unit.source.length + 7;

      if (
        currentLines.length > 0 &&
        currentCharacterCount + lineLength > MAX_MANUAL_FILE_CHARACTERS
      ) {
        closeCurrentFile();
      }

      currentLines.push(unit);
      currentCharacterCount += lineLength;
    });

    closeCurrentFile();
  }

  return files;
}

/* ===========================================================
   EXPORTAÇÃO PARA O GOOGLE TRADUTOR GRATUITO
=========================================================== */

async function writeManualTranslationFiles(translationUnits) {
  const manifest = createManualManifest(translationUnits);
  const files = createManualFiles(manifest);

  manifest.files = files.map(({ fileName, ids }) => ({ fileName, ids }));

  await rm(manualSourceDirectory, { recursive: true, force: true });
  await mkdir(manualSourceDirectory, { recursive: true });
  await mkdir(manualTranslatedDirectory, { recursive: true });

  await Promise.all(
    files.map(({ fileName, content }) =>
      writeFile(resolve(manualSourceDirectory, fileName), content, 'utf8'),
    ),
  );

  const instructions = [
    'TRADUÇÃO MANUAL DOS FERIADOS',
    '',
    '1. Traduza cada arquivo da pasta source no Google Tradutor gratuito.',
    '2. O idioma de destino e o idioma de origem estão no nome do arquivo.',
    '3. Não altere os identificadores entre colchetes duplos: [[HT000001]].',
    '4. Salve o resultado com o mesmo nome dentro da pasta translated.',
    '5. Não junte, remova nem reordene linhas.',
    '6. Depois execute: npm run holidays:translate:import',
    '',
    `Arquivos: ${files.length}`,
    `Textos únicos: ${manifest.units.length}`,
  ].join('\n');

  await writeFile(manualManifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(manualInstructionsFile, `${instructions}\n`, 'utf8');

  console.log(
    `Exportados ${manifest.units.length} textos únicos em ${files.length} arquivos: ` +
      manualSourceDirectory,
  );
}

/* ===========================================================
   LEITURA E VALIDAÇÃO DOS ARQUIVOS DEVOLVIDOS
=========================================================== */

async function readManualTranslations(translationUnits) {
  const manifest = JSON.parse(await readFile(manualManifestFile, 'utf8'));
  const currentManifest = createManualManifest(translationUnits);

  if (manifest.schemaVersion !== 1 || manifest.units.length !== currentManifest.units.length) {
    throw new Error('O manifesto manual não corresponde às traduções pendentes atuais.');
  }

  currentManifest.units.forEach((currentUnit, index) => {
    const exportedUnit = manifest.units[index];
    const fields = ['id', 'sourceLanguage', 'targetLanguage', 'source'];

    if (fields.some((field) => exportedUnit[field] !== currentUnit[field])) {
      throw new Error(`O manifesto ficou desatualizado na unidade ${currentUnit.id}.`);
    }
  });

  const translatedEntries = new Map();

  for (const { fileName, ids } of manifest.files) {
    const translatedFile = resolve(manualTranslatedDirectory, fileName);
    let fileContent;

    try {
      fileContent = await readFile(translatedFile, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') {
        throw new Error(`Arquivo traduzido ausente: ${fileName}`);
      }

      throw error;
    }

    const fileEntries = new Map();

    fileContent.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*\[\[(HT\d{6})\]\]\s+(.+?)\s*$/);

      if (!match) {
        return;
      }

      if (translatedEntries.has(match[1])) {
        throw new Error(`Identificador manual duplicado: ${match[1]}.`);
      }

      fileEntries.set(match[1], match[2]);
      translatedEntries.set(match[1], match[2]);
    });

    const missingFileIds = ids.filter((id) => !fileEntries.has(id));

    if (missingFileIds.length > 0) {
      throw new Error(`${fileName} perdeu identificadores: ${missingFileIds.join(', ')}.`);
    }
  }

  const missingIds = manifest.units.map(({ id }) => id).filter((id) => !translatedEntries.has(id));

  if (missingIds.length > 0) {
    throw new Error(`Traduções manuais ausentes: ${missingIds.join(', ')}.`);
  }

  return new Map(
    translationUnits.map((unit, index) => [unit, translatedEntries.get(manifest.units[index].id)]),
  );
}

/* ===========================================================
   LIMPEZA DOS ARQUIVOS MANUAIS JÁ IMPORTADOS

   A pasta é removida somente depois de a importação ter sido
   validada e o cache final ter sido gravado com sucesso. Uma
   nova exportação recria toda a estrutura quando necessário.
=========================================================== */

async function removeImportedManualTranslationFiles() {
  await rm(manualTranslationDirectory, { recursive: true, force: true });

  console.log(`Arquivos temporários removidos: ${manualTranslationDirectory}`);
}

/* ===========================================================
   ORDENAÇÃO DO JSON GERADO
=========================================================== */

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortObject(value[key])]),
  );
}

/* ===========================================================
   GERAÇÃO DAS TRADUÇÕES
=========================================================== */

async function generateTranslations() {
  const targetLanguages = await discoverTargetLanguages();

  const editorialCatalogs = await discoverHolidayCatalogs();

  const internationalCatalogs = await discoverInternationalHolidayCatalogs();

  const officialAppendixCatalogs = await discoverOfficialAppendixCatalogs();

  const catalogs = [...editorialCatalogs, ...internationalCatalogs, ...officialAppendixCatalogs];

  if (checkOnly) {
    const nameCount = catalogs.reduce(
      (total, catalog) => total + Object.keys(catalog.nativeNames).length,
      0,
    );

    const countryCount = new Set(
      catalogs
        .map(({ countryCode }) => countryCode)
        .filter((countryCode) => countryCode !== 'SEASONS'),
    ).size;

    console.log(
      `Catálogos válidos: ${countryCount} países, estações e ` + `${nameCount} regras traduzíveis.`,
    );

    return;
  }

  const cache = await readTranslationCache();

  const originalTranslations = JSON.stringify(cache.translations);

  const translationJobs = [];

  let manualTranslationsImported = false;

  const validCountries = new Set(catalogs.map((catalog) => catalog.countryCode));
  const validNameIdsByCountry = new Map();
  const validTargetLanguagesByCountry = new Map();

  /* Um país híbrido possui dois catálogos: o editorial e o
     internacional. A limpeza do cache usa a união dos dois para
     impedir que o segundo apague as entradas criadas pelo primeiro. */
  catalogs.forEach(({ countryCode, sourceLanguage, nativeNames }) => {
    if (!validNameIdsByCountry.has(countryCode)) {
      validNameIdsByCountry.set(countryCode, new Set());
      validTargetLanguagesByCountry.set(countryCode, new Set());
    }

    Object.keys(nativeNames).forEach((nameId) => {
      validNameIdsByCountry.get(countryCode).add(nameId);
    });

    targetLanguages
      .filter((language) => language !== sourceLanguage)
      .forEach((language) => {
        validTargetLanguagesByCountry.get(countryCode).add(language);
      });
  });

  for (const cachedCountry of Object.keys(cache.translations)) {
    if (!validCountries.has(cachedCountry)) {
      delete cache.translations[cachedCountry];
    }
  }

  validCountries.forEach((countryCode) => {
    cache.translations[countryCode] ||= {};

    const validTargetLanguages = validTargetLanguagesByCountry.get(countryCode);
    const validNameIds = validNameIdsByCountry.get(countryCode);

    for (const cachedLanguage of Object.keys(cache.translations[countryCode])) {
      if (!validTargetLanguages.has(cachedLanguage)) {
        delete cache.translations[countryCode][cachedLanguage];
        continue;
      }

      const targetCache = cache.translations[countryCode][cachedLanguage];

      for (const cachedNameId of Object.keys(targetCache)) {
        if (!validNameIds.has(cachedNameId)) {
          delete targetCache[cachedNameId];
        }
      }
    }
  });

  for (const catalog of catalogs) {
    const {
      countryCode,
      sourceLanguage,
      requestSourceLanguage,
      nativeNames,
      catalogTranslations,
      translationSources,
    } = catalog;

    const validTargetLanguages = new Set(
      targetLanguages.filter((language) => language !== sourceLanguage),
    );

    for (const targetLanguage of validTargetLanguages) {
      const targetCache = cache.translations[countryCode][targetLanguage] || {};

      cache.translations[countryCode][targetLanguage] = targetCache;

      const pendingEntries = [];

      for (const [nameId, sourceText] of Object.entries(nativeNames)) {
        const translationSource = translationSources[nameId] || sourceText;

        const familyTranslation = resolveHolidayTranslationFamily({
          catalogCode: countryCode,
          nameId,
          language: targetLanguage,
        });

        if (familyTranslation) {
          targetCache[nameId] = {
            source: translationSource,
            text: familyTranslation,
            origin: 'translation-family',
            sourceLanguage,
          };

          continue;
        }

        const sharedTranslation =
          holidaySourceTranslationOverrides[translationSource]?.[targetLanguage];

        if (sharedTranslation) {
          targetCache[nameId] = {
            source: translationSource,
            text: sharedTranslation,
            origin: 'shared-editorial-override',
            sourceLanguage,
          };

          continue;
        }

        const catalogTranslation = catalogTranslations?.[targetLanguage]?.[nameId];

        if (catalogTranslation) {
          targetCache[nameId] = {
            source: translationSource,

            text: catalogTranslation,

            origin: 'catalog',
          };

          continue;
        }

        const cachedEntry = targetCache[nameId];

        const cacheIsCurrent =
          cachedEntry &&
          cachedEntry.source === translationSource &&
          (sourceLanguage !== 'auto' || cachedEntry.sourceLanguage === 'auto') &&
          typeof cachedEntry.text === 'string' &&
          cachedEntry.text.length > 0;

        if (cacheIsCurrent) {
          continue;
        }

        pendingEntries.push({
          nameId,
          source: translationSource,
        });
      }

      if (pendingEntries.length === 0) {
        continue;
      }

      pendingEntries.forEach((entry) => {
        translationJobs.push({
          ...entry,
          countryCode,
          targetLanguage,
          targetCache,
          cacheSourceLanguage: sourceLanguage,
          requestSourceLanguage: requestSourceLanguage || sourceLanguage,
        });
      });
    }
  }

  const sourceJobs = translationJobs.filter(
    (job) => job.requestSourceLanguage === job.targetLanguage,
  );
  const manualJobs = translationJobs.filter(
    (job) => job.requestSourceLanguage !== job.targetLanguage,
  );
  const translationUnits = createTranslationUnits(manualJobs);

  if (planOnly) {
    const manualCharacterCount = translationUnits.reduce(
      (total, unit) => total + unit.source.length,
      0,
    );
    const manualFileCount = createManualFiles(createManualManifest(translationUnits)).length;

    console.log(
      [
        `Plano gratuito: ${translationUnits.length} textos manuais únicos`,
        `(${manualCharacterCount} caracteres em ${manualFileCount} arquivos)`,
        `representando ${manualJobs.length} utilizações na base`,
        `e ${sourceJobs.length} textos copiados da fonte.`,
      ].join(' '),
    );

    return;
  }

  /* Catálogos editoriais podem reutilizar diretamente o texto
     quando o idioma nativo também é o idioma de destino. As
     fontes internacionais usam detecção automática, inclusive
     ao produzir o nome canônico em inglês. */
  sourceJobs.forEach((job) => {
    job.targetCache[job.nameId] = {
      source: job.source,
      text: job.source,
      origin: 'source',
      sourceLanguage: job.cacheSourceLanguage,
    };
  });

  if (translationUnits.length > 0 && (exportManualTranslations || !importManualTranslations)) {
    await writeManualTranslationFiles(translationUnits);

    return;
  }

  if (translationUnits.length > 0 && importManualTranslations) {
    const translatedUnits = await readManualTranslations(translationUnits);

    translatedUnits.forEach((translatedText, unit) => {
      unit.jobs.forEach((job) => {
        job.targetCache[job.nameId] = {
          source: job.source,
          text: translatedText,
          origin: MANUAL_TRANSLATION_PROVIDER,
          sourceLanguage: job.cacheSourceLanguage,
        };
      });
    });

    manualTranslationsImported = true;
  }

  const translationsChanged = originalTranslations !== JSON.stringify(cache.translations);

  if (!translationsChanged) {
    console.log('O cache de traduções já está atualizado.');

    if (manualTranslationsImported) {
      await removeImportedManualTranslationFiles();
    }

    return;
  }

  const generatedCache = {
    generatedAt: new Date().toISOString(),

    provider: MANUAL_TRANSLATION_PROVIDER,

    translations: sortObject(cache.translations),
  };

  await mkdir(dirname(outputFile), {
    recursive: true,
  });

  await writeFile(outputFile, `${JSON.stringify(generatedCache, null, 2)}\n`, 'utf8');

  console.log(`Cache atualizado: ${outputFile}`);

  if (manualTranslationsImported) {
    await removeImportedManualTranslationFiles();
  }
}

/* ===========================================================
   EXECUÇÃO
=========================================================== */

generateTranslations().catch((error) => {
  console.error(`\n${error.message}\n`);

  process.exitCode = 1;
});
