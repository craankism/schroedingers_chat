import { Navigate, Outlet } from "react-router-dom";
import { decodeJwt } from "../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useUserStore } from "../stores/UserStore";

const AdminRoute = (): JSX.Element => {
  const { users } = useUserStore();
  const isAdmin =
    users.find((user) => user.userId === decodeJwt()?.userId)?.isAdmin === true;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
