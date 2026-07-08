import type React from "react";
import { useUserStore } from "../../../stores/UserStore";
import { useState } from "react";
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
  const { users } = useUserStore();
  const { rooms } = useRoomStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState<boolean>(false);

  const currentRoom = rooms.find((r) => r.roomId === roomId);
  const userDisplay = currentRoom
    ? users
        .filter((user) => currentRoom.userList.includes(user.userId))
        .map((user) => user.displayName)
    : [];

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
