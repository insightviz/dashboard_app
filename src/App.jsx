import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import { lazy, Suspense, useContext } from 'react';
import { ThemeContext } from './AppTheme';
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const Home = lazy(() => import('./Pages/Home/Home'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const StopSearch = lazy(() => import('./Pages/StopSearch/StopSearch'));

export default function App() {
  const { theme } = useContext(ThemeContext);

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            divider: 'f9a31a',
            text: {
              primary:'#000',
            },
          }
        : {
            // palette values for dark mode
            divider: 'f9a31a',
            background: {
              paper: '#1c1c1e'
            },
            text: {
              primary: '#fff',
            },
          }),
    },
    shape: {borderRadius: 5},
    typography: {
      fontSize: 16,
      fontFamily: "Sergoe"
    }
  });
  

  const muiTheme = createTheme(
    getDesignTokens(theme)
  );

  return (
    <GeistProvider themeType={theme}>
      <CssBaseline />
      <ThemeProvider theme={muiTheme}>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={
                <Suspense fallback={<>Loading...</>}>
                  <Home />
                </Suspense>} />
              <Route path="/stopsearch" element={
                <Suspense fallback={<>Loading...</>}>
                  <StopSearch />
                </Suspense>} />
              <Route path="/contact" element={
                <Suspense fallback={<>Loading...</>}>
                  <Contact />
                </Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
      </ThemeProvider>
    </GeistProvider>
  );
  }