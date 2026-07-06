export interface ThemeColors {
    mode: "light" | "dark";

    background: {
        default: string;
        paper: string;
        deep: string; // Header, Table Head, dunkler als default
    };

    primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };

    secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };

    text: {
        primary: string;
        secondary: string;
        disabled: string;
        hint: string;
    };

    appBar: {
        background: string;
        text: string;
    };

    warning: {
        main: string;
        light: string;
        dark: string;
    };

    error: {
        main: string;
        light: string;
        dark: string;
    };

    info: {
        main: string;
        light: string;
        dark: string;
    };

    // Semantic Werte fuer Component Overrides
    glowRgb: string;           // z.B. "0, 255, 65" fuer rgba() Glow-Effekte
    disabledBorder: string;    // Border/Farbe fuer deaktivierte Elemente
    containedBg: string;       // Hintergrund fuer contained Buttons
    inputBorderDefault: string;// Default Border fuer OutlinedInput

    bodyBackground?: string;   // Optional: Gradient oder Custom fuer Body (z.B. Fluffy Unicorn)
    appBarTextGradient?: string;  // Optional: Gradient fuer AppBar-Text (rainbow!)
}