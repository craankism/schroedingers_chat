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
import { Lens } from "@mui/icons-material";
import { usePropStore } from "../../../stores/PropStore";

type MemberSidebarProps = {
  roomId: number;
};

const MemberSidebar: React.FC<MemberSidebarProps> = ({ roomId }) => {
  const { users, onlineList } = useUserStore();
  const { rooms } = useRoomStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState<boolean>(false);
  const { openSidebar } = usePropStore();

  const currentRoom = rooms.find((r) => r.roomId === roomId);
  const userDisplay = currentRoom
    ? users
        .filter((user) => currentRoom.userList.includes(user.userId))
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .sort(
          (a, b) =>
            (onlineList[b.userId] ? 1 : 0) - (onlineList[a.userId] ? 1 : 0),
        )
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
          overflow: "scroll",
        }}
      >
        <ListItem sx={{ height: 64 }}>
          <ListItemText primary={"Members:"} />
          <EditChat roomId={roomId} />
        </ListItem>
        <Divider />
        {userDisplay.map((user, index) => (
          <ListItem key={index}>
            <ListItemText primary={user.displayName} />
            {onlineList[user.userId] ? (
              <Lens sx={{ color: "green", mr: 1.7 }} />
            ) : (
              <Lens sx={{ color: "grey", mr: 1.7 }} />
            )}
          </ListItem>
        ))}
      </Drawer>
      <IconButton
        onClick={() => setOpen(!open)}
        size="small"
        sx={{
          display: { xs: openSidebar ? "none" : "block", md: "none" },
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
