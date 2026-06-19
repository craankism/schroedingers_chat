import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import IconSC from "../../assets/iconSC.png";
import { useNavigate } from "react-router-dom";

type DesktopNavProps = {
  pages: string[];
};

const DesktopNav: React.FC<DesktopNavProps> = ({ pages }) => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          cursor: "pointer",
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
          Schroedinger's Chat
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page) => (
          <Button
            key={page}
            sx={{ my: 2, color: "white", display: "block" }}
            onClick={() => navigate("/" + page)}
          >
            {page}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default DesktopNav;
