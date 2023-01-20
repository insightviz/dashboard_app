import Link from 'next/link';
import styles from '../styles/home.module.css'
import Head from 'next/head';
import { Text, Title } from '@mantine/core';

export default function Home() {  
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name='description' content='Homepage'/>
      </Head>
      <div className={styles.home}>
        <div className={styles.title}>
          <h1 className={styles.h1}>
            <Title span size={38} align="center" className={styles.one}>INSIGHT</Title>
            <Title span size={38} align="center" className={styles.two}>IN A DATA</Title>
            <Title span size={38} align="center" className={styles.three}>FILLED WORLD</Title>
            <Text span size={38} align="center" className={styles.one}>INSIGHT</Text>
            <Text span size={38} align="center" className={styles.two}>IN A DATA</Text>
            <Text span size={38} align="center" className={styles.three}>FILLED WORLD</Text>
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