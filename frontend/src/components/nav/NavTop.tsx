import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import type { JSX } from "@emotion/react/jsx-runtime";

const NavTop = (): JSX.Element => {
  return (
    <AppBar
      position="fixed"
      id="nav"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ color: "appBar.text" }}>
          <DesktopNav />
          <MobileNav />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavTop;
