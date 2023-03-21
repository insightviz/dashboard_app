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
          colors: {
            primaryBlue: ["#DCEEFB", "#B6E0FE", "#84C5F4", "#62B0E8", "#4098D7", "#2680C2", "#186FAF", "#0F609B", "#0A558C", "#003E6B"],
            supportGrey: ["#F7F7F7", "#E1E1E1", "#CFCFCF", "#B1B1B1", "#9E9E9E", "#7E7E7E", "#626262", "#515151", "#3B3B3B", "#222222"],
            supportCoolGrey: ["#F5F7FA", "#e5e8eb", "#CBD2D9", "#9AA5B1", "#7B8794", "#616E7C", "#52606D", "#3E4C59", "#323F4B", "#1f2933"],
            supportGreen: ["#F0FCF9", "#C6F7E9", "#8EEDD1", "#5FE3C0", "#2DCCA7", "#17B897", "#079A82", "#048271", "#016457", "#004440"],  
            supportRed: ["#FFEEEE", "#FACDCD", "#F29B9B", "#E66A6A", "#D64545", "#BA2525", "#A61B1B", "#911111", "#780A0A", "#610404"],
          },
          primaryColor: 'primaryBlue',
          primaryShade: { light: 9, dark: 6 },
          colorScheme: theme,
          fontFamily: 'var(--rubik-font)',
          headings: {
            fontFamily: 'var(--rubik-font)',
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