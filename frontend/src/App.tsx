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

const App = (): JSX.Element => {
  const { isAuthenticated } = useAuthStore();
  const { roomId } = usePropStore();

  return (
    <>
      {isAuthenticated ? (
        <>
          <LiveUpdates />
          <Sidebar />
        </>
      ) : null}
      <NavTop />
      <NotificationBanner />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/chat" element={<Chat roomId={roomId} />} />
          <Route path="/files" element={<Files />} />
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
    </>
  );
};

export default App;
