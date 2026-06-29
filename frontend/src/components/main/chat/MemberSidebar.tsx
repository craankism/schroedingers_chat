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
  console.log(roomId);
  const { getAllUsers, users } = useUserStore();
  const { getAllRooms, rooms } = useRoomStore();

  const [userList, setUserList] = useState<string[]>([]);
  const displayMembers = () => {
    console.log(users);
    console.log(rooms);
    console.log(roomId);
    rooms.map((room) => {
      if (room.roomId === roomId.roomId) {
        room.members.map((memberId) => {
          console.log(room);
          users.map((user) => {
            console.log(user.userId);
            console.log(memberId);
            if (user.userId === memberId) {
              console.log("test");
              setUserList([...userList, user.displayName]);
            }
          });
        });
      }
    });
    return null;
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
      <ListItem>
        <ListItemText primary={"Members:"} />
      </ListItem>
      <ListItem>
        {userList.map((username, index) => (
          <ListItemText key={index} primary={username} />
        ))}
      </ListItem>
    </Drawer>
  );
};

export default MemberSidebar;
