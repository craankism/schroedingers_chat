import {
  Avatar,
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
import { useEffect, useState } from "react";
import SidebarHelper from "./SidebarHelper";
import { decodeJwt, useAuthStore } from "../../../stores/AuthStore";
import NewRoomModal from "./NewRoomModal";
import { useRoomStore } from "../../../stores/RoomStore";
import type { RoomType } from "../../../types/RoomType";
import AddIcon from "@mui/icons-material/Add";
import { useUserStore } from "../../../stores/UserStore";
import { usePropStore } from "../../../stores/PropStore";
import type { JSX } from "@emotion/react/jsx-runtime";

const adminItems = ["Usermanagement", "Filemanagement", "Roommanagement"];
const navItems = ["Announcement", "Files"];
const itemNames = [...adminItems, ...navItems];

const Sidebar = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("");
  const [select, setSelect] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isAdmin = decodeJwt()?.isAdmin;
  const userId = decodeJwt()?.userId || 0;
  const { getAllRooms, rooms } = useRoomStore();
  const { getAllUsers } = useUserStore();
  const { isAuthenticated, logout, currentUser } = useAuthStore();
  const { openSidebar, setOpenSidebar, setOpenProfile } = usePropStore();

  useEffect(() => {
    getAllRooms();
  }, [getAllRooms]);

  const roomItems: string[] = [];
  const userRooms: RoomType[] = [];

  rooms.map((room) => {
    if (room.userList.includes(userId)) {
      // So Announcement doesn't show up twice
      if (room.roomId === 1) return;

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
                activeView={activeView}
                setActiveView={setActiveView}
                select={select}
                setSelect={setSelect}
              />
              <Divider />
            </>
          )}
          <List>
            <SidebarHelper
              items={navItems}
              itemNames={itemNames}
              activeView={activeView}
              setActiveView={setActiveView}
              select={select}
              setSelect={setSelect}
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
              activeView={activeView}
              setActiveView={setActiveView}
              select={select}
              setSelect={setSelect}
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
                <ListItem
                  disablePadding
                  sx={{
                    position: "fixed",
                    bottom: 55,
                    zIndex: 12,
                    width: "100vw",
                  }}
                >
                  <ListItemButton
                    onClick={() => setOpenProfile(true)}
                    sx={{ justifyContent: "center" }}
                  >
                    <Avatar sx={{ mr: 2 }} />
                    {currentUser?.displayName}
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  sx={{
                    position: "fixed",
                    bottom: 4,
                    zIndex: 12,
                    width: "100vw",
                  }}
                >
                  <ListItemButton
                    onClick={logout}
                    sx={{ justifyContent: "center" }}
                  >
                    <Typography>
                      {isAuthenticated ? "Logout" : "Login"}
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
