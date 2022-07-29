import {Outlet} from "react-router-dom";
import NavbarController from "./Navbar/NavbarController";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <div className="wrapper">
      <NavbarController/>
      <main className="page-main">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;