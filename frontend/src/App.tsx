import type { JSX } from "@emotion/react/jsx-runtime";
import NavTop from "./components/nav/NavTop";
import { Route, Routes } from "react-router-dom";
import LoginView from "./components/views/LoginView";
import EnterCodeView from "./components/views/EnterCodeView";
import RegisterView from "./components/views/RegisterView";
import MainView from "./components/views/MainView";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationBanner from "./components/NotificationBanner";
import LiveUpdates from "./components/main/LiveUpdates";

const App = (): JSX.Element => {
  return (
    <>
      <LiveUpdates />
      <NavTop />
      <NotificationBanner />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainView />} />
        </Route>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<EnterCodeView />} />
        <Route path="/register/:inviteKey" element={<RegisterView />} />
      </Routes>
    </>
  );
};

export default App;
