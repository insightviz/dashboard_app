import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';
import { getCookie } from 'cookies-next';

function MyApp({ Component, pageProps, savedMode, savedTheme }) {
  return ( 
    <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp;

MyApp.getInitialProps = async ({ctx}) => ({
  savedMode: getCookie('insightMode', ctx) || 'system',
  savedTheme: getCookie('insightTheme', ctx) || 'light',
});