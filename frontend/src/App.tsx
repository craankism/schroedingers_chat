import type { JSX } from "@emotion/react/jsx-runtime";
import NavTop from "./components/nav/NavTop";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationBanner from "./components/NotificationBanner";
import LiveUpdates from "./components/main/LiveUpdates";
import { useAuthStore } from "./stores/AuthStore.ts";
import { usePropStore } from "./stores/PropStore.ts";
import Chat from "./components/views/Chat.tsx";
import UserManagement from "./components/views/UserManagement.tsx";
import FileManagement from "./components/views/FileManagement.tsx";
import RoomManagement from "./components/views/RoomManagement.tsx";
import Files from "./components/views/Files.tsx";
import Announcement from "./components/views/Announcement.tsx";
import Sidebar from "./components/main/sidebar/Sidebar.tsx";
import Login from "./components/views/Login.tsx";
import EnterCode from "./components/views/EnterCode.tsx";
import Register from "./components/views/Register.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import { SimpleEditor } from "./components/tiptap/components/tiptap-templates/simple/simple-editor";
import { useEffect } from "react";
import { decodeJwt } from "./stores/AuthStore.ts";
import GlobalLoader from "./components/main/GlobalLoader.tsx";
import { Box } from "@mui/material";

const App = (): JSX.Element => {
  const { isAuthenticated } = useAuthStore();
  const { roomId } = usePropStore();

  // show offline status when browser or tab is closed
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = () => {
      const userId = decodeJwt()?.userId;
      const token = localStorage.getItem("jwt");
      if (!userId || !token) return;
      fetch(`/api/auth/online/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: "false",
        keepalive: true,
      });
    };

    window.addEventListener("pagehide", handleBeforeUnload);
    return () => window.removeEventListener("pagehide", handleBeforeUnload);
  }, [isAuthenticated]);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      {isAuthenticated === true ? (
        <>
          <LiveUpdates />
          <Sidebar />
        </>
      ) : null}
      <NavTop />
      <GlobalLoader />
      <NotificationBanner />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Announcement />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/chat" element={<Chat roomId={roomId} />} />
          <Route path="/files" element={<Files />} />
          <Route path="/editor" element={<SimpleEditor />} />
          <Route element={<AdminRoute />}>
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/filemanagement" element={<FileManagement />} />
            <Route path="/roommanagement" element={<RoomManagement />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<EnterCode />} />
        <Route path="/register/:inviteKey" element={<Register />} />
      </Routes>
    </Box>
  );
};

export default App;
