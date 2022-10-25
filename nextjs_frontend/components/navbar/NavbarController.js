import Navbar from "./Navbar";
import { useState } from 'react';
import { useAppThemeContext } from '../../context/AppTheme';

const NavbarController = ()  => {
    const { mode, setMode } = useAppThemeContext();
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