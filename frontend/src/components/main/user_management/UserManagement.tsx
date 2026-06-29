import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Toolbar, Typography } from "@mui/material";
import UserTable from "./UserTable";
import InviteModal from "./InviteModal";

const UserManagement = (): JSX.Element => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Typography variant="h5">Userverwaltung</Typography>
      <InviteModal />
      <UserTable />
    </Box>
  );
};

export default UserManagement;
