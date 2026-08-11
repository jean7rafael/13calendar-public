/* ===========================================================
   FAMÍLIAS DE NOMES REPETIDOS

   Algumas fontes registram uma mesma celebração em vários
   dias e acrescentam a data ao nome. Traduzir cada linha de
   forma isolada pode alternar termos equivalentes, como
   “férias” e “feriado”. As famílias abaixo definem uma base
   terminológica única e deixam o Intl formatar a data.
=========================================================== */

const localeByLanguage = Object.freeze({
  ar: 'ar-SA',
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  hi: 'hi-IN',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-BR',
  ru: 'ru-RU',
  zh: 'zh-CN',
});

const russianNewYearHolidayLabels = Object.freeze({
  ar: 'عطلة رأس السنة',
  de: 'Neujahrsfeiertag',
  en: 'New Year Holiday',
  es: 'Festividad de Año Nuevo',
  fr: 'Jour férié du Nouvel An',
  hi: 'नए साल की छुट्टी',
  it: 'Festività di Capodanno',
  ja: '年末年始休暇',
  ko: '신년 연휴',
  pt: 'Feriado de Ano Novo',
  ru: 'Новогодние каникулы',
  zh: '新年假期',
});

/* ===========================================================
   DEFINIÇÕES REUTILIZÁVEIS

   Uma nova sequência repetitiva deve entrar aqui em vez de
   receber várias correções independentes no cache gerado.
=========================================================== */

export const holidayTranslationFamilies = Object.freeze([
  Object.freeze({
    id: 'russian-new-year-holidays',
    catalogCode: 'RU',
    nameIdPattern: /^newYearHolidayJanuary(?<day>\d{1,2})$/,
    month: 1,
    labels: russianNewYearHolidayLabels,
  }),
]);

/* ===========================================================
   NORMALIZAÇÃO E FORMATAÇÃO DA DATA
=========================================================== */

function normalizeLanguage(language) {
  return String(language || '')
    .trim()
    .replace('_', '-')
    .split('-')[0]
    .toLowerCase();
}

function formatMonthDay(language, month, day) {
  const normalizedLanguage = normalizeLanguage(language);
  const locale = localeByLanguage[normalizedLanguage] || normalizedLanguage || 'en-US';
  const date = new Date(Date.UTC(2000, Number(month) - 1, Number(day)));

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}

/* ===========================================================
   RESOLUÇÃO DE UMA FAMÍLIA

   Retorna null quando o identificador não pertence a uma
   família ou quando o idioma ainda não possui terminologia.
   Assim, um novo idioma não recebe silenciosamente um termo
   diferente: a auditoria exigirá que ele seja cadastrado.
=========================================================== */

export function resolveHolidayTranslationFamily({ catalogCode, nameId, language }) {
  const normalizedCatalogCode = String(catalogCode || '')
    .trim()
    .toUpperCase();
  const normalizedLanguage = normalizeLanguage(language);

  for (const family of holidayTranslationFamilies) {
    if (family.catalogCode !== normalizedCatalogCode) {
      continue;
    }

    const match = String(nameId || '').match(family.nameIdPattern);
    const label = family.labels[normalizedLanguage];

    if (!match || !label) {
      continue;
    }

    const day = Number(match.groups?.day);

    if (!Number.isInteger(day) || day < 1 || day > 31) {
      return null;
    }

    return `${label} — ${formatMonthDay(normalizedLanguage, family.month, day)}`;
  }

  return null;
}
