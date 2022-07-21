import {Outlet} from "react-router-dom";
import NavbarController from "./Navbar/NavbarController";
import Footer from "./Footer/Footer";

import "./Layout.css"

const Layout = ({mode, onChange}) => {
  return (
    <>
      <NavbarController/>
      <Outlet />
      <Footer mode={mode} onChange={onChange}/>
    </>
  );
};

export default Layout;