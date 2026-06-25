import type { JSX } from "@emotion/react/jsx-runtime";
import { useState } from "react";
import Sidebar from "../main/sidebar/Sidebar";
import Chat from "../main/chat/Chat";
import FileManagement from "../main/FileManagement";
import Files from "../main/Files";
import UserManagement from "../main/user_management/UserManagement";
import { Box } from "@mui/material";
import Announcement from "../main/Announcement";

const Active = {
  Chats: <Chat />,
  Userverwaltung: <UserManagement />,
  Dateiverwaltung: <FileManagement />,
  Kursmaterialien: <Files />,
  Ankündigungen: <Announcement />,
};

const MainView = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("Chats");

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      {Active[activeView as keyof typeof Active]}
    </Box>
  );
};

export default MainView;
