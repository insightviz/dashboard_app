import styles from '../styles/home.module.css'
import Head from 'next/head';
import { getCookie } from 'cookies-next';
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';
import CardHome from '../components/cardHome/CardHome';

interface PageProps{
  savedMode: string,
  savedTheme: string,
}

export default function Home({savedMode, savedTheme}: PageProps) { 
  return (
    <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
      <Layout>          
        <Head>
          <meta charSet="utf-8" />
          <title>Home</title>
          <meta name='description' content='Homepage'/>
        </Head>
        <div className={styles.home}>
          <div className={styles.title}>
            <h1 className={styles.h1}>
              <span className={styles.one}>INSIGHT</span>
              <span className={styles.two}>IN A DATA</span>
              <span className={styles.three}>FILLED WORLD</span>
            </h1>
          </div>
          <div className={styles.dashboards}>
            <h2>Lastest Dashboard</h2>
            <div className={styles.dashboard_content}>
              <CardHome />
            </div>
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      savedMode: getCookie('insightMode', ctx) || 'system',
      savedTheme: getCookie('insightTheme', ctx) || 'light',
    }, // will be passed to the page component as props
  }
}