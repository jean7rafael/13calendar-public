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
   ACESSO COMUNITÁRIO NO FLUXO DA PÁGINA
=========================================================== */

export default function CommunityFloatingLink() {
    const { locale } = useI18n();
    const label = () => buttonLabels[locale()];

    return (
        <div class="mx-auto flex w-full max-w-[1180px] justify-end px-4 pt-5 sm:px-6">
            <a
                href={new URL("../#/community", window.location.href).href}
                class="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none dark:text-slate-400 dark:hover:text-indigo-300 dark:focus-visible:text-indigo-300"
                aria-label={label()}
            >
                <span>{label()}</span>
                <svg
                    class="h-[18px] w-[18px] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width={2}
                    aria-hidden="true"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
            </a>
        </div>
    );
}
