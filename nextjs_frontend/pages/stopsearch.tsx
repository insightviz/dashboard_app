import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import { getCookie } from 'cookies-next';
import { InferGetServerSidePropsType } from 'next'
import React from 'react';
import { AppContext, AppProps } from 'next/app';

interface StopSearchPageProps { // <--- your custom page props
    savedForce: string,
}
export default function StopSearch({savedForce}: StopSearchPageProps) {
    return (
        <StopSearchDashboardController savedForce={savedForce}/> 
    );
}

export async function getServerSideProps(context){
    return {
      props: {
          savedForce: String(getCookie('insightStopSearchForce', context) || 'metropolitan'),
      },
    }
  }