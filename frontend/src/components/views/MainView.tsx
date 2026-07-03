import { useState } from "react";
import Sidebar from "../main/sidebar/Sidebar";
import Chat from "../main/chat/Chat";
import FileManagement from "../main/FileManagement";
import Files from "../main/Files";
import UserManagement from "../main/user_management/UserManagement";
import { Box } from "@mui/material";
import Announcement from "../main/Announcement";
import RoomManagement from "../main/RoomManagement";
import type { JSX } from "@emotion/react/jsx-runtime";

const MainView = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("Announcement");
  const [select, setSelect] = useState<string>("Announcement");
  const [roomId, setRoomId] = useState<number>(0);

  const Active = {
    Chats: <Chat roomId={roomId} />,
    Usermanagement: <UserManagement />,
    Filemanagement: <FileManagement />,
    Roommanagement: <RoomManagement />,
    Files: <Files />,
    Announcement: <Announcement />,
  };

  return (
    <Box sx={{ display: "flex", maxWidth: "100vw" }}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        select={select}
        setSelect={setSelect}
        setRoomId={setRoomId}
      />
      {Active[activeView as keyof typeof Active]}
    </Box>
  );
};

export default MainView;
