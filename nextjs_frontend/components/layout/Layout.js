import { useAppThemeContext } from '../../context/AppTheme';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { emotionCache } from '../../EmotionCache'
import dynamic from 'next/dynamic'

const NavbarController = dynamic(() => import('../navbar/NavbarController'))
const Footer = dynamic(() => import('../footer/Footer'))

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
        emotionCache={emotionCache}
        theme={{
          /** Put your mantine theme override here */
          colorScheme: theme,
          fontFamily: 'var(--noto-font)',
          headings: {
            fontFamily: 'var(--noto-font)',
          },
          respectReducedMotion: true,
          components: {
            Select: {
              defaultProps:{
                size: 'md',
                maxDropdownHeight: 400,
                iconWidth: 50,
                radius: 'xl',
              }
            },
            TextInput: {
              defaultProps:{
                iconWidth: 50,
                size: 'md',
                radius: 'xl',
              }
            },
            Button: {
              defaultProps:{
                size: 'md',
                radius: 'xl',
              }
            },
            Avatar: {
              defaultProps:{
                size: "md",
                radius: 'xl',
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