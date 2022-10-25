import NavbarController from "../navbar/NavbarController";
import Footer from "../footer/Footer";
import { useAppThemeContext } from '../../context/AppTheme';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Layout = ({ children }) => {
  const { theme } = useAppThemeContext();
  return (
    <GeistProvider themeType={theme}>
      <CssBaseline/>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="app-wrapper">
          <NavbarController/>
          <main className="page-main">
            { children }
          </main>
          <Footer/>
        </div>
      </LocalizationProvider>
    </GeistProvider>
  );
};

export default Layout;