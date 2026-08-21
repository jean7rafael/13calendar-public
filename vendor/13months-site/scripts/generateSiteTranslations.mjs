import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* ===========================================================
   CAMINHOS E IDIOMAS DA PÁGINA INCORPORADA
=========================================================== */

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const componentDirectory = resolve(projectDirectory, "src/components");
const outputFile = resolve(projectDirectory, "src/locales/generatedMessages.json");
const sourceMessageFile = resolve(projectDirectory, "src/locales/sourceMessages.json");
const googleTranslateUrl = "https://translate.googleapis.com/translate_a/single";
const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";
const ollamaModel = process.env.OLLAMA_MODEL || "gpt-oss:20b";
const useOllama = process.argv.includes("--ollama");
const useSequentialOllama = process.argv.includes("--ollama-sequential");
const extractOnly = process.argv.includes("--extract-only");
const printMessages = process.argv.includes("--print-messages");
const writeSourceMessages = process.argv.includes("--write-source-messages");

const targetLanguages = {
    "pt-BR": "pt",
    "de-DE": "de",
    "fr-FR": "fr",
    "it-IT": "it",
    "es-ES": "es",
    "ru-RU": "ru",
    "ar-SA": "ar",
    "hi-IN": "hi",
    "zh-CN": "zh-CN",
    "ja-JP": "ja",
    "ko-KR": "ko",
};

const languageNames = {
    "pt-BR": "Brazilian Portuguese",
    "de-DE": "German",
    "fr-FR": "French",
    "it-IT": "Italian",
    "es-ES": "Spanish from Spain",
    "ru-RU": "Russian",
    "ar-SA": "Modern Standard Arabic",
    "hi-IN": "Hindi",
    "zh-CN": "Simplified Chinese",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
};

const extraMessages = [
    "Skip to content",
    "Choose language",
    "Close language menu",
    "Languages",
    "Use light theme",
    "Use dark theme",
    "Previous year, {year}",
    "Next year, {year}",
    "Return to current year, {year}",
    "{year} is a leap year · After Year Day",
    "{year} is not a leap year",
    "A day outside the weekly cycle",
    "An intercalary day immediately after Year Day",
    "Month {month} of 13 · Week {week} of 4",
    "Year Day, {year}",
    "Leap Day, {year}",
    "{weekday}, {month} {day}, {year}",
    "Now",
    "Link copied!",
    "Couldn't share",
    "Share this",
    "votes",
    "All 13 months of {year}",
    "{month}, month {number}",
    "{weekday}, {month} {day}{today}",
    " (today)",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Sol",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

/* ===========================================================
   TERMOS CURTOS QUE EXIGEM CONTEXTO

   Tradutores genéricos confundem "Sun" (domingo) com o Sol.
   Esta tabela preserva as abreviações calendáricas e volta a
   ser aplicada sempre que o catálogo for regenerado.
=========================================================== */

const curatedTranslations = {
    "pt-BR": { Sun: "Dom", Mon: "Seg", Tue: "Ter", Wed: "Qua", Thu: "Qui", Fri: "Sex", Sat: "Sáb", "days every month": "dias em todos os meses", "Go to 13months.net": "Ir para 13months.net" },
    "de-DE": { Sun: "So", Mon: "Mo", Tue: "Di", Wed: "Mi", Thu: "Do", Fri: "Fr", Sat: "Sa", "days every month": "Tage in jedem Monat", "Go to 13months.net": "Zu 13months.net" },
    "fr-FR": { Sun: "Dim", Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Jeu", Fri: "Ven", Sat: "Sam", "days every month": "jours dans chaque mois", "Go to 13months.net": "Aller sur 13months.net" },
    "it-IT": { Sun: "Dom", Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Gio", Fri: "Ven", Sat: "Sab", "days every month": "giorni in ogni mese", "Go to 13months.net": "Vai a 13months.net" },
    "es-ES": { Sun: "Dom", Mon: "Lun", Tue: "Mar", Wed: "Mié", Thu: "Jue", Fri: "Vie", Sat: "Sáb", "days every month": "días en cada mes", "Go to 13months.net": "Ir a 13months.net" },
    "ru-RU": { Sun: "Вс", Mon: "Пн", Tue: "Вт", Wed: "Ср", Thu: "Чт", Fri: "Пт", Sat: "Сб", "days every month": "дней в каждом месяце", "Go to 13months.net": "Перейти на 13months.net" },
    "ar-SA": { Sun: "أحد", Mon: "إثن", Tue: "ثلا", Wed: "أرب", Thu: "خمي", Fri: "جمع", Sat: "سبت", "days every month": "يومًا في كل شهر", "Go to 13months.net": "الانتقال إلى 13months.net" },
    "hi-IN": { Sun: "रवि", Mon: "सोम", Tue: "मंगल", Wed: "बुध", Thu: "गुरु", Fri: "शुक्र", Sat: "शनि", "days every month": "दिन, हर महीने", "Go to 13months.net": "13months.net पर जाएँ" },
    "zh-CN": { Sun: "周日", Mon: "周一", Tue: "周二", Wed: "周三", Thu: "周四", Fri: "周五", Sat: "周六", "days every month": "天，每个月都一样", "Go to 13months.net": "前往 13months.net" },
    "ja-JP": { Sun: "日", Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", "days every month": "日、すべての月で同じ", "Go to 13months.net": "13months.net へ移動" },
    "ko-KR": { Sun: "일", Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금", Sat: "토", "days every month": "일, 모든 달이 동일", "Go to 13months.net": "13months.net으로 이동" },
};

/* ===========================================================
   DIA BISSEXTO DEPOIS DO DIA DO ANO

   A expressão "After Year Day" indica a posição do Dia
   Bissexto no calendário e não pode ser reduzida ao nome do
   Dia do Ano nem ao sentido de "incluído". Estas traduções
   acompanham o texto do calendário principal e prevalecem
   sobre qualquer resultado automático.
=========================================================== */

const curatedLeapDayTranslations = {
    "pt-BR": {
        "{year} is a leap year · After Year Day": "{year} é bissexto · após o Dia do Ano",
        "{year} is not a leap year": "{year} não é bissexto",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Um dia intercalar extra adicionado a cada 4 anos logo após o Dia do Ano. Também fora do ciclo semanal.",
    },
    "de-DE": {
        "{year} is a leap year · After Year Day": "{year} ist ein Schaltjahr · nach dem Tag des Jahres",
        "{year} is not a leap year": "{year} ist kein Schaltjahr",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Ein zusätzlicher Schalttag, der alle 4 Jahre direkt nach dem Tag des Jahres eingefügt wird. Ebenfalls außerhalb des Wochenzyklus.",
    },
    "fr-FR": {
        "{year} is a leap year · After Year Day": "{year} est bissextile · après le Jour de l'année",
        "{year} is not a leap year": "{year} n'est pas bissextile",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Un jour intercalaire supplémentaire ajouté tous les 4 ans juste après le Jour de l'année. Également hors du cycle hebdomadaire.",
    },
    "it-IT": {
        "{year} is a leap year · After Year Day": "{year} è bisestile · dopo il Giorno dell'anno",
        "{year} is not a leap year": "{year} non è bisestile",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Un giorno intercalare aggiuntivo inserito ogni 4 anni subito dopo il Giorno dell'anno. Anche fuori dal ciclo settimanale.",
    },
    "es-ES": {
        "{year} is a leap year · After Year Day": "{year} es bisiesto · después del Día del Año",
        "{year} is not a leap year": "{year} no es bisiesto",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Un día intercalar adicional añadido cada 4 años justo después del Día del Año. También fuera del ciclo semanal.",
    },
    "ru-RU": {
        "{year} is a leap year · After Year Day": "{year} — високосный год · после Дня года",
        "{year} is not a leap year": "{year} — не високосный год",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "Дополнительный вставной день, добавляемый раз в 4 года сразу после Дня года. Также вне недельного цикла.",
    },
    "ar-SA": {
        "{year} is a leap year · After Year Day": "السنة {year} كبيسة · بعد يوم السنة",
        "{year} is not a leap year": "السنة {year} غير كبيسة",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "يوم إضافي يُضاف كل 4 سنوات مباشرة بعد يوم السنة، وهو أيضًا خارج الدورة الأسبوعية.",
    },
    "hi-IN": {
        "{year} is a leap year · After Year Day": "{year} लीप वर्ष है · वर्ष दिवस के बाद",
        "{year} is not a leap year": "{year} लीप वर्ष नहीं है",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "हर 4 वर्ष में वर्ष दिवस के तुरंत बाद जोड़ा जाने वाला एक अतिरिक्त अंतरवर्ती दिन। यह साप्ताहिक चक्र से भी बाहर है।",
    },
    "zh-CN": {
        "{year} is a leap year · After Year Day": "{year}年是闰年 · 年度日之后",
        "{year} is not a leap year": "{year}年不是闰年",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "每4年在年度日之后紧接着增加的一个闰日，也不属于每周循环。",
    },
    "ja-JP": {
        "{year} is a leap year · After Year Day": "{year}年はうるう年・年の日の後",
        "{year} is not a leap year": "{year}年はうるう年ではありません",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "4年ごとに年の日の直後に加えられる特別な1日。週の周期にも属しません。",
    },
    "ko-KR": {
        "{year} is a leap year · After Year Day": "{year}년은 윤년 · 해의 날 이후",
        "{year} is not a leap year": "{year}년은 윤년이 아님",
        "An extra intercalary day added every 4 years immediately after Year Day. Also outside the weekly cycle.": "4년마다 해의 날 직후에 추가되는 윤일입니다. 주간 주기에도 속하지 않습니다.",
    },
};

function applyCuratedTranslations(catalogs) {
    [curatedTranslations, curatedLeapDayTranslations].forEach((translationsByLocale) => {
        Object.entries(translationsByLocale).forEach(([locale, translations]) => {
            catalogs[locale] = {
                ...(catalogs[locale] || {}),
                ...translations,
            };
        });
    });

    return catalogs;
}

/* ===========================================================
   CARREGAMENTO DO TYPESCRIPT SEM FIXAR A PASTA NODE_MODULES
=========================================================== */

async function loadTypeScript() {
    const candidates = [
        resolve(projectDirectory, "node_modules/typescript/lib/typescript.js"),
        process.env.REFERENCE_NODE_MODULES
            ? resolve(process.env.REFERENCE_NODE_MODULES, "typescript/lib/typescript.js")
            : null,
    ].filter(Boolean);

    for (const candidate of candidates) {
        try {
            return (await import(pathToFileURL(candidate).href)).default;
        } catch {
            // Tenta o próximo local conhecido.
        }
    }

    throw new Error("TypeScript não encontrado. Execute npm install nesta página antes de gerar as traduções.");
}

/* ===========================================================
   EXTRAÇÃO DOS TEXTOS VISÍVEIS DO CÓDIGO ORIGINAL
=========================================================== */

function normalizeMessage(value) {
    return String(value).replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function collectMessagesFromSource(ts, sourceFile) {
    const messages = new Set();

    const add = (value) => {
        const normalized = normalizeMessage(value);

        if (normalized && /[A-Za-z]/.test(normalized)) {
            messages.add(normalized);
        }
    };

    const visit = (node) => {
        if (ts.isJsxText(node)) {
            add(node.getText(sourceFile));
        }

        if (
            ts.isJsxAttribute(node) &&
            node.initializer &&
            ts.isStringLiteral(node.initializer) &&
            ["aria-label", "placeholder", "title"].includes(node.name.getText(sourceFile))
        ) {
            add(node.initializer.text);
        }

        if (
            ts.isPropertyAssignment(node) &&
            ts.isIdentifier(node.name) &&
            ["title", "description", "question", "answer", "label", "name", "subtitle", "message", "heading", "text"].includes(node.name.text) &&
            ts.isStringLiteral(node.initializer)
        ) {
            add(node.initializer.text);
        }

        if (ts.isArrayLiteralExpression(node)) {
            for (const element of node.elements) {
                if (ts.isStringLiteral(element)) {
                    add(element.text);
                }
            }
        }

        if (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === "t" &&
            node.arguments[0] &&
            ts.isStringLiteral(node.arguments[0])
        ) {
            add(node.arguments[0].text);
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return messages;
}

async function collectSourceMessages() {
    const ts = await loadTypeScript();
    const fileNames = (await readdir(componentDirectory))
        .filter((fileName) => fileName.endsWith(".tsx"))
        .map((fileName) => resolve(componentDirectory, fileName));
    const messages = new Set(extraMessages);

    for (const fileName of fileNames) {
        const source = await readFile(fileName, "utf8");
        const sourceFile = ts.createSourceFile(
            fileName,
            source,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TSX,
        );

        for (const message of collectMessagesFromSource(ts, sourceFile)) {
            messages.add(message);
        }
    }

    return [...messages].sort((left, right) => left.localeCompare(right, "en"));
}

/* ===========================================================
   TRADUÇÃO GRATUITA EM BLOCOS COM MARCADORES ESTÁVEIS
=========================================================== */

function wait(milliseconds) {
    return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

async function translateBlock(messages, targetLanguage, blockNumber, attempt = 1) {
    const source = messages
        .map((message, index) => `[[SM${String(index).padStart(4, "0")}]] ${message}`)
        .join("\n");
    const response = await fetch(googleTranslateUrl, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
            client: "gtx",
            sl: "en",
            tl: targetLanguage,
            dt: "t",
            q: source,
        }),
    });

    if (response.status === 429 && attempt < 6) {
        await wait(4_000 * attempt);
        return translateBlock(messages, targetLanguage, blockNumber, attempt + 1);
    }

    if (!response.ok) {
        throw new Error(`Falha HTTP ${response.status} no bloco ${blockNumber}.`);
    }

    const responseData = await response.json();
    const translated = responseData?.[0]?.map((segment) => segment?.[0] || "").join("") || "";
    const entries = [...translated.matchAll(/\[\[SM(\d{4})\]\]\s*([\s\S]*?)(?=\n?\[\[SM\d{4}\]\]|$)/g)];

    if (entries.length !== messages.length) {
        throw new Error(`O tradutor alterou os marcadores do bloco ${blockNumber}.`);
    }

    return entries.map((entry) => entry[2].trim());
}

async function translateBlockWithFallback(messages, targetLanguage, blockNumber) {
    try {
        return await translateBlock(messages, targetLanguage, blockNumber);
    } catch (error) {
        if (messages.length === 1) {
            throw error;
        }

        const middle = Math.ceil(messages.length / 2);
        const left = await translateBlockWithFallback(
            messages.slice(0, middle),
            targetLanguage,
            `${blockNumber}.1`,
        );
        const right = await translateBlockWithFallback(
            messages.slice(middle),
            targetLanguage,
            `${blockNumber}.2`,
        );

        return [...left, ...right];
    }
}

async function translateMessages(messages, targetLanguage) {
    const translated = [];
    const blockSize = 12;

    for (let start = 0; start < messages.length; start += blockSize) {
        const block = messages.slice(start, start + blockSize);
        const blockTranslation = await translateBlockWithFallback(
            block,
            targetLanguage,
            start / blockSize + 1,
        );
        translated.push(...blockTranslation);
        await wait(600);
    }

    return Object.fromEntries(messages.map((message, index) => [message, translated[index]]));
}

/* ===========================================================
   TRADUÇÃO LOCAL COM OLLAMA

   O modelo local evita APIs pagas e devolve uma estrutura JSON
   validada. Em caso de bloco incompleto, a função divide o lote
   automaticamente sem perder as chaves ou os placeholders.
=========================================================== */

function collectPlaceholders(message) {
    return [...String(message).matchAll(/\{\w+\}/g)]
        .map((match) => match[0])
        .sort();
}

function validateTranslation(source, translated, locale, id) {
    if (typeof translated !== "string" || !translated.trim()) {
        throw new Error(`${locale}/${id}: tradução vazia.`);
    }

    const sourcePlaceholders = JSON.stringify(collectPlaceholders(source));
    const translatedPlaceholders = JSON.stringify(collectPlaceholders(translated));

    if (sourcePlaceholders !== translatedPlaceholders) {
        throw new Error(`${locale}/${id}: placeholders alterados.`);
    }

    return translated.trim();
}

async function translateOllamaBlock(messages, locale, blockNumber) {
    const items = messages.map((source, index) => ({
        id: `M${String(index).padStart(4, "0")}`,
        source,
    }));
    const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            model: ollamaModel,
            stream: false,
            think: "low",
            format: {
                type: "object",
                properties: {
                    translations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                text: { type: "string" },
                            },
                            required: ["id", "text"],
                        },
                    },
                },
                required: ["translations"],
            },
            options: {
                temperature: 0.1,
                num_ctx: 8192,
                num_predict: 8192,
            },
            messages: [
                {
                    role: "system",
                    content:
                        `You are a professional software localization translator. ` +
                        `Translate English interface copy into ${languageNames[locale]}. ` +
                        `The product explains the International Fixed Calendar with 13 equal ` +
                        `months. Preserve every {placeholder} exactly, preserve numbers, URLs, ` +
                        `brand names, IFC, Kodak and the month name Sol. Use concise natural ` +
                        `interface language. Return every id exactly once and no commentary.`,
                },
                {
                    role: "user",
                    content: JSON.stringify({ locale, items }),
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama respondeu HTTP ${response.status} no bloco ${blockNumber}.`);
    }

    const responseData = await response.json();
    const parsed = JSON.parse(responseData?.message?.content || "{}");
    const translatedById = new Map(
        (parsed.translations || []).map((entry) => [entry.id, entry.text]),
    );

    if (translatedById.size !== items.length) {
        throw new Error(
            `${locale}/${blockNumber}: esperadas ${items.length} traduções, ` +
                `recebidas ${translatedById.size}.`,
        );
    }

    return items.map(({ id, source }) =>
        validateTranslation(source, translatedById.get(id), locale, id),
    );
}

async function translateOllamaBlockWithFallback(messages, locale, blockNumber) {
    try {
        return await translateOllamaBlock(messages, locale, blockNumber);
    } catch (error) {
        if (messages.length === 1) {
            throw error;
        }

        console.warn(`${locale}/${blockNumber}: dividindo bloco apó ${error.message}`);
        const middle = Math.ceil(messages.length / 2);
        const left = await translateOllamaBlockWithFallback(
            messages.slice(0, middle),
            locale,
            `${blockNumber}.1`,
        );
        const right = await translateOllamaBlockWithFallback(
            messages.slice(middle),
            locale,
            `${blockNumber}.2`,
        );

        return [...left, ...right];
    }
}

async function translateMessagesWithOllama(messages, locale) {
    const translated = [];
    const blocks = [];
    let currentBlock = [];
    let currentCharacterCount = 0;

    /* O limite por caracteres mantém entrada e resposta dentro
       do contexto local mesmo quando o lote contém parágrafos. */
    for (const message of messages) {
        const nextCharacterCount = currentCharacterCount + message.length;

        if (currentBlock.length > 0 && (currentBlock.length >= 100 || nextCharacterCount > 7000)) {
            blocks.push(currentBlock);
            currentBlock = [];
            currentCharacterCount = 0;
        }

        currentBlock.push(message);
        currentCharacterCount += message.length;
    }

    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    for (const [index, block] of blocks.entries()) {
        const blockNumber = index + 1;
        console.log(
            `${locale}: traduzindo bloco ${blockNumber}/${blocks.length} com Ollama...`,
        );
        translated.push(
            ...(await translateOllamaBlockWithFallback(block, locale, blockNumber)),
        );
    }

    return Object.fromEntries(messages.map((message, index) => [message, translated[index]]));
}

/* ===========================================================
   TRADUÇÃO LOCAL AGRUPADA

   Três idiomas compartilham cada leitura dos textos ingleses.
   Isso reduz o tempo total do modelo local sem misturar os
   catálogos nem enfraquecer a validação de placeholders.
=========================================================== */

const ollamaLocaleGroups = [
    ["pt-BR", "de-DE", "fr-FR"],
    ["it-IT", "es-ES", "ru-RU"],
    ["ar-SA", "hi-IN", "zh-CN"],
    ["ja-JP", "ko-KR"],
];

function createGroupedTranslationBlocks(messages) {
    const blocks = [];
    let currentBlock = [];
    let currentCharacterCount = 0;

    messages.forEach((source, sourceIndex) => {
        const nextCharacterCount = currentCharacterCount + source.length;

        if (currentBlock.length > 0 && (currentBlock.length >= 30 || nextCharacterCount > 2500)) {
            blocks.push(currentBlock);
            currentBlock = [];
            currentCharacterCount = 0;
        }

        currentBlock.push({
            id: `M${String(sourceIndex).padStart(4, "0")}`,
            source,
            sourceIndex,
        });
        currentCharacterCount += source.length;
    });

    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    return blocks;
}

function parseOllamaJson(content) {
    return JSON.parse(
        String(content || "")
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, ""),
    );
}

async function translateOllamaLocaleGroupBlock(items, locales, blockNumber) {
    const localeDescription = locales
        .map((locale) => `${locale} (${languageNames[locale]})`)
        .join(", ");
    const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            model: ollamaModel,
            stream: false,
            think: "low",
            format: "json",
            options: {
                temperature: 0.1,
                num_ctx: 4096,
                num_predict: 4096,
            },
            messages: [
                {
                    role: "system",
                    content:
                        `You are a professional software localization translator. ` +
                        `Translate every English interface string into ${localeDescription}. ` +
                        `The product explains the International Fixed Calendar with 13 equal ` +
                        `months. Preserve every {placeholder} exactly, numbers, URLs, IFC, ` +
                        `Kodak and the month name Sol. Use concise natural interface language. ` +
                        `Return only strict JSON: {"items":[{"id":"M0000",` +
                        `"translations":{"locale":"text"}}]}. Return every id and locale ` +
                        `exactly once, with no commentary.`,
                },
                {
                    role: "user",
                    content: JSON.stringify(
                        items.map(({ id, source }) => ({ id, source })),
                    ),
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama respondeu HTTP ${response.status} no bloco ${blockNumber}.`);
    }

    const responseData = await response.json();

    if (responseData.done !== true || !responseData.message?.content) {
        throw new Error(`Ollama não concluiu o bloco ${blockNumber}.`);
    }

    const parsed = parseOllamaJson(responseData.message.content);
    const entriesById = new Map((parsed.items || []).map((entry) => [entry.id, entry]));

    if (entriesById.size !== items.length) {
        throw new Error(
            `Bloco ${blockNumber}: esperados ${items.length} ids, ` +
                `recebidos ${entriesById.size}.`,
        );
    }

    return items.map((item) => {
        const entry = entriesById.get(item.id);
        const translations = Object.fromEntries(
            locales.map((locale) => [
                locale,
                validateTranslation(
                    item.source,
                    entry?.translations?.[locale],
                    locale,
                    item.id,
                ),
            ]),
        );

        return { ...item, translations };
    });
}

async function translateOllamaLocaleGroupBlockWithFallback(items, locales, blockNumber) {
    try {
        return await translateOllamaLocaleGroupBlock(items, locales, blockNumber);
    } catch (error) {
        if (items.length === 1) {
            throw error;
        }

        console.warn(`Grupo ${locales.join(",")}/${blockNumber}: ${error.message}`);
        const middle = Math.ceil(items.length / 2);
        const left = await translateOllamaLocaleGroupBlockWithFallback(
            items.slice(0, middle),
            locales,
            `${blockNumber}.1`,
        );
        const right = await translateOllamaLocaleGroupBlockWithFallback(
            items.slice(middle),
            locales,
            `${blockNumber}.2`,
        );

        return [...left, ...right];
    }
}

async function translateAllMessagesWithOllama(messages, currentCatalogs) {
    const blocks = createGroupedTranslationBlocks(messages);
    const translatedCatalogs = {
        ...currentCatalogs,
        "en-US": Object.fromEntries(messages.map((message) => [message, message])),
    };

    for (const configuredLocales of ollamaLocaleGroups) {
        const locales = configuredLocales.filter(
            (locale) => Object.keys(translatedCatalogs[locale] || {}).length !== messages.length,
        );

        if (locales.length === 0) {
            continue;
        }

        locales.forEach((locale) => {
            translatedCatalogs[locale] = {};
        });

        for (const [index, block] of blocks.entries()) {
            const blockNumber = index + 1;
            console.log(
                `${locales.join(", ")}: bloco ${blockNumber}/${blocks.length}...`,
            );
            const translatedItems = await translateOllamaLocaleGroupBlockWithFallback(
                block,
                locales,
                blockNumber,
            );

            translatedItems.forEach(({ source, translations }) => {
                locales.forEach((locale) => {
                    translatedCatalogs[locale][source] = translations[locale];
                });
            });

            await mkdir(dirname(outputFile), { recursive: true });
            await writeFile(
                outputFile,
                `${JSON.stringify(translatedCatalogs, null, 2)}\n`,
                "utf8",
            );
        }
    }

    return translatedCatalogs;
}

/* ===========================================================
   GERAÇÃO DO CATÁLOGO VERSIONADO
=========================================================== */

const sourceMessages = await collectSourceMessages();
const englishCatalog = Object.fromEntries(sourceMessages.map((message) => [message, message]));
let catalogs = { "en-US": englishCatalog };

if (extractOnly) {
    if (writeSourceMessages) {
        await mkdir(dirname(sourceMessageFile), { recursive: true });
        await writeFile(sourceMessageFile, `${JSON.stringify(sourceMessages, null, 2)}\n`, "utf8");
    }

    if (printMessages) {
        console.log(JSON.stringify(sourceMessages, null, 2));
    }

    console.log(
        `${sourceMessages.length} textos encontrados; ` +
            `${sourceMessages.reduce((total, message) => total + message.length, 0)} caracteres.`,
    );
    process.exit(0);
}

try {
    const existingCatalogs = JSON.parse(await readFile(outputFile, "utf8"));
    const sourceKeys = JSON.stringify(Object.keys(englishCatalog));

    if (JSON.stringify(Object.keys(existingCatalogs["en-US"] || {})) === sourceKeys) {
        catalogs = existingCatalogs;
    }
} catch {
    // Na primeira geração o arquivo ainda não existe.
}

if (useOllama && !useSequentialOllama) {
    catalogs = applyCuratedTranslations(
        await translateAllMessagesWithOllama(sourceMessages, catalogs),
    );
    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, `${JSON.stringify(catalogs, null, 2)}\n`, "utf8");
    console.log(`Catálogo local gerado em ${outputFile}.`);
    process.exit(0);
}

for (const [locale, googleLanguage] of Object.entries(targetLanguages)) {
    if (Object.keys(catalogs[locale] || {}).length === sourceMessages.length) {
        console.log(`${locale}: catálogo existente preservado`);
        continue;
    }

    catalogs[locale] = useSequentialOllama
        ? await translateMessagesWithOllama(sourceMessages, locale)
        : await translateMessages(sourceMessages, googleLanguage);
    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, `${JSON.stringify(catalogs, null, 2)}\n`, "utf8");
    console.log(`${locale}: ${sourceMessages.length} textos`);
    await wait(1_000);
}

catalogs = applyCuratedTranslations(catalogs);
await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(catalogs, null, 2)}\n`, "utf8");
console.log(`Catálogo gerado em ${outputFile}.`);
