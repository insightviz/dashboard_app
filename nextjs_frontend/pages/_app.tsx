import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';
import { getCookie } from 'cookies-next';
import { AppProps, AppContext } from 'next/app';
import Script from 'next/script'

type CustomPageProps = AppProps & { // <--- your custom page props
  savedMode: string,
  savedTheme: string,
}


function MyApp({ Component, pageProps, savedMode, savedTheme }: CustomPageProps) {
  return ( 
    <>
      <Script id="google-tag">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PL5CDQD');;`}
      </Script>
      <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp;

MyApp.getInitialProps = async ({ctx}: AppContext) => ({
  savedMode: getCookie('insightMode', ctx) || 'system',
  savedTheme: getCookie('insightTheme', ctx) || 'light',
});