import { Box, Typography } from "@mui/material";
import type React from "react";
import IconSC from "../assets/iconSC.png";
import { useNavigate } from "react-router-dom";
import DrawerList from "./DrawerList";

type MobileNavProps = {
  pages: string[];
};

const MobileNav: React.FC<MobileNavProps> = ({ pages }) => {
  const navigate = useNavigate();

  return (
    <>
      <DrawerList pages={pages} />
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          cursor: "pointer",
          flexGrow: 1,
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
      </Box>
    </>
  );
};

export default MobileNav;
