import Navbar from "./Navbar";
import { useState } from 'react';
import { useAppThemeContext } from '../../context/AppTheme';

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
            break;
            case 'light': changeMode('dark')
            break;
            case 'dark': changeMode('system')
            break;
            default: changeMode('system')
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