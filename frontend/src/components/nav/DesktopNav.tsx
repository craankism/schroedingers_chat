import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import IconSC from "../../assets/iconSC.png";

type DesktopNavProps = {
  isLoggedIn: boolean;
  handleAuthAction: () => void;
};

const DesktopNav: React.FC<DesktopNavProps> = ({
  isLoggedIn,
  handleAuthAction,
}) => {
  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            component="img"
            src={IconSC}
            sx={{
              mr: 1,
              mb: 1,
              height: 40,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            Schroedinger's Chat
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Button color="inherit" onClick={handleAuthAction}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DesktopNav;
