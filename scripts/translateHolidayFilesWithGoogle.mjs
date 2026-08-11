import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ===========================================================
   CAMINHOS DOS ARQUIVOS MANUAIS
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const manualDirectory = resolve(projectDirectory, 'manual-holiday-translations');
const sourceDirectory = resolve(manualDirectory, 'source');
const translatedDirectory = resolve(manualDirectory, 'translated');
const manifestFile = resolve(manualDirectory, 'manifest.json');

/* ===========================================================
   CONFIGURAÇÃO DO GOOGLE TRADUTOR GRATUITO

   Este comando usa somente o serviço web gratuito. Não lê
   chave de API, não ativa faturamento e nunca chama a API
   comercial configurada anteriormente no projeto.
=========================================================== */

const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
const MAX_ATTEMPTS = 3;
const REQUEST_INTERVAL_MS = 120;

const googleLanguageCode = Object.freeze({
  zh: 'zh-CN',
});

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

function parseFileLanguages(fileName) {
  const match = fileName.match(/^([a-z-]+)-from-([a-z-]+)-\d+\.txt$/i);

  if (!match) {
    throw new Error(`Nome de arquivo manual inválido: ${fileName}`);
  }

  return {
    targetLanguage: googleLanguageCode[match[1]] || match[1],
    sourceLanguage: googleLanguageCode[match[2]] || match[2],
  };
}

/* ===========================================================
   VALIDAÇÃO DOS IDENTIFICADORES

   Cada marcador precisa voltar na mesma quantidade e ordem.
   Qualquer alteração interrompe o processo antes da importação.
=========================================================== */

function extractTranslationIds(text) {
  return [...String(text).matchAll(/\[\[(HT\d{6})\]\]/g)].map((match) => match[1]);
}

function validateTranslationIds(sourceText, translatedText, fileName) {
  const sourceIds = extractTranslationIds(sourceText);
  const translatedIds = extractTranslationIds(translatedText);

  if (JSON.stringify(sourceIds) !== JSON.stringify(translatedIds)) {
    throw new Error(`O Google alterou os identificadores internos em ${fileName}.`);
  }
}

/* ===========================================================
   TRADUÇÃO DE UM BLOCO COM NOVAS TENTATIVAS
=========================================================== */

async function translateText({ text, sourceLanguage, targetLanguage, fileName }) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const body = new URLSearchParams({
        client: 'gtx',
        sl: sourceLanguage,
        tl: targetLanguage,
        dt: 't',
        q: text,
      });
      const response = await fetch(GOOGLE_TRANSLATE_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`resposta HTTP ${response.status}`);
      }

      const responseData = await response.json();
      const translatedText = responseData?.[0]
        ?.map((segment) => segment?.[0] || '')
        .join('')
        .replace(/^(\[\[HT\d{6}\]\])[ \t]*/gm, '$1 ');

      if (!translatedText) {
        throw new Error('resposta sem texto traduzido');
      }

      validateTranslationIds(text, translatedText, fileName);

      return translatedText;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_ATTEMPTS) {
        await wait(500 * attempt);
      }
    }
  }

  throw new Error(`Falha ao traduzir ${fileName}: ${lastError.message}`);
}

/* ===========================================================
   PROCESSAMENTO DOS ARQUIVOS EXPORTADOS
=========================================================== */

const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files)) {
  throw new Error('O manifesto de traduções manuais é inválido. Exporte-o novamente.');
}

await mkdir(translatedDirectory, { recursive: true });

let translatedFileCount = 0;

for (const { fileName } of manifest.files) {
  const sourceFile = resolve(sourceDirectory, fileName);
  const targetFile = resolve(translatedDirectory, fileName);
  const sourceText = await readFile(sourceFile, 'utf8');
  const { sourceLanguage, targetLanguage } = parseFileLanguages(fileName);
  const translatedText = await translateText({
    text: sourceText,
    sourceLanguage,
    targetLanguage,
    fileName,
  });

  await writeFile(targetFile, translatedText, 'utf8');

  translatedFileCount += 1;
  console.log(`[${translatedFileCount}/${manifest.files.length}] ${fileName}`);

  await wait(REQUEST_INTERVAL_MS);
}

console.log(`Tradução gratuita concluída: ${translatedFileCount} arquivo(s), sem chave de API.`);
