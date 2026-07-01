import { Box, Typography } from "@mui/material";
import IconSC from "../../assets/iconSC.png";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import type React from "react";

type MobileNavProps = {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
};

const MobileNav: React.FC<MobileNavProps> = ({
  openSidebar,
  setOpenSidebar,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => navigate("/")}
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
            position: "fixed",
            right: 20,
            scale: 2,
            cursor: "pointer",
            display: "flex"
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
