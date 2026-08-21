import ThemeProvider from "./components/ThemeProvider";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import CalendarView from "./components/CalendarView";
import History from "./components/History";
import Footer from "./components/Footer";
import FeedbackRating from "./components/FeedbackRating";
import DateConverter from "./components/DateConverter";
import AppHeader from "./components/AppHeader";
import { I18nProvider, useI18n } from "./i18n";

export default function App() {
    return (
        <I18nProvider>
            <ThemeProvider>
                <LocalizedApp />
            </ThemeProvider>
        </I18nProvider>
    );
}

function LocalizedApp() {
    const { t } = useI18n();

    return (
        <>
            <a
                href="#main-content"
                class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-indigo-600 focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
            >
                {t("Skip to content")}
            </a>
            <div class="min-h-screen bg-stone-100 dark:bg-slate-950 font-[Inter,system-ui,sans-serif] antialiased transition-colors duration-500">
                <AppHeader />
                <main id="main-content">
                    <Hero />
                    <HowItWorks />
                    <CalendarView />
                    <DateConverter />
                    <History />
                    <FeedbackRating />
                </main>
                <Footer />
            </div>
        </>
    );
}
