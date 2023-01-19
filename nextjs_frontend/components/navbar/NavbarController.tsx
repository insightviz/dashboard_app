import Navbar from "./Navbar";
import { useState } from 'react';
import { useAppThemeContext } from '../../context/AppTheme';
import ReactGA from "react-ga4";

const NavbarController = ()  => {
    const { mode, changeMode } = useAppThemeContext();
    // model
    const [click, setClick] = useState(false);
    
    //controller
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const handleThemeToggle = () => {
        switch (mode) {
            case 'system': 
              changeMode('light')
              ReactGA.event({
                  category: "theme_select",
                  action: "theme_select",
                  label: String('light'),
                });
            break;
            case 'light': 
              changeMode('dark')
              ReactGA.event({
                  category: "theme_select",
                  action: "theme_select",
                  label: String('dark'),
                });
            break;
            case 'dark': 
              changeMode('system')
              ReactGA.event({
                  category: "theme_select",
                  action: "theme_select",
                  label: String('system'),
                });
            break;
            default: 
              changeMode('system')
              ReactGA.event({
                  category: "theme_select",
                  action: "theme_select",
                  label: String('system'),
                });
            break;
        }
    }

    return (
        <Navbar click={click} 
          handleClick={handleClick} 
          closeMobileMenu={closeMobileMenu}
          handleThemeToggle={handleThemeToggle}
        />
    )
}

export default NavbarController;