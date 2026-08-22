import { useI18n, type AppLocale } from "../i18n";

/* ===========================================================
   RETORNO LOCALIZADO À PÁGINA DOS CALENDÁRIOS
=========================================================== */

const buttonLabels: Record<AppLocale, string> = {
    "pt-BR": "Voltar para a página dos calendários",
    "en-US": "Back to the calendars page",
    "fr-FR": "Retour à la page des calendriers",
    "es-ES": "Volver a la página de los calendarios",
    "de-DE": "Zurück zur Kalenderseite",
    "ru-RU": "Вернуться на страницу календарей",
    "it-IT": "Torna alla pagina dei calendari",
    "zh-CN": "返回日历页面",
    "ja-JP": "カレンダーページに戻る",
    "ar-SA": "العودة إلى صفحة التقاويم",
    "hi-IN": "कैलेंडर पेज पर वापस जाएँ",
    "ko-KR": "달력 페이지로 돌아가기",
};

export default function CalendarToolbarLink() {
    const { locale } = useI18n();
    const label = () => buttonLabels[locale()];

    return (
        <a
            href={new URL("../#/", window.location.href).href}
            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-stone-200 hover:text-slate-900 focus-visible:bg-stone-200 focus-visible:text-slate-900 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:bg-white/10 dark:focus-visible:text-white"
            aria-label={label()}
            title={label()}
        >
            {/* Ícone Material "today", o mesmo renderizado pelo Quasar. */}
            <svg
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V9h14v11ZM7 11h5v5H7Z" />
            </svg>
        </a>
    );
}
