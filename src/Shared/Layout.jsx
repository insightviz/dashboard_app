import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import SignUpForm from "./SignUpForm/SignUpForm";

const Layout = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

  }

  return (
    <>
      <Navbar />
      <Outlet />
      <SignUpForm onSubmit={handleSubmit}/>
    </>
  );
};

export default Layout;