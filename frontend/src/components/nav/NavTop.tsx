import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useAuthStore } from "../../stores/AuthStore";

const pages = ["files", "chats"];

function NavTop() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(isAuthenticated);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      id="nav"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <DesktopNav pages={pages} />
          <MobileNav pages={pages} />
          {/* Desktop + Mobile */}
          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit" onClick={handleAuthAction}>
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavTop;
