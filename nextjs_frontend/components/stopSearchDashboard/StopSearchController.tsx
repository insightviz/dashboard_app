import { useState, useEffect, useRef } from "react";
import StopSearchDashboard from "./StopSearchDashboard";
import { allForceOptions } from '../../assets/Constants';
import { setCookie } from  'cookies-next';
//import ReactGA from "react-ga4";
import dynamic from 'next/dynamic'
import { getMonthsNames } from '@mantine/dates';
import  { error, forceSelectOption, Data } from './SharedTypes';
import React from "react";
import StopSearchModal from "./EnhancedDataModal";

//const fetchDataFromBackend = (url, parameters) => {

//};

interface ServerProps {
  savedForce: string 
}



const StopSearchDashboardController = ({savedForce}: ServerProps) => { 
  const [force, setForce] = useState(savedForce);
  const [month, setMonth] = useState<string>('');
  
  const [data, setData] = useState<Data | undefined>();
  const [isDataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<error>({'error': false, 'message': null})
  
  const [isForceLoading, setForceLoading] = useState(true);
  const [forceSelectOptions, setForceSelectOptions] = useState<forceSelectOption[]>([]);
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isMonthsLoading, setMonthsLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);
  
  const [totalModalOpened, setTotalModalOpened] = useState<boolean>(false)
  const [raceModalOpen, setRaceModalOpen] = useState<boolean>(false)
  const [genderModalOpen, setGenderModalOpen] = useState<boolean>(false)

  //useEffect(() => {
  //  ReactGA.send("pageview");
  //}, [])
  
  const loadData = () => {
    setDataLoading(true)
    let forceQueryString = force
    let url = ''

    if (month === '') {
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
      setDataLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }

  useEffect(loadData, [force, month])


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
      let forceSelectOptions: forceSelectOption[] = []
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
  
  const handleForceChange = (e: string) => {
    if (e!=force) {
      setMonth('');
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
  
  const handleMonthChange = (date: Date | null) => {
    if (date instanceof Date) {
      setStartDate(date!)
      setMonth(`${date!.getFullYear()}-${date!.getMonth()+1<10?'0'+(date!.getMonth()+1):date!.getMonth()+1}`)
      setError({'error': false, 'message': null});
    }
    //ReactGA.event({
    //  category: "month change",
    //  action: "change month select",
    //  label: `${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`,
    //});
  }


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
    .then(data => data.map((date: Date) => new Date(date)))
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

  return (
    <>
      <StopSearchModal
        totalModalOpened={totalModalOpened}
        setTotalModalOpened={setTotalModalOpened}
      />
      <StopSearchDashboard
        force={force}
        handleForceChange={handleForceChange}
        availableMonths={availableMonths}
        startDate={startDate}
        handleMonthChange={handleMonthChange}
        error={error}
        isDataLoading={isDataLoading}
        isForceLoading={isForceLoading}
        isMonthsLoading={isMonthsLoading}
        data={data}
        forceSelectOptions={forceSelectOptions} 
        totalModalOpened={totalModalOpened}
        setTotalModalOpened={setTotalModalOpened}
        raceModalOpen={raceModalOpen}
        setRaceModalOpen={setRaceModalOpen}
        genderModalOpen={genderModalOpen}
        setGenderModalOpen={setGenderModalOpen}
      />
    </>
  )
}

export default StopSearchDashboardController;