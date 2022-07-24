import {Outlet} from "react-router-dom";
import NavbarController from "./Navbar/NavbarController";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <>
      <NavbarController/>
      <Outlet />
      <Footer/>
    </>
  );
};

export default Layout;