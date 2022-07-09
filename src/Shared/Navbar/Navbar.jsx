import { Link } from "react-router-dom";
import logo from "./insight_logo.svg"

function Navbar() {
  return (
    <nav>
      <div className="logo-container">
        <Link to="/">
          <img id="insight" src={logo}/>
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;