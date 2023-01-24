import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import { getCookie } from 'cookies-next';
import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';

interface StopSearchPageProps { // <--- your custom page props
    savedForce: string,
    savedMode: string,
    savedTheme: string,
}
export default function StopSearch({savedForce, savedMode, savedTheme}: StopSearchPageProps) {
    return (        
      <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
        <Layout>
          <Head>
            <meta charSet="utf-8" />
            <title>Stop and Search Dashboard</title>
            <meta name='description' content='Stop and search dashboard showing data for UK police forces'/>
          </Head>
          <StopSearchDashboardController savedForce={savedForce}/> 
        </Layout>
      </ThemeProvider>        
    );
}

export async function getServerSideProps(ctx: any){
    return {
      props: {
        savedForce: getCookie('insightStopSearchForce', ctx) || 'metropolitan',
        savedMode: getCookie('insightMode', ctx) || 'system',
        savedTheme: getCookie('insightTheme', ctx) || 'light',
      },
    }
  }