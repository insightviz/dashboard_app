import styles from '../styles/home.module.css'
import Head from 'next/head';
import CardHome from '../components/cardHome/CardHome';

export default function Home() { 
  return (
    <>          
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
        <div className={styles.dashboard_content}>
          <CardHome />
        </div>
      </div>
    </>
  );
};