import type { ThemeColors } from "./types";

export const fluffyUnicornPalette: ThemeColors = {
    mode: "light",

    background: {
        default: "#fff0f5",
        paper: "#ffe8f0",
        deep: "#ffd6e6",
    },

    primary: {
        main: "#b983ff",
        light: "#d4a3ff",
        dark: "#9c54ff",
        contrastText: "#ffffff",
    },

    secondary: {
        main: "#ffa6c9",
        light: "#ffc4d9",
        dark: "#e080a8",
        contrastText: "#5a2a3a",
    },

    text: {
        primary: "#6a2d5a",
        secondary: "#a85c8a",
        disabled: "#d4a3bf",
        hint: "#c08aa8",
    },

    appBar: {
        background: "#ffb6d5",
        text: "#6a2d5a",
    },

    warning: {
        main: "#ffa630",
        light: "#ffcc66",
        dark: "#cc8420",
    },

    error: {
        main: "#ff6b8a",
        light: "#ff94ab",
        dark: "#cc4868",
    },

    info: {
        main: "#7fcdcd",
        light: "#a8dede",
        dark: "#5ba8a8",
    },

    glowRgb: "185, 131, 255",
    disabledBorder: "#e8c0d4",
    containedBg: "#b983ff",
    inputBorderDefault: "#e8c0d4",

    // Subtiler Regenbogen-Gradient fuer den Body
    bodyBackground:
        "linear-gradient(135deg, #ffb6d5 0%, #d4a3ff 25%, #a8deec 50%, #ffd6a0 75%, #ffc4d9 100%)",

    appBarTextGradient: "linear-gradient(90deg, #ff6b8a, #ffb6d5, #b983ff, #7fcdcd, #ffd6a0, #ff6b8a)",
};