import Navbar from "./Navbar";
import { useState } from 'react';
import { ThemeContext } from '../../AppTheme';
import { useContext } from 'react';

const NavbarController = ()  => {
    const { mode, setMode } = useContext(ThemeContext);
    // model
    const [click, setClick] = useState(false);
    
    //controller
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const handleThemeToggle = () => {
        switch (mode) {
            case 'system': 
            setMode('light')
            break;
            case 'light': setMode('dark')
            break;
            case 'dark': setMode('system')
            break;
            default: setMode('system')
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