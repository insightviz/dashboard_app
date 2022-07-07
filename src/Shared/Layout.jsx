import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import SignUpForm from "./SignUpForm/SignUpForm";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <SignUpForm />
    </>
  );
};

export default Layout;