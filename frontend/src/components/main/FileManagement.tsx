import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Toolbar, Typography } from "@mui/material";
import { widthMinusSidebar } from "../../types/constants/constants";

const FileManagement = (): JSX.Element => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, ml: widthMinusSidebar }}>
      <Toolbar />
      <Typography variant="h5">File Management</Typography>
    </Box>
  );
};

export default FileManagement;
