import { Box, Divider, Drawer, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SidebarHelper from "../Sidebar/SidebarHelper";

const drawerWidth = 240;

type SidebarProps = {
  activeView: string;
  setActiveView(view: string): void;
};

const adminItems = ["Userverwaltung", "Dateiverwaltung"];
const navItems = ["Ankündigungen", "Kursmaterialien"];
const chatItems = ["Chats"];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  useEffect(() => {
    // check if admin
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        {isAdmin && (
          <>
            <SidebarHelper
              items={adminItems}
              activeView={activeView}
              setActiveView={setActiveView}
            />
            <Divider />
          </>
        )}
        <SidebarHelper
          items={navItems}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <Divider />
        <AddIcon
          sx={{ cursor: "pointer", ml: drawerWidth / 10, mt: 1 }}
          onClick={() => {
            /*neuen Chat erstellen*/
          }}
        />
        {/* Code unten ist Placeholder für Chats */}
        <SidebarHelper
          items={chatItems}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
