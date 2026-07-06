import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { useThemeStore, type ThemeName } from "../stores/ThemeStore";
import { createAppTheme } from "../theme/createTheme";
import type { ThemeColors } from "../theme/types";
import { matrixPalette } from "../theme/matrixPalette";
import { professionalDarkPalette } from "../theme/professionalDarkPalette";
import { professionalLightPalette } from "../theme/professionalLightPalette";
import { fluffyUnicornPalette } from "../theme/fluffyUnicornPalette";

const PALETTE_MAP: Record<ThemeName, ThemeColors> = {
    matrix: matrixPalette,
    dark: professionalDarkPalette,
    light: professionalLightPalette,
    unicorn: fluffyUnicornPalette,
};

interface ThemeContextType {
    currentTheme: ThemeName;
    switchTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { currentTheme, setCurrentTheme } = useThemeStore();

    const contextValue = useMemo<ThemeContextType>(
        () => ({
            currentTheme,
            switchTheme: setCurrentTheme,
        }),
        [currentTheme, setCurrentTheme]
    );

    const activeTheme = useMemo(() => {
        const palette = PALETTE_MAP[currentTheme] ?? matrixPalette;
        return createAppTheme(palette);
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MUIThemeProvider theme={activeTheme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};