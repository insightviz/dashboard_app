import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import { getCookie } from 'cookies-next';
import { InferGetServerSidePropsType } from 'next'
import React from 'react';


export default function StopSearch({savedForce}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <StopSearchDashboardController savedForce={savedForce}/> 
    );
}

export async function getServerSideProps(context){
    return {
      props: {
          savedForce: String(getCookie('insightStopSearchForce', context)) || 'metropolitan',
      },
    }
  }