import Link from 'next/link';
import styles from '../styles/home.module.css'
import Head from 'next/head';

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
        <div className={styles.dashboards}>
          <h2>Lastest Dashboard</h2>
          <div className={styles.dashboard_content}>
            <Link href="/stopsearch" legacyBehavior>
              <div className={styles.stop_search} >
                <div className={styles.text_card}>
                  <h3>UK Stop and searches</h3>
                  <p>{"Insights from stop and search data released by 'POLICE.UK'"}</p>
                  <Link href="/stopsearch">Discover insights here</Link>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};