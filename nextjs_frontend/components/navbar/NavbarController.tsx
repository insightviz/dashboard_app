import Navbar from "./Navbar";
import { useState } from 'react';
import { useAppThemeContext } from '../../context/AppTheme';

const ReactGA = ( await import('react-ga4')).default

const NavbarController = ()  => {
  const { mode, changeMode } = useAppThemeContext();
  // model
  const [click, setClick] = useState(false);
  
  //controller
  const handleClick = () => {
      setClick(!click);
      ReactGA.event({
          category: "menu_open",
          action: "menu_open",
          label: String(!click),
        });
  }
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
  const handleThemeSelectChange = (e:string) => {    
    changeMode(String(e))
    ReactGA.event({
      category: "theme_select",
      action: "theme_select",
      label: String(e),
    });    
  }

  return (
      <Navbar click={click} 
        handleClick={handleClick} 
        closeMobileMenu={closeMobileMenu}
        handleThemeToggle={handleThemeToggle}
        handleThemeSelectChange={handleThemeSelectChange}
      />
  )
}

export default NavbarController;