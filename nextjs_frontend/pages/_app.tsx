import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';
import { getCookie } from 'cookies-next';
import { AppProps, AppContext } from 'next/app';

type CustomPageProps = AppProps & { // <--- your custom page props
  savedMode: string,
  savedTheme: string,
}


function MyApp({ Component, pageProps, savedMode, savedTheme }: CustomPageProps) {
  return ( 
    <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp;

MyApp.getInitialProps = async ({ctx}: AppContext) => ({
  savedMode: getCookie('insightMode', ctx) || 'system',
  savedTheme: getCookie('insightTheme', ctx) || 'light',
});