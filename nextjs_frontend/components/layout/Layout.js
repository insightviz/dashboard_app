import NavbarController from "../navbar/NavbarController";
import Footer from "../footer/Footer";
import { useAppThemeContext } from '../../context/AppTheme';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { emotionCache } from '../../EmotionCache'

export default function Layout({ children }) {
  const { theme } = useAppThemeContext();

  const getDesignTokens = (theme) => ({
    palette: {
      mode: theme,
      ...(theme === 'light'
        ? {
            // palette values for light mode
            divider: 'f9a31a',
            text: {
              primary:'#000',
            },
          }
        : {
            // palette values for dark mode
            divider: 'ed4da',
            background: {
              paper: '#25262b'
            },
            text: {
              primary: '#C1C2C5',
            },
          }),
    },
    shape: {borderRadius: '32px'},
    typography: {
      fontSize: 22.4,
      fontFamily: 'segoe'
    }
  });

  const muiTheme = createTheme(
    getDesignTokens(theme)
  );
  
  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={emotionCache}
        theme={{
          /** Put your mantine theme override here */
          colorScheme: theme,
          fontFamily: 'segoe',
          headings: {
            fontFamily: 'segoe',
          },
          defaultRadius: 'xl',
          respectReducedMotion: true,
          components: {
            Select: {
              defaultProps:{
                size: 'md',
                maxDropdownHeight: 400,
                iconWidth: 50,
              }
            },
            TextInput: {
              defaultProps:{
                iconWidth: 50,
                size: 'md',
              }
            },
            Button: {
              defaultProps:{
                size: 'md',
              }
            },
            Avatar: {
              defaultProps:{
                size: "md"
              }
            }
          }
        }}
      >
        <NotificationsProvider>
          <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
             <div className="app-wrapper">
               <NavbarController/>
               <main className="page-main">
                 { children }
               </main>
               <Footer/>
             </div>
            </LocalizationProvider>
          </ThemeProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
};