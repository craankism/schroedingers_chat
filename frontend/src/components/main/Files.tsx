import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Toolbar, Typography } from "@mui/material";

const Files = (): JSX.Element => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Typography variant="h5">Kursmaterialien</Typography>
    </Box>
  );
};

export default Files;
