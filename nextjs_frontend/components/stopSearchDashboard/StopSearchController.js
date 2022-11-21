import { useState, useEffect, useRef } from "react";
import StopSearchDashboard from "./StopSearchDashboard.js";
import { allForceOptions } from '../../assets/Constants';
import { setCookie } from  'cookies-next';
//import ReactGA from "react-ga4";
import dynamic from 'next/dynamic'
import { getMonthsNames } from '@mantine/dates';

getMonthsNames('en', 'MMMM');

const Chart = dynamic(() => import('../chart/Chart'), {
    ssr: false
})

const fetchDataFromBackend = (url, parameters) => {

};

const StopSearchDashboardController = ({savedForce}) => { 
  const [force, setForce] = useState(savedForce);
  const [month, setMonth] = useState(null);
  
  const [data, setData] = useState(null);
  const [error, setError] = useState({'error': false, 'message': null})
  
  //useEffect(() => {
  //  ReactGA.send("pageview");
  //}, [])
  
  const loadData = () => {
    let forceQueryString = force
    let url = ''

    if (month === null) {
      url = `/stopsearch/data?force=${forceQueryString}`
    } else {
      let monthQueryString = month
      url = `/stopsearch/data?force=${forceQueryString}&month=${monthQueryString}`
    }
    
    fetch(url)
    .then(response => {
      if (!response.ok) {  
        if (response.status === 404) {
          throw new Error(`Status: ${response.status}, Message: Data for ${force.replace("-", " ")} police force ${response.statusText}`); 
        }
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setData(data)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }

  useEffect(loadData, [force, month])

  const [isForceLoading, setForceLoading] = useState(true);
  const [forceSelectOptions, setForceSelectOptions] = useState([]);

  const fetchForces = () => {
    setForceLoading(true)
    fetch('/stopsearch/forces')
    .then(response => {
      if (!response.ok) {  
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`); 
      }
      return response.json();
    })
    .then(data => {
      let forceSelectOptions = []
      allForceOptions.forEach(element => {
        if (data.includes(element.value)) {
          forceSelectOptions.push(element)
        }        
      }); 
      setForceSelectOptions(forceSelectOptions)
      setForceLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }
  
  useEffect(fetchForces, [])
  
  const handleForceChange = (e) => {
    if (e!=force) {
      setMonth(null);
      setForce(e);
      setError({'error': false, 'message': null});
      setCookie('insightStopSearchForce', e);
      //ReactGA.event({
      //  category: "force change",
      //  action: "change force select",
      //  label: e,
      //});
    }
  }
  
  const handleMonthChange = (date) => {
    setStartDate(date)
    setMonth(`${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`)
    setError({'error': false, 'message': null});
    //ReactGA.event({
    //  category: "month change",
    //  action: "change month select",
    //  label: `${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`,
    //});
  }

  const [startDate, setStartDate] = useState();
  const [isMonthsLoading, setMonthsLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);

  const fetchMonths = () => {
    setMonthsLoading(true)
    let forceQueryString = force
    fetch(`/stopsearch/months?force=${forceQueryString}`)
    .then(response => {
      if (!response.ok) {  
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`); 
      }
      return response.json();
    })
    .then(data => data.map((date) => new Date(date)))
    .then(data => {
      setStartDate(new Date(data.slice(-1)[0]))
      setAvailableMonths(data)
      setMonthsLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }
  
  useEffect(fetchMonths, [force])

  const [showChartTickLabels, setChartTickLabels] = useState()
  const chartRef = useRef()

  const getChartWidth = () => {
    if (chartRef.current) {
      const newChartWidth = chartRef.current.clientWidth;
      setChartTickLabels(newChartWidth > 550);
    }
  }

  useEffect(() => {
    getChartWidth();
    window.addEventListener("resize", getChartWidth);
    return () => {
      window.removeEventListener("resize", getChartWidth);
    };
  }, []);

  return (
    <StopSearchDashboard
      force={force}
      handleForceChange={handleForceChange}
      availableMonths={availableMonths}
      startDate={startDate}
      handleMonthChange={handleMonthChange}
      error={error}
      isForceLoading={isForceLoading}
      isMonthsLoading={isMonthsLoading}
      data={data}
      forceSelectOptions={forceSelectOptions} 
    />
  )
}

export default StopSearchDashboardController;