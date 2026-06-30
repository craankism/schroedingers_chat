import { Box, Divider, Drawer, IconButton, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SidebarHelper from "./SidebarHelper";
import { decodeJwt } from "../../../stores/AuthStore";
import NewRoomModal from "./NewRoomModal";
import { useRoomStore } from "../../../stores/RoomStore";
import type { RoomType } from "../../../types/RoomType";

type SidebarProps = {
  activeView: string;
  setActiveView(view: string): void;
  select: string;
  setSelect(selection: string): void;
  setRoomId(roomId: number): void;
};

const adminItems = ["Userverwaltung", "Dateiverwaltung"];
const navItems = ["Ankündigungen", "Kursmaterialien"];
const itemNames = [...adminItems, ...navItems];

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  select,
  setSelect,
  setRoomId,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const isAdmin = decodeJwt()?.isAdmin;
  const userId = decodeJwt()?.userId || 0;
  const { getAllRooms, rooms } = useRoomStore();

  useEffect(() => {
    getAllRooms();
  }, [getAllRooms]);

  const roomItems: string[] = [];
  const userRooms: RoomType[] = [];

  rooms.map((room) => {
    if (room.userList.includes(userId)) {
      roomItems.push(room.name);
      userRooms.push(room);
    }
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? { xs: "100vw", md: 240 } : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: { xs: "100vw", md: 240 },
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
                itemNames={itemNames}
                setRoomId={setRoomId}
                activeView={activeView}
                setActiveView={setActiveView}
                select={select}
                setSelect={setSelect}
                setOpen={setOpen}
              />
              <Divider />
            </>
          )}
          <SidebarHelper
            items={navItems}
            itemNames={itemNames}
            setRoomId={setRoomId}
            activeView={activeView}
            setActiveView={setActiveView}
            select={select}
            setSelect={setSelect}
            setOpen={setOpen}
          />
          <Divider />
          <NewRoomModal />
          <SidebarHelper
            items={roomItems}
            itemNames={itemNames}
            rooms={userRooms}
            setRoomId={setRoomId}
            activeView={activeView}
            setActiveView={setActiveView}
            select={select}
            setSelect={setSelect}
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
          left: open ? "calc(100vw - 10vw)" : "0",
          top: "45%",
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
