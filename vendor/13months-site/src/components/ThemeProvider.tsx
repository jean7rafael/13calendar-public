import { createContext, createSignal, onCleanup, onMount, useContext } from "solid-js";
import type { ParentComponent } from "solid-js";

const THEME_STORAGE_KEY = "calendar-app-theme";

interface ThemeContextValue {
    dark: () => boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

function readInitialTheme(): boolean {
    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme === "dark";
        }
    } catch {
        // O tema continua acompanhando o sistema sem armazenamento local.
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

const ThemeProvider: ParentComponent = (props) => {
    const [dark, setDark] = createSignal(readInitialTheme());

    const setTheme = (nextDark: boolean) => {
        setDark(nextDark);
        applyTheme(nextDark);

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
        } catch {
            // A aparência permanece aplicada durante a sessão atual.
        }
    };

    onMount(() => {
        applyTheme(dark());

        const synchronizeTheme = (event: StorageEvent) => {
            if (event.key === THEME_STORAGE_KEY && event.newValue) {
                const nextDark = event.newValue === "dark";
                setDark(nextDark);
                applyTheme(nextDark);
            }
        };

        window.addEventListener("storage", synchronizeTheme);
        onCleanup(() => window.removeEventListener("storage", synchronizeTheme));
    });

    return (
        <ThemeContext.Provider value={{ dark, toggleTheme: () => setTheme(!dark()) }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme precisa ser usado dentro de ThemeProvider.");
    }

    return context;
}
