import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        appBar: {
            background: string;
            text: string;
        };
    }

    interface PaletteOptions {
        appBar?: {
            background?: string;
            text?: string;
        };
    }
}
