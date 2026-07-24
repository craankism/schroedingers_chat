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
import NewRoomModal from "../modals/NewRoomModal.tsx";
import { useRoomStore } from "../../../stores/RoomStore";
import type { RoomType } from "../../../types/RoomType";
import AddIcon from "@mui/icons-material/Add";
import { usePropStore } from "../../../stores/PropStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useUserStore } from "../../../stores/UserStore";
import { heightMinusTopNav } from "../../../types/constants/constants";
import { useDocumentStore } from "../../../stores/DocumentStore";
import { useFileStore } from "../../../stores/FileStore";
import { useFolderStore } from "../../../stores/FolderStore";
import { useProfilePictureStore } from "../../../stores/ProfilePictureStore";

const adminItems = ["Usermanagement", "Roommanagement"];
const navItems = ["Announcement", "Files", "Editor"];
const itemNames = [...adminItems, ...navItems];

const Sidebar = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { users } = useUserStore();
  const { isAuthenticated, logout, currentUser, checkAuthentication } =
    useAuthStore();
  const { openSidebar, setOpenSidebar, setOpenProfile } =
    usePropStore();
  const { getAllDocuments } = useDocumentStore();
  const { getAllFilesMeta } = useFileStore();
  const { getAllRooms } = useRoomStore();
  const { getAllUsers } = useUserStore();
  const { getAllFolders } = useFolderStore();
  const userId = decodeJwt()?.userId || 0;
  const isAdmin = users.find((user) => user.userId === userId)?.isAdmin;
  const { rooms } = useRoomStore();
  const { getAllProfilePictures, profilePictures } = useProfilePictureStore();
  const currentPicture = profilePictures.find(
    (p) => p.userId === decodeJwt()?.userId,
  );

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
      getAllProfilePictures();
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
            <>
              <List>
                <ListItem sx={{ justifyContent: "center", p: 0 }}>
                  <Typography variant="h6">Admin:</Typography>
                </ListItem>
                <SidebarHelper
                  items={adminItems}
                  itemNames={itemNames}
                  activeView={activeView}
                  setActiveView={setActiveView}
                />
              </List>
              <Divider />
            </>
          )}
          <List>
            <ListItem sx={{ justifyContent: "center", p: 0 }}>
              <Typography variant="h6">General:</Typography>
            </ListItem>
            <SidebarHelper
              items={navItems}
              itemNames={itemNames}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </List>
          <Divider />
          <List>
            <ListItem
              sx={{ justifyContent: "center", p: 0, position: "relative" }}
            >
              <Typography variant="h6">Chats:</Typography>
              <AddIcon
                sx={{ cursor: "pointer", position: "absolute", right: 8 }}
                onClick={() => {
                  openModalFunc();
                }}
              />
            </ListItem>
            <NewRoomModal
              openModal={openModal}
              closeModal={setOpenModal}
              roomEdit={false}
              setActiveView={setActiveView}
            />
            <SidebarHelper
              items={roomItems}
              itemNames={itemNames}
              rooms={userRooms}
              activeView={activeView}
              setActiveView={setActiveView}
            />
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
                  <Avatar sx={{ mr: 2 }} src={currentPicture?.url ?? ""} />
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
