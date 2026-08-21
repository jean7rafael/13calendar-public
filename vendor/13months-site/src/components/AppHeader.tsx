import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { languages, useI18n } from "../i18n";
import { useTheme } from "./ThemeProvider";

/* ===========================================================
   CABEÇALHO COMPARTILHADO DA PÁGINA INSTITUCIONAL
=========================================================== */

export default function AppHeader() {
    const [menuOpen, setMenuOpen] = createSignal(false);
    const { locale, setLocale, t } = useI18n();
    const { dark, toggleTheme } = useTheme();

    onMount(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("keydown", closeOnEscape);

        onCleanup(() => {
            document.removeEventListener("keydown", closeOnEscape);
        });
    });

    return (
        <>
            <header class="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-100/90 text-slate-900 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:text-white">
                <div class="flex min-h-[58px] items-center gap-2 px-4 sm:px-[18px]">
                    <button
                        type="button"
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-stone-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label={t("Choose language")}
                        aria-expanded={menuOpen()}
                        aria-controls="reference-language-menu"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2} aria-hidden="true">
                            <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div class="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-[9px] bg-linear-to-br from-indigo-600 to-violet-600 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/20 max-[600px]:hidden" aria-hidden="true">
                        13
                    </div>

                    <p class="min-w-0 flex-1 truncate text-[15px] font-semibold sm:text-[17px]">
                        IFC - International Fixed Calendar
                    </p>

                    <button
                        type="button"
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-stone-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label={t(dark() ? "Use light theme" : "Use dark theme")}
                        title={t(dark() ? "Use light theme" : "Use dark theme")}
                        onClick={toggleTheme}
                    >
                        <Show
                            when={dark()}
                            fallback={
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2} aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                                </svg>
                            }
                        >
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2} aria-hidden="true">
                                <circle cx="12" cy="12" r="4" />
                                <path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                            </svg>
                        </Show>
                    </button>
                </div>
            </header>

            <Show when={menuOpen()}>
                <div class="fixed inset-x-0 bottom-0 top-[58px] z-40" aria-hidden={!menuOpen()}>
                    <button
                        type="button"
                        class="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-[1px]"
                        aria-label={t("Close language menu")}
                        onClick={() => setMenuOpen(false)}
                    />

                    <aside
                        id="reference-language-menu"
                        class="absolute inset-y-0 left-0 w-[280px] max-w-[86vw] overflow-y-auto border-r border-stone-200 bg-stone-50 p-2 shadow-2xl dark:border-white/10 dark:bg-slate-950"
                        role="menu"
                        aria-label={t("Languages")}
                    >
                        <p class="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t("Languages")}
                        </p>

                        <For each={languages}>
                            {(language) => (
                                <button
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={locale() === language.locale}
                                    class={`my-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                                        locale() === language.locale
                                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                                            : "text-slate-700 hover:bg-stone-200/70 dark:text-slate-200 dark:hover:bg-white/5"
                                    }`}
                                    onClick={() => {
                                        setLocale(language.locale);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <span class="text-2xl leading-none" aria-hidden="true">{language.flag}</span>
                                    <span class="min-w-0 flex-1">
                                        <span class="block text-sm font-medium">{language.name}</span>
                                        <span class="block truncate text-xs text-slate-400 dark:text-slate-500">{language.region}</span>
                                    </span>
                                    <Show when={locale() === language.locale}>
                                        <span class="text-indigo-500" aria-hidden="true">✓</span>
                                    </Show>
                                </button>
                            )}
                        </For>
                    </aside>
                </div>
            </Show>
        </>
    );
}
