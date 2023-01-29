import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import Head from 'next/head';

export default function StopSearch() {
  return (        
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Stop and Search Dashboard</title>
        <meta name='description' content='Stop and search dashboard showing data for UK police forces'/>
      </Head>
      <StopSearchDashboardController/> 
    </>        
  );
}