import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import SignUpForm from "./SignUpForm/SignUpForm";

const Layout = () => {

  const onSubmit = (e) => {
    e.preventDefault();

  }

  return (
    <>
      <Navbar />
      <Outlet />
      <SignUpForm onSubmit={onSubmit}/>
    </>
  );
};

export default Layout;