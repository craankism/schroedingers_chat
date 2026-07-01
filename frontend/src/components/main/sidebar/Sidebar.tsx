import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SidebarHelper from "./SidebarHelper";
import { decodeJwt } from "../../../stores/AuthStore";
import NewRoomModal from "./NewRoomModal";
import { useRoomStore } from "../../../stores/RoomStore";
import type { RoomType } from "../../../types/RoomType";
import AddIcon from "@mui/icons-material/Add";
import { useUserStore } from "../../../stores/UserStore";

type SidebarProps = {
  activeView: string;
  setActiveView(view: string): void;
  select: string;
  setSelect(selection: string): void;
  setRoomId(roomId: number): void;
  isLoggedIn: boolean;
  handleAuthAction: () => void;
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
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
  isLoggedIn,
  handleAuthAction,
  openSidebar,
  setOpenSidebar,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isAdmin = decodeJwt()?.isAdmin;
  const userId = decodeJwt()?.userId || 0;
  const { getAllRooms, rooms } = useRoomStore();
  const { getAllUsers } = useUserStore();

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

  const openModalFunc = () => {
    setOpenModal(!openModal);
  };

  const [variant, setVariant] = useState<"permanent" | "temporary">(
    "permanent",
  );
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (md) {
      // eslint-disable-next-line
      setVariant("permanent");
    } else {
      setVariant("temporary");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ display: "flex", maxHeight: "100vh" }}>
      <Drawer
        variant={variant}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        sx={{
          width: openSidebar ? { xs: "100vw", md: 240 } : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: { xs: "100vw", md: 240 },
            height: "100vh",
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
                setOpen={setOpenSidebar}
              />
              <Divider />
            </>
          )}
          <List>
            <SidebarHelper
              items={navItems}
              itemNames={itemNames}
              setRoomId={setRoomId}
              activeView={activeView}
              setActiveView={setActiveView}
              select={select}
              setSelect={setSelect}
              setOpen={setOpenSidebar}
            />
            <Divider />
            <AddIcon
              sx={{ cursor: "pointer", ml: { xs: "90vw", md: 25 }, mt: 1 }}
              onClick={() => {
                openModalFunc();
                getAllUsers();
              }}
            />
            <NewRoomModal
              openModal={openModal}
              closeModal={setOpenModal}
              roomEdit={false}
            />
            <SidebarHelper
              items={roomItems}
              itemNames={itemNames}
              rooms={userRooms}
              setRoomId={setRoomId}
              activeView={activeView}
              setActiveView={setActiveView}
              select={select}
              setSelect={setSelect}
              setOpen={setOpenSidebar}
            />
            {!md ? (
              <div>
                <Divider
                  sx={{
                    position: "fixed",
                    bottom: 48,
                    width: "100vw",
                  }}
                />
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      position: "fixed",
                      bottom: 4,
                      zIndex: 12,
                      width: "100vw",
                      justifyContent: "center",
                    }}
                  >
                    <Typography onClick={handleAuthAction}>
                      {isLoggedIn ? "Logout" : "Login"}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </div>
            ) : null}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
