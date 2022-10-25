import StopSearchDashboardController from '../components/stopSearchController/StopSearchController'
import { getCookie } from 'cookies-next';

export default function StopSearch({savedForce, savedEthnicity}) {
    return (
        <StopSearchDashboardController savedForce={savedForce} savedEthnicity={savedEthnicity}/> 
    );
}


export async function getServerSideProps(context) {
    return {
      props: {
          savedForce: getCookie('insightStopSearchForce', context) || 'metropolitan',
          savedEthnicity: getCookie('insightStopSearchEthnicity', context) || 'White'
      },
    }
  }