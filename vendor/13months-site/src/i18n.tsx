import {
    createContext,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
    useContext,
} from "solid-js";
import type { ParentComponent } from "solid-js";
import generatedMessages from "./locales/generatedMessages.json";

/* ===========================================================
   IDIOMAS COMPARTILHADOS COM O CONVERSOR
=========================================================== */

export const APP_LOCALE_STORAGE_KEY = "calendar-app-locale";

export const supportedLocales = [
    "en-US",
    "pt-BR",
    "de-DE",
    "fr-FR",
    "it-IT",
    "es-ES",
    "ru-RU",
    "ar-SA",
    "hi-IN",
    "zh-CN",
    "ja-JP",
    "ko-KR",
] as const;

export type AppLocale = (typeof supportedLocales)[number];

export interface LanguageOption {
    locale: AppLocale;
    flag: string;
    name: string;
    region: string;
}

export const languages: LanguageOption[] = [
    { locale: "en-US", flag: "🇺🇸", name: "English", region: "United States" },
    { locale: "pt-BR", flag: "🇧🇷", name: "Português", region: "Brasil" },
    { locale: "de-DE", flag: "🇩🇪", name: "Deutsch", region: "Deutschland" },
    { locale: "fr-FR", flag: "🇫🇷", name: "Français", region: "France" },
    { locale: "it-IT", flag: "🇮🇹", name: "Italiano", region: "Italia" },
    { locale: "es-ES", flag: "🇪🇸", name: "Español", region: "España" },
    { locale: "ru-RU", flag: "🇷🇺", name: "Русский", region: "Россия" },
    { locale: "ar-SA", flag: "🇸🇦", name: "العربية", region: "المملكة العربية السعودية" },
    { locale: "hi-IN", flag: "🇮🇳", name: "हिन्दी", region: "भारत" },
    { locale: "zh-CN", flag: "🇨🇳", name: "简体中文", region: "中国" },
    { locale: "ja-JP", flag: "🇯🇵", name: "日本語", region: "日本" },
    { locale: "ko-KR", flag: "🇰🇷", name: "한국어", region: "대한민국" },
];

type TranslationParameters = Record<string, string | number>;
type MessageCatalog = Record<AppLocale, Record<string, string>>;

interface I18nContextValue {
    locale: () => AppLocale;
    setLocale: (locale: AppLocale) => void;
    t: (source: string, parameters?: TranslationParameters) => string;
}

const messages = generatedMessages as MessageCatalog;
const I18nContext = createContext<I18nContextValue>();

interface LocalizedTextState {
    source: string;
    rendered: string;
}

const localizedTextNodes = new WeakMap<Text, LocalizedTextState>();
const localizedAttributes = new WeakMap<Element, Map<string, LocalizedTextState>>();
const localizableAttributes = ["aria-label", "placeholder", "title"];

function normalizeLocale(candidate: string | null | undefined): AppLocale {
    if (supportedLocales.includes(candidate as AppLocale)) {
        return candidate as AppLocale;
    }

    const prefix = String(candidate || "").toLowerCase().split("-")[0];
    const localeByPrefix: Record<string, AppLocale> = {
        ar: "ar-SA",
        de: "de-DE",
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        hi: "hi-IN",
        it: "it-IT",
        ja: "ja-JP",
        ko: "ko-KR",
        pt: "pt-BR",
        ru: "ru-RU",
        zh: "zh-CN",
    };

    return localeByPrefix[prefix] || "en-US";
}

function readInitialLocale(): AppLocale {
    try {
        const savedLocale = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);

        if (savedLocale) {
            return normalizeLocale(savedLocale);
        }
    } catch {
        // A página continua funcional mesmo sem armazenamento local.
    }

    return normalizeLocale(window.navigator.language);
}

function interpolate(message: string, parameters: TranslationParameters = {}) {
    return message.replace(/\{(\w+)\}/g, (match, key) =>
        Object.hasOwn(parameters, key) ? String(parameters[key]) : match,
    );
}

function normalizeMessage(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function preserveOuterSpacing(source: string, translated: string) {
    const leadingSpace = source.match(/^\s*/)?.[0] || "";
    const trailingSpace = source.match(/\s*$/)?.[0] || "";
    return `${leadingSpace}${translated}${trailingSpace}`;
}

function resolveStaticTranslation(locale: AppLocale, source: string) {
    return messages[locale]?.[source] || messages["en-US"]?.[source] || source;
}

/* ===========================================================
   PONTE DE TRADUÇÃO DO PROJETO IMPORTADO

   Mantém o código original legível em inglês e traduz os
   textos estáticos catalogados sem duplicar os componentes.
=========================================================== */

function localizeTextNode(node: Text, locale: AppLocale) {
    const currentValue = node.nodeValue || "";
    const currentNormalized = normalizeMessage(currentValue);

    if (!currentNormalized) {
        return;
    }

    let state = localizedTextNodes.get(node);

    if (!state || currentValue !== state.rendered) {
        state = {
            source: currentNormalized,
            rendered: currentValue,
        };
    }

    const translated = resolveStaticTranslation(locale, state.source);
    const rendered = preserveOuterSpacing(currentValue, translated);

    state.rendered = rendered;
    localizedTextNodes.set(node, state);

    if (currentValue !== rendered) {
        node.nodeValue = rendered;
    }
}

function localizeElementAttributes(element: Element, locale: AppLocale) {
    const states = localizedAttributes.get(element) || new Map<string, LocalizedTextState>();

    for (const attributeName of localizableAttributes) {
        const currentValue = element.getAttribute(attributeName);

        if (!currentValue) {
            continue;
        }

        let state = states.get(attributeName);

        if (!state || currentValue !== state.rendered) {
            state = {
                source: normalizeMessage(currentValue),
                rendered: currentValue,
            };
        }

        const rendered = resolveStaticTranslation(locale, state.source);
        state.rendered = rendered;
        states.set(attributeName, state);

        if (currentValue !== rendered) {
            element.setAttribute(attributeName, rendered);
        }
    }

    localizedAttributes.set(element, states);
}

function localizeTree(root: Node, locale: AppLocale) {
    if (root.nodeType === Node.TEXT_NODE) {
        localizeTextNode(root as Text, locale);
        return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
        localizeElementAttributes(root as Element, locale);
    }

    for (const child of root.childNodes) {
        localizeTree(child, locale);
    }
}

/* ===========================================================
   PROVEDOR DE TRADUÇÃO DA PÁGINA DE REFERÊNCIA
=========================================================== */

export const I18nProvider: ParentComponent = (props) => {
    const [locale, setLocaleSignal] = createSignal<AppLocale>(readInitialLocale());

    const setLocale = (nextLocale: AppLocale) => {
        const normalizedLocale = normalizeLocale(nextLocale);
        setLocaleSignal(normalizedLocale);

        try {
            window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, normalizedLocale);
        } catch {
            // A troca ainda vale durante a sessão quando o navegador bloqueia o armazenamento.
        }
    };

    const t = (source: string, parameters: TranslationParameters = {}) => {
        const translatedMessage = messages[locale()]?.[source] || messages["en-US"]?.[source] || source;
        return interpolate(translatedMessage, parameters);
    };

    createEffect(() => {
        const activeLocale = locale();
        document.documentElement.lang = activeLocale;
        document.documentElement.dir = activeLocale === "ar-SA" ? "rtl" : "ltr";

        queueMicrotask(() => {
            const root = document.getElementById("root");

            if (root) {
                localizeTree(root, activeLocale);
            }
        });
    });

    onMount(() => {
        const synchronizeLocale = (event: StorageEvent) => {
            if (event.key === APP_LOCALE_STORAGE_KEY && event.newValue) {
                setLocaleSignal(normalizeLocale(event.newValue));
            }
        };

        const root = document.getElementById("root");
        const observer = root
            ? new MutationObserver((mutations) => {
                  const activeLocale = locale();

                  for (const mutation of mutations) {
                      if (mutation.type === "characterData") {
                          localizeTree(mutation.target, activeLocale);
                      }

                      for (const node of mutation.addedNodes) {
                          localizeTree(node, activeLocale);
                      }
                  }
              })
            : null;

        observer?.observe(root!, {
            childList: true,
            characterData: true,
            subtree: true,
        });

        window.addEventListener("storage", synchronizeLocale);
        onCleanup(() => {
            observer?.disconnect();
            window.removeEventListener("storage", synchronizeLocale);
        });
    });

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {props.children}
        </I18nContext.Provider>
    );
};

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error("useI18n precisa ser usado dentro de I18nProvider.");
    }

    return context;
}
