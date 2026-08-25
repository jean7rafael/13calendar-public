import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* ===========================================================
   AUDITORIA DAS TRADUÇÕES DA PÁGINA DE REFERÊNCIA

   Confere cobertura completa, preservação dos placeholders e a
   expressão cardinal “mês X de 13 / semana Y de 4”.
=========================================================== */

const [sourceMessages, catalogs, dateConverterSource] = await Promise.all([
  readFile(
    new URL('../vendor/13months-site/src/locales/sourceMessages.json', import.meta.url),
    'utf8',
  ).then(JSON.parse),
  readFile(
    new URL('../vendor/13months-site/src/locales/generatedMessages.json', import.meta.url),
    'utf8',
  ).then(JSON.parse),
  readFile(
    new URL('../vendor/13months-site/src/components/DateConverter.tsx', import.meta.url),
    'utf8',
  ),
]);
const positionSource = 'Month {month} of 13 · Week {week} of 4';
const expectedPositions = {
  'en-US': positionSource,
  'pt-BR': 'Mês {month} de 13 · Semana {week} de 4',
  'de-DE': 'Monat {month} von 13 · Woche {week} von 4',
  'fr-FR': 'Mois {month} sur 13 · Semaine {week} sur 4',
  'it-IT': 'Mese {month} di 13 · Settimana {week} di 4',
  'es-ES': 'Mes {month} de 13 · Semana {week} de 4',
  'ru-RU': 'Месяц {month} из 13 · Неделя {week} из 4',
  'ar-SA': 'الشهر {month} من 13 · الأسبوع {week} من 4',
  'hi-IN': '13 में से महीना {month} · 4 में से सप्ताह {week}',
  'zh-CN': '月份 {month}/13 · 周 {week}/4',
  'ja-JP': '月 {month}/13 · 週 {week}/4',
  'ko-KR': '월 {month}/13 · 주 {week}/4',
};

function readPlaceholders(message) {
  return [...String(message).matchAll(/\{\w+\}/g)].map(([placeholder]) => placeholder).sort();
}

for (const [locale, messages] of Object.entries(catalogs)) {
  assert.deepEqual(
    Object.keys(messages).sort(),
    [...sourceMessages].sort(),
    `${locale} deve cobrir exatamente todos os textos visíveis.`,
  );

  for (const source of sourceMessages) {
    assert.deepEqual(
      readPlaceholders(messages[source]),
      readPlaceholders(source),
      `${locale} alterou os placeholders de “${source}”.`,
    );
  }

  assert.equal(
    messages[positionSource],
    expectedPositions[locale],
    `${locale} deve usar números cardinais para mês e semana.`,
  );
}

assert.equal(Object.keys(catalogs).length, Object.keys(expectedPositions).length);
assert.match(
  dateConverterSource,
  /t\(\s*["']Month \{month\} of 13 · Week \{week\} of 4["']\s*,/,
  'O conversor deve traduzir a posição do mês e da semana como uma única mensagem parametrizada.',
);
assert.doesNotMatch(
  dateConverterSource,
  />\s*Month \{ifc\(\)\.month\} of 13/,
  'O conversor não pode voltar a separar a frase em fragmentos traduzidos isoladamente.',
);
console.log('Traduções auditadas: 12 idiomas completos e posições cardinais preservadas.');
