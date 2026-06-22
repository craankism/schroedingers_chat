import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";

const ProtectedRoute = (): JSX.Element => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
