import type { JSX } from "@emotion/react/jsx-runtime";
import NavTop from "./nav/NavTop";
import { Route, Routes } from "react-router-dom";
import LoginView from "./views/LoginView";
import EnterCodeView from "./views/EnterCodeView";
import RegisterView from "./views/RegisterView";

const App = (): JSX.Element => {
  return (
    <>
      <NavTop />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<EnterCodeView />} />
        <Route path="/register/:inviteKey" element={<RegisterView />} />
      </Routes>
    </>
  );
};

export default App;
