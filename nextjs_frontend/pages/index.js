import Link from 'next/link';
import styles from '../styles/home.module.css'

export default function Home() {  
  return (
    <div className={styles.home}>
      <div className={styles.title}>
        <h1 className={styles.h1}>
          <span className={styles.one}>INSIGHT</span>
          <span className={styles.two}>IN A DATA</span>
          <span className={styles.three}>FILLED WORLD</span>
        </h1>
      </div>
      <div className={styles.dashboards}>
        <h2>Lastest Dashboards</h2>
        <div className={styles.dashboard_content}>
          <Link href="/stopsearch">
            <div className={styles.stop_search} >
              <div className={styles.text_card}>
                <h3>Stop and search</h3>
                <p>{"Insights from stop and search data released by 'police.uk'."}</p>
                <Link href="/stopsearch">Discover insights here</Link>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};