import { Link } from "react-router-dom";
import logo from "./insight_logo_white.svg"
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img id="insight" src={logo}/>
        </Link>
      </div>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;