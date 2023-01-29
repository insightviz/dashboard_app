import '../styles/globals.css'
import { AppProps } from 'next/app';
import Script from 'next/script'
import { SWRConfig } from 'swr';
import { fetcher } from '../assets/UtilFunctions';
import { Noto_Sans } from '@next/font/google'
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';

const notoSans = Noto_Sans({
  style: ['normal'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],  
  display: 'swap',
  subsets: ['latin'],
  variable: '--noto-font',
})


function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <ThemeProvider>
      <Layout>
        <SWRConfig
          value={{
            fetcher: fetcher
          }}
        >
          <main className={notoSans.className}>
            <Script id="google-tag">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PL5CDQD');;`}
            </Script>
            <Component {...pageProps}/>
          </main>
        </SWRConfig>
      </Layout>
    </ThemeProvider>    
  )
}

export default MyApp;