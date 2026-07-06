import { Navigate, Outlet } from "react-router-dom";
import { decodeJwt } from "../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";

const AdminRoute = (): JSX.Element => {
  const isAdmin = decodeJwt()?.isAdmin === true;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
