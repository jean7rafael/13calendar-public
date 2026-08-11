import { readFile, readdir } from 'node:fs/promises';

import { dirname, resolve } from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  holidayTranslationFamilies,
  resolveHolidayTranslationFamily,
} from '../src/holidays/holidayTranslationFamilies.js';

/* ===========================================================
   CAMINHOS E IDIOMAS DA INTERFACE
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const i18nDirectory = resolve(projectDirectory, 'src/i18n');
const holidayNamesDirectory = resolve(projectDirectory, 'src/holidays/names');
const translationCacheFile = resolve(
  projectDirectory,
  'src/holidays/generated/holidayTranslations.json',
);

async function discoverTargetLanguages() {
  const files = await readdir(i18nDirectory);

  return [
    ...new Set(
      files
        .map((fileName) => fileName.match(/^([a-z]{2,3})(?:-[A-Z]{2})?\.js$/)?.[1] || null)
        .filter(Boolean),
    ),
  ].sort();
}

/* ===========================================================
   LEITURA DO CATÁLOGO EDITORIAL
=========================================================== */

async function loadHolidayCatalog(catalogCode) {
  const filePath = resolve(holidayNamesDirectory, `${catalogCode}.js`);
  const fileModule = await import(pathToFileURL(filePath).href);

  return Object.values(fileModule).find(
    (value) =>
      value &&
      typeof value === 'object' &&
      typeof value.defaultLanguage === 'string' &&
      value.translations,
  );
}

/* ===========================================================
   AUDITORIA DAS FAMÍLIAS

   A validação impede três regressões:
   - um novo idioma sem o termo canônico da família;
   - uma família que deixou de reconhecer seus IDs;
   - o cache voltar a conter traduções divergentes.
=========================================================== */

const targetLanguages = await discoverTargetLanguages();
const translationCache = JSON.parse(await readFile(translationCacheFile, 'utf8'));
const issues = [];
let auditedNameCount = 0;

for (const family of holidayTranslationFamilies) {
  const missingLanguages = targetLanguages.filter((language) => !family.labels[language]);

  if (missingLanguages.length > 0) {
    issues.push(
      `${family.id}: terminologia ausente para ${missingLanguages.join(', ')}.`,
    );
  }

  const catalog = await loadHolidayCatalog(family.catalogCode);

  if (!catalog) {
    issues.push(`${family.id}: catálogo ${family.catalogCode} não encontrado.`);
    continue;
  }

  const nativeLanguage = catalog.defaultLanguage.toLowerCase();
  const nativeNames = catalog.translations?.[nativeLanguage] || {};
  const familyNameIds = Object.keys(nativeNames).filter((nameId) =>
    family.nameIdPattern.test(nameId),
  );

  if (familyNameIds.length < 2) {
    issues.push(`${family.id}: menos de dois nomes reconhecidos no catálogo.`);
    continue;
  }

  auditedNameCount += familyNameIds.length;

  for (const language of targetLanguages) {
    for (const nameId of familyNameIds) {
      const expectedText = resolveHolidayTranslationFamily({
        catalogCode: family.catalogCode,
        nameId,
        language,
      });
      const cachedEntry = translationCache.translations?.[family.catalogCode]?.[language]?.[nameId];
      const actualText =
        language === nativeLanguage
          ? nativeNames[nameId]
          : typeof cachedEntry === 'string'
            ? cachedEntry
            : cachedEntry?.text;

      if (!expectedText) {
        issues.push(`${family.id}/${language}/${nameId}: texto canônico não resolvido.`);
        continue;
      }

      if (actualText !== expectedText) {
        issues.push(
          `${family.id}/${language}/${nameId}: cache divergente de “${expectedText}”.`,
        );
      }
    }
  }
}

if (issues.length > 0) {
  throw new Error(`Inconsistências nas famílias de tradução:\n- ${issues.join('\n- ')}`);
}

console.log(
  `Famílias de tradução válidas: ${holidayTranslationFamilies.length} família(s), ` +
    `${auditedNameCount} nomes e ${targetLanguages.length} idiomas.`,
);
