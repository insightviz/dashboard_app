import DashboardController from './Controller/Controller'
import './StopSearch.css'

function StopSearch() {
    return (
        <div className='stop-search-page'>
          <h1>UK stop and search dashboard</h1>
          <DashboardController />
        </div> 
    );
}

export default StopSearch;