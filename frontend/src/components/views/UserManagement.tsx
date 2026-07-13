import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Toolbar, Typography } from "@mui/material";
import UserTable from "../main/user_management/UserTable";
import InviteModal from "../main/user_management/InviteModal";
import { widthMinusSidebar } from "../../types/constants/constants";

const UserManagement = (): JSX.Element => {
  return (
    <Box component="main" sx={{ ml: widthMinusSidebar, flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Typography variant="h5">User Management</Typography>
      <InviteModal />
      <UserTable />
    </Box>
  );
};

export default UserManagement;
