import Navbar from "./Navbar";
import { useAppThemeContext } from '../../context/AppTheme';

const ReactGA = ( await import('react-ga4')).default

const NavbarController = ()  => {
  const { mode, changeMode } = useAppThemeContext();  
  
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
      <Navbar 
        handleThemeToggle={handleThemeToggle}
      />
  )
}

export default NavbarController;