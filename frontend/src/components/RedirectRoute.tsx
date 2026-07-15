import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";

const RedirectRoute = (): JSX.Element => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated === false ? <Outlet /> : <Navigate to="/" replace />;
};

export default RedirectRoute;
