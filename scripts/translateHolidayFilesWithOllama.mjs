import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ===========================================================
   PASTAS E MODELO LOCAL
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const sourceDirectory = resolve(projectDirectory, 'manual-holiday-translations/source');
const translatedDirectory = resolve(projectDirectory, 'manual-holiday-translations/translated');
const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/chat';
const ollamaModel = process.env.OLLAMA_MODEL || 'gpt-oss:20b';

const languageNames = Object.freeze({
  ar: 'Modern Standard Arabic',
  de: 'German',
  es: 'Spanish from Spain',
  fr: 'French',
  hi: 'Hindi',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  pt: 'Brazilian Portuguese',
  ru: 'Russian',
  zh: 'Simplified Chinese',
});

/* ===========================================================
   LEITURA DOS IDENTIFICADORES MANUAIS
=========================================================== */

function parseEntries(content, fileName) {
  const entries = String(content)
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*\[\[(HT\d{6})\]\]\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => ({ id: match[1], source: match[2] }));

  if (entries.length === 0) {
    throw new Error(`${fileName}: nenhum identificador encontrado.`);
  }

  return entries;
}

function validateTranslatedEntries(sourceEntries, translatedEntries, fileName) {
  const translatedById = new Map(
    translatedEntries.map(({ id, text }) => [String(id), String(text || '').trim()]),
  );
  const sourceIds = sourceEntries.map(({ id }) => id);

  if (
    translatedById.size !== sourceEntries.length ||
    sourceIds.some((id) => !translatedById.get(id))
  ) {
    throw new Error(`${fileName}: o modelo perdeu ou duplicou identificadores.`);
  }

  return sourceEntries.map(({ id }) => ({ id, text: translatedById.get(id) }));
}

/* ===========================================================
   TRADUÇÃO E DIVISÃO DE LOTES
=========================================================== */

async function translateBlock(entries, targetLanguage, blockName) {
  const response = await fetch(ollamaUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      stream: false,
      think: 'low',
      format: {
        type: 'object',
        properties: {
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                text: { type: 'string' },
              },
              required: ['id', 'text'],
            },
          },
        },
        required: ['translations'],
      },
      options: {
        temperature: 0.1,
        num_ctx: 8192,
        num_predict: 8192,
      },
      messages: [
        {
          role: 'system',
          content:
            `Translate holiday names from English into ${targetLanguage}. ` +
            'Keep proper names, make each name concise and understandable, preserve every id ' +
            'exactly, and return every item once. Do not add commentary.',
        },
        {
          role: 'user',
          content: JSON.stringify({ entries }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`${blockName}: Ollama respondeu HTTP ${response.status}.`);
  }

  const responseData = await response.json();
  const parsed = JSON.parse(responseData?.message?.content || '{}');

  return validateTranslatedEntries(entries, parsed.translations || [], blockName);
}

async function translateBlockWithFallback(entries, targetLanguage, blockName) {
  try {
    return await translateBlock(entries, targetLanguage, blockName);
  } catch (error) {
    if (entries.length === 1) {
      throw error;
    }

    const middle = Math.ceil(entries.length / 2);
    const firstHalf = await translateBlockWithFallback(
      entries.slice(0, middle),
      targetLanguage,
      `${blockName}.1`,
    );
    const secondHalf = await translateBlockWithFallback(
      entries.slice(middle),
      targetLanguage,
      `${blockName}.2`,
    );

    return [...firstHalf, ...secondHalf];
  }
}

/* ===========================================================
   PROCESSAMENTO DOS ARQUIVOS EXPORTADOS
=========================================================== */

await mkdir(translatedDirectory, { recursive: true });

const fileNames = (await readdir(sourceDirectory)).filter((fileName) => fileName.endsWith('.txt')).sort();

for (const [index, fileName] of fileNames.entries()) {
  const languageCode = fileName.match(/^([a-z]{2,3})-from-en-/)?.[1];
  const targetLanguage = languageNames[languageCode];

  if (!targetLanguage) {
    throw new Error(`${fileName}: idioma de destino desconhecido.`);
  }

  const sourceContent = await readFile(resolve(sourceDirectory, fileName), 'utf8');
  const sourceEntries = parseEntries(sourceContent, fileName);

  console.log(`${index + 1}/${fileNames.length} ${fileName}: ${sourceEntries.length} nomes...`);

  const translatedEntries = await translateBlockWithFallback(
    sourceEntries,
    targetLanguage,
    fileName,
  );
  const translatedContent = `${translatedEntries
    .map(({ id, text }) => `[[${id}]] ${text}`)
    .join('\n')}\n`;

  await writeFile(resolve(translatedDirectory, fileName), translatedContent, 'utf8');
}

console.log(`Traduções locais concluídas em ${translatedDirectory}.`);
