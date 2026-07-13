import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import type {SelectChangeEvent} from "@mui/material";
import type {ThemeName} from "../../stores/ThemeStore.ts";

export const ThemeSwitcher: React.FC = () => {
    const { currentTheme, switchTheme } = useThemeContext();

    const handleChange = (event: SelectChangeEvent<ThemeName>) => {
        switchTheme(event.target.value as ThemeName);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="theme-select-label">Theme</InputLabel>
            <Select
                labelId="theme-select-label"
                value={currentTheme}
                onChange={handleChange}
                label="Theme"
            >
                <MenuItem value="matrix">Matrix</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="unicorn">Unicorn</MenuItem>
            </Select>
        </FormControl>
    );
};