import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

import { dirname, resolve } from 'node:path';

import { fileURLToPath } from 'node:url';

/* ===========================================================
   CAMINHOS DOS DADOS DE EXECUÇÃO

   O cache completo continua sendo a fonte de manutenção. Para
   o navegador, cada país recebe um arquivo pequeno e independente.
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const translationCachePath = resolve(
  projectDirectory,
  'src/holidays/generated/holidayTranslations.json',
);
const outputDirectory = resolve(
  projectDirectory,
  'public/holiday-data/translations',
);

/* ===========================================================
   GERAÇÃO DOS PACOTES POR PAÍS
=========================================================== */

const translationCache = JSON.parse(await readFile(translationCachePath, 'utf8'));
const countryTranslations = translationCache.translations || {};

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const [countryCode, translations] of Object.entries(countryTranslations)) {
  const outputPath = resolve(outputDirectory, `${countryCode.toUpperCase()}.json`);

  await writeFile(outputPath, `${JSON.stringify(translations)}\n`, 'utf8');
}

/* Remove qualquer arquivo que não corresponda à geração atual.
   A conferência também protege contra nomes de país inválidos. */
const generatedFiles = (await readdir(outputDirectory)).sort();
const expectedFiles = Object.keys(countryTranslations)
  .map((countryCode) => `${countryCode.toUpperCase()}.json`)
  .sort();

if (JSON.stringify(generatedFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error('Os pacotes de tradução por país não foram gerados integralmente.');
}

console.log(
  `Pacotes de tradução preparados para ${generatedFiles.length} países em public/holiday-data.`,
);
