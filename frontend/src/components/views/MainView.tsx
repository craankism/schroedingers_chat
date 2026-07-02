import React, { useState } from "react";
import Sidebar from "../main/sidebar/Sidebar";
import Chat from "../main/chat/Chat";
import FileManagement from "../main/FileManagement";
import Files from "../main/Files";
import UserManagement from "../main/user_management/UserManagement";
import { Box } from "@mui/material";
import Announcement from "../main/Announcement";
import RoomManagement from "../main/RoomManagement";

type MainViewProps = {
  isLoggedIn: boolean;
  handleAuthAction: () => void;
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
};

const MainView: React.FC<MainViewProps> = ({
  isLoggedIn,
  handleAuthAction,
  openSidebar,
  setOpenSidebar,
}) => {
  const [activeView, setActiveView] = useState<string>("Ankündigungen");
  const [select, setSelect] = useState<string>("Ankündigungen");
  const [roomId, setRoomId] = useState<number>(0);

  const Active = {
    Chats: <Chat roomId={roomId} />,
    Userverwaltung: <UserManagement />,
    Dateiverwaltung: <FileManagement />,
    Raumverwaltung: <RoomManagement />,
    Kursmaterialien: <Files />,
    Ankündigungen: <Announcement />,
  };

  return (
    <Box sx={{ display: "flex", maxWidth: "100vw" }}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        select={select}
        setSelect={setSelect}
        setRoomId={setRoomId}
        handleAuthAction={handleAuthAction}
        isLoggedIn={isLoggedIn}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      {Active[activeView as keyof typeof Active]}
    </Box>
  );
};

export default MainView;
