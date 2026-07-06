import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type ThemeName = "matrix" | "dark" | "light" | "unicorn";

type ThemeState = {
    currentTheme: ThemeName;
    setCurrentTheme: (theme: ThemeName) => void;
    getThemeName: () => string;
};

const THEME_NAME_MAP: Record<ThemeName, string> = {
    matrix: "Matrix",
    dark: "Professional Dark",
    light: "Professional Light",
    unicorn: "Fluffy Unicorn",
};

export const useThemeStore = create<ThemeState>()(
    devtools(
        persist(
            (set, get) => ({
                currentTheme: "matrix",

                setCurrentTheme: (theme: ThemeName) => {
                    set({ currentTheme: theme });
                },

                getThemeName: () => {
                    return THEME_NAME_MAP[get().currentTheme];
                },
            }),
            {
                name: "schroedingers-chat-theme",
            }
        )
    )
);