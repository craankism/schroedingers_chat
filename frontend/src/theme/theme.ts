import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const terminalPalette = {
    // Hintergrund
    background: {
        default: "#0a0e14",   // Sehr dunkles Blau-Schwarz
        paper: "#0d141e",     // Etwas hellerer Kontrast
    },

    // Text - Hauptfarbe (Grün wie alter Monitor)
    primary: {
        main: "#00ff41",      // Klassisches Matrix-Hellgrün
        light: "#33ff66",     // Helle Variante für Hover
        dark: "#00cc33",      // Dunklere Variante
        contrastText: "#0a0e14",
    },

    secondary: {
        main: "#00cc33",      // Dunkleres Grün für Sekundärelemente
        light: "#33ff66",
        dark: "#009922",
        contrastText: "#0a0e14",
    },

    // Text-Farben
    text: {
        primary: "#00ff41",   // Haupttext in Matrix-Grün
        secondary: "#00aa22", // Untertitel/Metadaten
        disabled: "#006622",  // Deaktivierte Elemente
        hint: "#008833",
    },

    // UI-Akzente
    appBar: {
        background: "#05080d", // Noch dunkler als Hintergrund
        text: "#00ff41",
    },

    // Warnungen/Hervorhebungen (in Terminal oft Gelb/Cyan)
    warning: {
        main: "#ffaa00",      // für Warnungen
        light: "#ffcc33",
        dark: "#cc8800",
    },
    error: {
        main: "#ff3333",      // für kritische Fehler
        light: "#ff6666",
        dark: "#cc0000",
    },
    info: {
        main: "#00ccff",      // für Infos
        light: "#33eeff",
        dark: "#0099cc",
    },
};

// Component Overrides - Scharfe Kanten, Terminal-Look
const componentOverrides = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: '#0a0e14', // Exakte Farbe des Hintergrunds
                color: terminalPalette.text.primary,
                margin: 0,
                padding: 0,
            },
            '#root': { // Sichert auch den root Div in index.html
                backgroundColor: '#0a0e14',
                minHeight: '100vh',
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: terminalPalette.appBar.background,
                borderBottom: "2px solid #00ff41", // Grüner Highlight-Border
                boxShadow: "none",
                fontFamily: '"Courier New", monospace',
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                fontFamily: '"Courier New", monospace', // Terminal-Schriftart
                textTransform: "uppercase",             // Alles Groß wie bei DOS
                fontWeight: 700,
                letterSpacing: "0.05em",                // Extra Abstand
                borderRadius: 0,                        // Keine Rundungen - scharfe Kanten
                border: "1px solid #00ff41",            // Grüner Rahmen
                boxShadow: "0 0 5px rgba(0, 255, 65, 0.3)", // Leichter Glow-Effekt
                transition: "all 0.2s ease",

                "&:hover": {
                    backgroundColor: "#00cc33",
                    borderColor: "#33ff66",
                    boxShadow: "0 0 10px rgba(0, 255, 65, 0.6)", // Stärkerer Glow beim Hover
                    transform: "translateY(-1px)",          // Subtiler Hebe-Effekt
                },

                "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "none",
                },

                "&.Mui-disabled": {
                    border: "1px solid #004422",
                    color: "#004422",
                    backgroundColor: "transparent",
                },
            },
            contained: {
                backgroundColor: "#00aa22",
                color: "#0a0e14",

                "&:hover": {
                    backgroundColor: "#00cc33",
                },
            },
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                color: terminalPalette.text.primary,
                borderRadius: 0,
                padding: "8px",

                "&:hover": {
                    backgroundColor: "rgba(0, 255, 65, 0.15)",

                    // Cursor-Icon simulieren
                    "&::after": {
                        content: '"■"',
                        position: "absolute",
                        opacity: 0.3,
                    },
                },

                "&.Mui-disabled": {
                    color: terminalPalette.text.disabled,
                },
            },
        },
    },
    MuiSvgIcon: {
        styleOverrides: {
            root: {
                fontSize: "1.25rem",
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 0,              // Scharfe Ecken
                border: "1px solid rgba(0, 255, 65, 0.2)",
                backgroundColor: terminalPalette.background.paper,

                "&::before": {
                    content: '"[" attr(class) "]"', // Debug-Label (optional)
                    display: "none", // Aktivieren für Debugging
                },
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                "& input": {
                    fontFamily: '"Courier New", monospace',
                    caretColor: "#00ff41", // Grüner Blinkcursor
                },
            },
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                "& fieldset": {
                    borderColor: "#006622",
                },
                "&:hover fieldset": {
                    borderColor: "#00ff41",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "#00ff41",
                    borderWidth: "2px",
                },
            },
        },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                fontFamily: '"Courier New", monospace',
                "&.Mui-focused": {
                    color: "#00ff41",
                },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: "12px 16px",
                borderTop: "1px solid rgba(0, 255, 65, 0.1)",
                borderBottom: "1px solid rgba(0, 255, 65, 0.1)",
                fontFamily: '"Courier New", monospace',

                "&:last-child": {
                    paddingRight: "16px",
                },
            },
        },
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                backgroundColor: "#05080d",
            },
        },
    },
    MuiTypography: {
        styleOverrides: {
            h1: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textShadow: "0 0 10px rgba(0, 255, 65, 0.3)",
            },
            h2: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 700,
                letterSpacing: "-0.015em",
            },
            h3: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 700,
                letterSpacing: "-0.01em",
            },
            h4: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 600,
            },
            h5: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 600,
            },
            h6: {
                fontFamily: '"Courier New", monospace',
                fontWeight: 600,
                textTransform: "uppercase",
            },
        },
    },
    MuiList: {
        styleOverrides: {
            root: {
                fontFamily: '"Courier New", monospace',
            },
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                fontFamily: '"Courier New", monospace',
                "&:hover": {
                    backgroundColor: "rgba(0, 255, 65, 0.1)",
                    borderLeft: "3px solid #00ff41",
                },
            },
        },
    },
};

// Theme
let terminalTheme = createTheme({
    palette: {
        mode: "dark", // Zwangsläufig dunkel für den Look
        ...terminalPalette,
    },
    typography: {
        fontFamily: '"Courier New", monospace', // Standard-Mono Font
        h1: { fontWeight: 800, letterSpacing: "-0.02em", fontSize: "2.5rem" },
        h2: { fontWeight: 700, letterSpacing: "-0.015em", fontSize: "2rem" },
        h3: { fontWeight: 700, letterSpacing: "-0.01em", fontSize: "1.5rem" },
        h4: { fontWeight: 600, fontSize: "1.25rem" },
        h5: { fontWeight: 600, fontSize: "1.1rem" },
        h6: { fontWeight: 600, textTransform: "uppercase", fontSize: "1rem" },
        button: {
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontFamily: '"Courier New", monospace',
        },
        body1: { fontFamily: '"Courier New", monospace' },
        body2: { fontFamily: '"Courier New", monospace' },
    },
    shape: {
        borderRadius: 0, // Komplette Abwesenheit von Rundungen
    },
    components: componentOverrides,
});

// Responsive Fonts für Mobile anpassen
terminalTheme = responsiveFontSizes(terminalTheme);

export default terminalTheme;