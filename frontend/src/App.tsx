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
import { useDocumentStore } from "./stores/DocumentStore.ts";
import { useFileStore } from "./stores/FileStore.ts";
import { useRoomStore } from "./stores/RoomStore.ts";
import { useUserStore } from "./stores/UserStore.ts";
import GlobalLoader from "./components/main/GlobalLoader.tsx";

const App = (): JSX.Element => {
  const { isAuthenticated } = useAuthStore();
  const { roomId } = usePropStore();
  const { getAllDocuments } = useDocumentStore();
  const { getAllFilesMeta } = useFileStore();
  const { getAllRooms } = useRoomStore();
  const { getAllUsers } = useUserStore();

  useEffect(() => {
    if (isAuthenticated === true) {
      getAllDocuments();
      getAllFilesMeta();
      getAllRooms();
      getAllUsers();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
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
          <Route path="/" />
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
    </>
  );
};

export default App;
