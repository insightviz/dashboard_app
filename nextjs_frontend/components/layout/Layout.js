import NavbarController from "../navbar/NavbarController";
import Footer from "../footer/Footer";
import { useAppThemeContext } from '../../context/AppTheme';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';

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
          colorScheme: {theme},
        }}
      >
        <div className="app-wrapper">
          <NavbarController/>
          <main className="page-main">
            { children }
          </main>
          <Footer/>
        </div>
      </MantineProvider>
    </>
  );
};