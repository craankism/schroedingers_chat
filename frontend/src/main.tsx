import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import terminalTheme from "./theme/theme.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={terminalTheme}>
                <App/>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
);
