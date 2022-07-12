import { Link } from "react-router-dom";
import logo from "./insight_logo_white.svg"
import "./Navbar.css"
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from 'react';

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click)

  const closeMobileMenu = () => setClick(false)
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div >
          <Link to="/" className="logo-container">
            <img id="insight" src={logo} alt="Logo"/>
          </Link>
        </div>
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes/> : <FaBars/>}
        </div>
        <div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>Contact</Link>
            </li>
          </ul>
        </div>
      </div> 
    </nav>
  );
}

export default Navbar;