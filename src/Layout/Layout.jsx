import {Outlet} from "react-router-dom";
import NavbarController from "../Navbar/NavbarController";
import SignUpForm from "../SignUpForm/SignUpForm";
import "./Layout.css"

const Layout = () => {

  const onSubmit = (data) => {
    fetch("http://localhost:5000/signup", {
     
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.text())
    .then(string => alert(string))
  }

  return (
    <>
      <NavbarController />
      <Outlet />
      <SignUpForm onSubmit={onSubmit}/>
    </>
  );
};

export default Layout;