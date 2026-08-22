import { useI18n, type AppLocale } from "../i18n";

/* ===========================================================
   TEXTO LOCALIZADO DO ATALHO COMUNITÁRIO

   A página institucional utiliza o mesmo idioma salvo pelo
   conversor, mas mantém sua compilação independente.
=========================================================== */

const buttonLabels: Record<AppLocale, string> = {
    "pt-BR": "Veja quantos nós somos",
    "en-US": "See how many of us there are",
    "fr-FR": "Découvrez combien nous sommes",
    "es-ES": "Mira cuántos somos",
    "de-DE": "Sieh, wie viele wir sind",
    "ru-RU": "Посмотрите, сколько нас",
    "it-IT": "Scopri quanti siamo",
    "zh-CN": "看看我们有多少人",
    "ja-JP": "仲間が何人いるか見てみよう",
    "ar-SA": "اكتشف كم عددنا",
    "hi-IN": "देखें हम कितने हैं",
    "ko-KR": "우리가 몇 명인지 확인해 보세요",
};

/* ===========================================================
   ACESSO COMUNITÁRIO NA BARRA SUPERIOR
=========================================================== */

export default function CommunityFloatingLink() {
    const { locale } = useI18n();
    const label = () => buttonLabels[locale()];

    return (
        <a
            href={new URL("../#/community", window.location.href).href}
            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-stone-200 hover:text-slate-900 focus-visible:bg-stone-200 focus-visible:text-slate-900 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:bg-white/10 dark:focus-visible:text-white"
            aria-label={label()}
            title={label()}
        >
            <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={1.8}
                aria-hidden="true"
            >
                <circle cx="12" cy="7" r="2.7" />
                <circle cx="5.5" cy="9" r="2" />
                <circle cx="18.5" cy="9" r="2" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 19v-1.4a4.5 4.5 0 0 1 9 0V19M2.5 18v-.8a3.2 3.2 0 0 1 4.2-3M21.5 18v-.8a3.2 3.2 0 0 0-4.2-3" />
            </svg>
        </a>
    );
}
