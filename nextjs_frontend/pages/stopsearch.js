import StopSearchDashboardController from '../components/stopSearchDashboard/StopSearchController'
import { getCookie } from 'cookies-next';

export default function StopSearch({savedForce}) {
    return (
        <StopSearchDashboardController savedForce={savedForce}/> 
    );
}


export async function getServerSideProps(context) {
    return {
      props: {
          savedForce: getCookie('insightStopSearchForce', context) || 'metropolitan',
      },
    }
  }