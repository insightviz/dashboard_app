import {Outlet} from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SignUpForm from "../SignUpForm/SignUpForm";

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
      <Navbar />
      <Outlet />
      <SignUpForm onSubmit={onSubmit}/>
    </>
  );
};

export default Layout;