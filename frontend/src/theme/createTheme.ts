import {
  createTheme,
  responsiveFontSizes,
  type Theme,
} from "@mui/material/styles";
import type { ThemeColors } from "./types";

const FONT = '"Courier New", monospace';

export function createAppTheme(colors: ThemeColors): Theme {
  const componentOverrides = {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          minHeight: "100%",
        },
        body: {
          background: colors.bodyBackground ?? colors.background.default,
          color: colors.text.primary,
          margin: 0,
          padding: 0,
          minHeight: "100vh",
        },
        "#root": {
          backgroundColor: "transparent",
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.appBar.background,
          borderBottom: `2px solid ${colors.primary.main}`,
          boxShadow: "none",
          fontFamily: FONT,

          ...(colors.appBarTextGradient && {
            "& .MuiTypography-root, & .MuiButton-root": {
              background: colors.appBarTextGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 1))",
            },
          }),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: "0.05em",
          borderRadius: 0,
          border: `1px solid ${colors.primary.main}`,
          boxShadow: `0 0 5px rgba(${colors.glowRgb}, 0.3)`,
          transition: "all 0.2s ease",

          "&:hover": {
            backgroundColor: colors.secondary.main,
            borderColor: colors.primary.light,
            boxShadow: `0 0 10px rgba(${colors.glowRgb}, 0.6)`,
            transform: "translateY(-1px)",
          },

          "&:active": {
            transform: "translateY(0)",
            boxShadow: "none",
          },

          "&.Mui-disabled": {
            border: `1px solid ${colors.disabledBorder}`,
            color: colors.disabledBorder,
            backgroundColor: "transparent",
          },
        },
        contained: {
          backgroundColor: colors.containedBg,
          color: colors.background.default,

          "&:hover": {
            backgroundColor: colors.secondary.main,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.text.primary,
          borderRadius: 0,
          padding: "8px",

          "&:hover": {
            backgroundColor: `rgba(${colors.glowRgb}, 0.15)`,

            "&::after": {
              content: '"■"',
              position: "absolute",
              opacity: 0.3,
            },
          },

          "&.Mui-disabled": {
            color: colors.text.disabled,
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
          borderRadius: 0,
          border: `1px solid rgba(${colors.glowRgb}, 0.2)`,
          backgroundColor: colors.background.paper,

          "&::before": {
            content: '"[" attr(class) "]"',
            display: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input": {
            fontFamily: FONT,
            caretColor: colors.primary.main,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: colors.inputBorderDefault,
          },
          "&:hover fieldset": {
            borderColor: colors.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.primary.main,
            borderWidth: "2px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          "&.Mui-focused": {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
          borderTop: `1px solid rgba(${colors.glowRgb}, 0.1)`,
          borderBottom: `1px solid rgba(${colors.glowRgb}, 0.1)`,
          fontFamily: FONT,

          "&:last-child": {
            paddingRight: "16px",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.deep,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily: FONT,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          textShadow: `0 0 10px rgba(${colors.glowRgb}, 0.3)`,
        },
        h2: {
          fontFamily: FONT,
          fontWeight: 700,
          letterSpacing: "-0.015em",
        },
        h3: {
          fontFamily: FONT,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        },
        h4: {
          fontFamily: FONT,
          fontWeight: 600,
        },
        h5: {
          fontFamily: FONT,
          fontWeight: 600,
        },
        h6: {
          fontFamily: FONT,
          fontWeight: 600,
          textTransform: "uppercase",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          "&:hover": {
            backgroundColor: `rgba(${colors.glowRgb}, 0.1)`,
            borderLeft: `3px solid ${colors.primary.main}`,
          },
        },
      },
    },
  };

  let theme = createTheme({
    palette: {
      mode: colors.mode,
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      primary: colors.primary,
      secondary: colors.secondary,
      text: colors.text,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      appBar: colors.appBar,
    },
    typography: {
      fontFamily: FONT,
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
        fontFamily: FONT,
      },
      body1: { fontFamily: FONT },
      body2: { fontFamily: FONT },
    },
    shape: {
      borderRadius: 0,
    },
    components: componentOverrides,
  });

  theme = responsiveFontSizes(theme);

  return theme;
}
