import NavbarController from "../navbar/NavbarController";
import Footer from "../footer/Footer";
import { useAppThemeContext } from '../../context/AppTheme';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export default function Layout({ children }) {
  const { theme } = useAppThemeContext();

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: theme,
          fontFamily: 'segoe',
          components: {
            Select: {
              defaultProps:{
                size: 'md',
                radius: 'xl',
                maxDropdownHeight: 400,
                iconWidth: 60,
              }
            },
            TextInput: {
              defaultProps:{
                iconWidth: 50,
                radius: 'xl',
                size: 'md',
              }
            },
            Button: {
              defaultProps:{
                radius: 'xl',
                size: 'md',
              }
            },
            Avatar: {
              defaultProps:{
                radius: 'xl'
              }
            }
          }
        }}
      >
        <NotificationsProvider>
          <div className="app-wrapper">
            <NavbarController/>
            <main className="page-main">
              { children }
            </main>
            <Footer/>
          </div>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
};