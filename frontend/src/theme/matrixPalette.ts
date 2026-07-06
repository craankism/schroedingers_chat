import type { ThemeColors } from "./types";

export const matrixPalette: ThemeColors = {
    mode: "dark",

    background: {
        default: "#0a0e14",
        paper: "#0d141e",
        deep: "#05080d",
    },

    primary: {
        main: "#00ff41",
        light: "#33ff66",
        dark: "#00cc33",
        contrastText: "#0a0e14",
    },

    secondary: {
        main: "#00cc33",
        light: "#33ff66",
        dark: "#009922",
        contrastText: "#0a0e14",
    },

    text: {
        primary: "#00ff41",
        secondary: "#00aa22",
        disabled: "#006622",
        hint: "#008833",
    },

    appBar: {
        background: "#05080d",
        text: "#00ff41",
    },

    warning: {
        main: "#ffaa00",
        light: "#ffcc33",
        dark: "#cc8800",
    },

    error: {
        main: "#ff3333",
        light: "#ff6666",
        dark: "#cc0000",
    },

    info: {
        main: "#00ccff",
        light: "#33eeff",
        dark: "#0099cc",
    },

    glowRgb: "0, 255, 65",
    disabledBorder: "#004422",
    containedBg: "#00aa22",
    inputBorderDefault: "#006622",
};