import { useState, useEffect } from "react";
import StopSearchDashboard from "./StopSearchDashboard";
import { allForceOptions } from '../../assets/Constants';
import { setCookie } from  'cookies-next';
//import ReactGA from "react-ga4";
import  { error, forceSelectOption, Data, enhancedData } from './SharedTypes';
import React from "react";
import StopSearchModal from "./EnhancedDataModal";
import RaceModal from "./RaceDataModal"
import GenderModal from "./GenderDataModal"

const constructURL = (baseUrl: string, parameters: Record<string, string>) => {
  const params = new URLSearchParams();

  for (const key of Object.keys(parameters)) {
    params.set(`${key}`, `${parameters[key]}`);
  }

  const fullUrl = `${baseUrl}?${params.toString()}`;
  return fullUrl
};

interface ServerProps {
  savedForce: string 
}

async function fetchData(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}, Message: ${response.statusText}`);
  } 
  return response.json(); 
}

const StopSearchDashboardController = ({savedForce}: ServerProps) => { 
  const [force, setForce] = useState(savedForce);
  const [month, setMonth] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  
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
    let url = ''

    if (month === '') {
      url = constructURL('/stopsearch/data', {force: force})
    } else {
      url = constructURL('/stopsearch/data', {force: force, month: month})
    }
    
    fetchData(url)
    .then((data) => {
      setData(data)
      setDataLoading(false)
    })
    .catch((error) => {
      setError({'error': true, 'message': error.message})
    });
  }

  useEffect(loadData, [force, month])


  const fetchForces = () => {
    setForceLoading(true)
    fetchData('/stopsearch/forces')
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
    .catch((error) => {
      setError({'error': true, 'message': error.message});
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
  
  const handleRaceChange = (e: string) => {
    setRaceModalOpen(true)
    if (e!=race) {
      setRace(e);
      //ReactGA.event({
      //  category: "force change",
      //  action: "change force select",
      //  label: e,
      //});
    }
  }
  
  const handleGenderChange = (e: string) => {
    setGenderModalOpen(true)
    if (e!=gender) {
      setGender(e);
      //ReactGA.event({
      //  category: "force change",
      //  action: "change force select",
      //  label: e,
      //});
    }
  }

  const fetchMonths = () => {
    setMonthsLoading(true)
    fetchData(constructURL('/stopsearch/months', {force: force}))
    .then(data => data.map((date: Date) => new Date(date)))
    .then(data => {
      setStartDate(new Date(data.slice(-1)[0]))
      setAvailableMonths(data)
      setMonthsLoading(false)
    })
    .catch((error) => {
      setError({'error': true, 'message': error.message});
    })
  }
  
  useEffect(fetchMonths, [force])

  return (
    <>
      <StopSearchModal
        totalModalOpened={totalModalOpened}
        setTotalModalOpened={setTotalModalOpened}
        />
      <RaceModal
        raceModalOpen={raceModalOpen}
        setRaceModalOpen={setRaceModalOpen}
        race={race}
      />
      <GenderModal
        genderModalOpen={genderModalOpen}
        setGenderModalOpen={setGenderModalOpen}
        gender={gender}
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
        setTotalModalOpened={setTotalModalOpened}
        handleRaceChange={handleRaceChange}
        handleGenderChange={handleGenderChange}
      />
    </>
  )
}

export default StopSearchDashboardController;