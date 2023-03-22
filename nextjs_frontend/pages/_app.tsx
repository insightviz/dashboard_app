import '../styles/globals.css'
import { AppProps } from 'next/app';
import Script from 'next/script'
import { SWRConfig } from 'swr';
import { fetcher } from '../assets/UtilFunctions';
import { Rubik } from '@next/font/google'
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';

const rubik = Rubik({
  style: ['normal'],
  weight: ['400', '600', '700', '900'],  
  display: 'swap',
  subsets: ['latin'],
  variable: '--rubik-font',
})


function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <ThemeProvider>
      <main className={rubik.className}>
        <Layout>
          <SWRConfig
            value={{
              fetcher: fetcher
            }}
          >
              <Script id="google-tag">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-PL5CDQD');;`}
              </Script>
              <Component {...pageProps}/>
          </SWRConfig>
        </Layout>
     </main>
    </ThemeProvider>    
  )
}

export default MyApp;