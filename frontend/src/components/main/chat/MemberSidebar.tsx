import type React from "react";
import { useUserStore } from "../../../stores/UserStore";
import { useEffect, useState } from "react";
import { useRoomStore } from "../../../stores/RoomStore";
import { Drawer, ListItem, ListItemText } from "@mui/material";
import { heightMinusTopNav } from "../../../types/constants/constants";
import { drawerWidth } from "../sidebar/Sidebar";

type MemberSidebarProps = {
  roomId: number;
};

const MemberSidebar: React.FC<MemberSidebarProps> = (roomId) => {
  const { getAllUsers } = useUserStore();
  const { getAllRooms, getRoom } = useRoomStore();

  const [userDisplay, setUserDisplay] = useState<string[]>([]);
  const displayMembers = async () => {
    const result = await getRoom(roomId.roomId);
    const allUsers = await getAllUsers();
    if (result) {
      if (allUsers) {
        const newUsers = allUsers.filter((user) => {
          if (result.userList.find((userId) => userId == user.userId) != null) {
            return true;
          }
          return false;
        });
        newUsers.forEach((user) => setUserDisplay([...userDisplay, user.displayName]))
      }
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllRooms();
    displayMembers();
  }, []);

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          pt: heightMinusTopNav,
        },
      }}
    >
      <ListItem sx={{ mt: 1 }}>
        <ListItemText primary={"Members:"} />
      </ListItem>
      <ListItem>
        {userDisplay.map((username, index) => (
          <ListItemText key={index} primary={username} />
        ))}
      </ListItem>
    </Drawer>
  );
};

export default MemberSidebar;
