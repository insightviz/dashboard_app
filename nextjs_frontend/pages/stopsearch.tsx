import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import { getCookie } from 'cookies-next';
import { InferGetServerSidePropsType } from 'next'
import React from 'react';
import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

interface StopSearchPageProps { // <--- your custom page props
    savedForce: string,
}
export default function StopSearch({savedForce}: StopSearchPageProps) {
    return (
        <>
          <Head>
            <meta charSet="utf-8" />
            <title>Stop and Search Dashboard</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name='description' content='Stop and search dashboard showing data for UK police forces'/>
          </Head>
          <StopSearchDashboardController savedForce={savedForce}/> 
        </>
    );
}

export async function getServerSideProps(context: any){
    return {
      props: {
          savedForce: String(getCookie('insightStopSearchForce', context) || 'metropolitan'),
      },
    }
  }