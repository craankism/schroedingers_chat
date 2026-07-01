import type { JSX } from "@emotion/react/jsx-runtime";
import NavTop from "./components/nav/NavTop";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginView from "./components/views/LoginView";
import EnterCodeView from "./components/views/EnterCodeView";
import RegisterView from "./components/views/RegisterView";
import MainView from "./components/views/MainView";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationBanner from "./components/NotificationBanner";
import React, { useState } from "react";
import { useAuthStore } from "./stores/AuthStore";

const App = (): JSX.Element => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(isAuthenticated);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const [openSidebar, setOpenSidebar] = useState<boolean>(true);

  return (
    <>
      <NavTop
        isLoggedIn={isLoggedIn}
        handleAuthAction={handleAuthAction}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      <NotificationBanner />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <MainView
                isLoggedIn={isLoggedIn}
                handleAuthAction={handleAuthAction}
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
              />
            }
          />
        </Route>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<EnterCodeView />} />
        <Route path="/register/:inviteKey" element={<RegisterView />} />
      </Routes>
    </>
  );
};

export default App;
