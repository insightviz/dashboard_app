import {Outlet} from "react-router-dom";
import NavbarController from "./Navbar/NavbarController";
import SignUpController from "./SignUpForm/SignUpController";

import "./Layout.css"

const Layout = () => {
  return (
    <>
      <NavbarController/>
      <Outlet />
      <SignUpController/>
    </>
  );
};

export default Layout;