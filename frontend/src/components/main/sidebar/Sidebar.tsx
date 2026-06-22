import { Box, Divider, Drawer, IconButton, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SidebarHelper from "./SidebarHelper";

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
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    // check if admin
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
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
                setOpen={setOpen}
              />
              <Divider />
            </>
          )}
          <SidebarHelper
            items={navItems}
            activeView={activeView}
            setActiveView={setActiveView}
            setOpen={setOpen}
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
            setOpen={setOpen}
          />
        </Box>
      </Drawer>
      <IconButton
        onClick={() => setOpen(!open)}
        size="small"
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: open ? drawerWidth : 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1300,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "0 4px 4px 0",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

export default Sidebar;
