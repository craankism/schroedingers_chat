import type React from "react";
import { useUserStore } from "../../../stores/UserStore";
import { useEffect, useState } from "react";
import { useRoomStore } from "../../../stores/RoomStore";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { heightMinusTopNav } from "../../../types/constants/constants";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditChat from "./EditChat";

type MemberSidebarProps = {
  roomId: number;
};

const MemberSidebar: React.FC<MemberSidebarProps> = ({ roomId }) => {
  const { getAllUsers } = useUserStore();
  const { getAllRooms, getRoom } = useRoomStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState<boolean>(false);
  const [userDisplay, setUserDisplay] = useState<string[]>([]);
  const displayMembers = async () => {
    const result = await getRoom(roomId);
    const allUsers = await getAllUsers();
    if (result) {
      if (allUsers) {
        const newUsers = allUsers.filter((user) => {
          if (result.userList.find((userId) => userId == user.userId) != null) {
            return true;
          }
          return false;
        });
        setUserDisplay(newUsers.map((user) => user.displayName));
      }
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllRooms();
    // eslint-disable-next-line
    displayMembers();
    // eslint-disable-next-line
  }, [roomId]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        open={isDesktop || open}
        anchor="right"
        sx={{
          width: { xs: "100vw", md: 240 },
          [`& .MuiDrawer-paper`]: {
            width: { xs: "100vw", md: 240 },
            boxSizing: "border-box",
            pt: heightMinusTopNav,
          },
        }}
      >
        <ListItem sx={{ mt: 1 }}>
          <ListItemText primary={"Members:"} />
          <EditChat roomId={roomId} />
        </ListItem>
        <Divider />
        {userDisplay.map((username, index) => (
          <ListItem key={index}>
            <ListItemText primary={username} />
          </ListItem>
        ))}
      </Drawer>
      <IconButton
        onClick={() => setOpen(!open)}
        size="small"
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          right: open ? "calc(100vw - 10vw)" : "0",
          top: "55%",
          transform: "translateY(-50%)",
          zIndex: 1300,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "0 4px 4px 0",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </Box>
  );
};

export default MemberSidebar;
