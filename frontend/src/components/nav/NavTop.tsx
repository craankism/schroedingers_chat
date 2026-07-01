import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

type NavTopProps = {
  isLoggedIn: boolean;
  handleAuthAction: () => void;
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
};

const NavTop: React.FC<NavTopProps> = ({
  isLoggedIn,
  handleAuthAction,
  openSidebar,
  setOpenSidebar,
}) => {
  return (
    <AppBar
      position="fixed"
      id="nav"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <DesktopNav
            isLoggedIn={isLoggedIn}
            handleAuthAction={handleAuthAction}
          />
          <MobileNav
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavTop;
