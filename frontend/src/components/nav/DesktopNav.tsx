import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import IconSC from "../../assets/iconSC.png";
import ProfileModal from "../main/user_management/ProfileModal";
import { useAuthStore } from "../../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import { usePropStore } from "../../stores/PropStore";

const DesktopNav = (): JSX.Element => {
  const { isAuthenticated, logout } = useAuthStore();
  const { openProfile, setOpenProfile } = usePropStore();
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
          {isAuthenticated ? (
            <IconButton
              onClick={() => setOpenProfile(!openProfile)}
              sx={{
                p: 0,
                mr: 4,
                "&:hover": {
                  background: "none",
                  "&::after": { content: "none" },
                },
              }}
            >
              <Avatar alt="Profile" src="" />
            </IconButton>
          ) : null}
          <Button color="inherit" onClick={logout}>
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </Box>
      </Box>
      {openProfile ? <ProfileModal /> : null}
    </>
  );
};

export default DesktopNav;
