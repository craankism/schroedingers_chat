import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
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
import { usePropStore } from "../../../stores/PropStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import NewDocumentModal from "./NewDocumentModal";
import { useUserStore } from "../../../stores/UserStore";
import { heightMinusTopNav } from "../../../types/constants/constants";
import { useDocumentStore } from "../../../stores/DocumentStore";
import { useFileStore } from "../../../stores/FileStore";
import { useFolderStore } from "../../../stores/FolderStore";

const adminItems = ["Usermanagement", "Roommanagement"];
const navItems = ["Announcement", "Files", "Editor"];
const itemNames = [...adminItems, ...navItems];

const Sidebar = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("");
  const [select, setSelect] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { users } = useUserStore();
  const { isAuthenticated, logout, currentUser, checkAuthentication } =
    useAuthStore();
  const { openSidebar, setOpenSidebar, setOpenProfile, newDocModalOpen } =
    usePropStore();
  const { getAllDocuments } = useDocumentStore();
  const { getAllFilesMeta } = useFileStore();
  const { getAllRooms } = useRoomStore();
  const { getAllUsers } = useUserStore();
  const { getAllFolders } = useFolderStore();
  const userId = decodeJwt()?.userId || 0;
  const isAdmin = users.find((user) => user.userId === userId)?.isAdmin;
  const { rooms } = useRoomStore();

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
    const check = async () => {
      const authenticated = await checkAuthentication();
      if (!authenticated) return;
      getAllFolders();
      getAllDocuments();
      getAllFilesMeta();
      getAllRooms();
      getAllUsers();
    };
    check();
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
            pt: heightMinusTopNav,
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          {isAdmin && (
            <List>
              <SidebarHelper
                items={adminItems}
                itemNames={itemNames}
                activeView={activeView}
                setActiveView={setActiveView}
                select={select}
                setSelect={setSelect}
              />
              <Divider />
            </List>
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
            {newDocModalOpen ? <NewDocumentModal /> : null}
          </List>
          {!md ? (
            <List>
              <ListItem
                disablePadding
                sx={{
                  width: "100vw",
                  borderTop: "1px solid",
                  borderColor: "divider",
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
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    logout();
                  }}
                  sx={{ justifyContent: "center" }}
                >
                  <Typography>
                    {isAuthenticated ? "Logout" : "Login"}
                  </Typography>
                </ListItemButton>
              </ListItem>
            </List>
          ) : null}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
