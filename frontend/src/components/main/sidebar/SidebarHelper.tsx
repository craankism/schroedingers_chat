import { List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const SidebarHelper: React.FC<{
  items: string[];
  activeView: string;
  setActiveView: (view: string) => void;
  setOpen: (open: boolean) => void;
}> = ({ items, activeView, setActiveView, setOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
  <List>
    {items.map((item) => (
      <ListItem key={item} disablePadding>
        <ListItemButton
          selected={activeView === item}
          onClick={() => {
            setActiveView(item);
            if (isMobile) setOpen(false);
          }}
        >
          <ListItemText primary={item} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
  );
};

export default SidebarHelper;
