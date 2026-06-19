import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Toolbar, Typography } from "@mui/material";

const Announcement = (): JSX.Element => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Typography variant="h5">Ankündigungen</Typography>
    </Box>
  );
};

export default Announcement;
