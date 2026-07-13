import { Box, Typography } from "@mui/material";
import IconSC from "../../assets/iconSC.png";
import { Menu } from "@mui/icons-material";
import type { JSX } from "@emotion/react/jsx-runtime";
import { usePropStore } from "../../stores/PropStore";
import { useAuthStore } from "../../stores/AuthStore";

const MobileNav = (): JSX.Element => {
  const { openSidebar, setOpenSidebar } = usePropStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            mr: 2,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            alignSelf: "center",
          }}
        >
          SC
        </Typography>
        <Box
          sx={{
            display: isAuthenticated ? "flex" : "none",
            position: "fixed",
            right: 20,
            scale: 2,
            cursor: "pointer",
          }}
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <Menu color="primary" />
        </Box>
      </Box>
    </>
  );
};

export default MobileNav;
