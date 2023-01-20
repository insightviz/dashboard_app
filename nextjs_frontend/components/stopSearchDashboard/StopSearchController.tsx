import React, { useState, useEffect } from "react";
import StopSearchDashboard from "./StopSearchDashboard";
import { allForceOptions } from '../../assets/Constants';
import { setCookie } from  'cookies-next';
import ReactGA from "react-ga4";
import { error, forceSelectOption, Data, enhancedData } from './SharedTypes';
import StopSearchModal from "./EnhancedDataModal";
import RaceModal from "./RaceDataModal"
import GenderModal from "./GenderDataModal"
import { constructURL, fetchData } from "../../assets/UtilFunctions"

interface ServerProps {
  savedForce: string 
}

const StopSearchDashboardController = ({savedForce}: ServerProps) => { 
  const [force, setForce] = useState(savedForce);
  const [month, setMonth] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  
  const [data, setData] = useState<Data | undefined>();
  const [isDataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<error>({'error': false, 'message': null})
  const [modalError, setModalError] = useState<error>({'error': false, 'message': null})
  
  const [enhancedOverallData, setEnhancedOverallData] = useState<enhancedData | undefined>();
  const [enhancedRaceData, setEnhancedRaceData] = useState<enhancedData | undefined>();
  const [enhancedGenderData, setEnhancedGenderData] = useState<enhancedData | undefined>();
  const [isEnhancedDataLoading, setEnhancedDataLoading] = useState(false);
  
  const [isForceLoading, setForceLoading] = useState(true);
  const [forceSelectOptions, setForceSelectOptions] = useState<forceSelectOption[]>([]);
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isMonthsLoading, setMonthsLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);
  
  const [totalModalOpened, setTotalModalOpened] = useState<boolean>(false)
  const [raceModalOpen, setRaceModalOpen] = useState<boolean>(false)
  const [genderModalOpen, setGenderModalOpen] = useState<boolean>(false)
  const [monthSliderValue, setMonthSliderValue] = useState<string>('12')

  
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
      if (typeof data == 'string') {
        setError({'error': true, 'message': data})
      } else {
        setData(data)
      }
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
      setRace('');
      setGender('');
      setMonthSliderValue('12');
      setEnhancedOverallData(undefined);
      setEnhancedRaceData(undefined);
      setEnhancedGenderData(undefined);
      ReactGA.event({
        category: "force_select",
        action: "force_select",
        label: e,
      });
    }
  }
  
  const handleMonthChange = (date: Date | null) => {
    if (date instanceof Date) {
      setStartDate(date!)
      setMonth(`${date!.getFullYear()}-${date!.getMonth()+1<10?'0'+(date!.getMonth()+1):date!.getMonth()+1}`)
      setError({'error': false, 'message': null});
      setRace('');
      setGender('');
      setEnhancedRaceData(undefined);
      setEnhancedGenderData(undefined);
      ReactGA.event({
        category: "month_select",
        action: "month_select",
        label: [force, `${date!.getFullYear()}-${date!.getMonth()+1<10?'0'+(date!.getMonth()+1):date!.getMonth()+1}`].join('-'),
      });
    }
  }

  const handleTotalClick = () => {
    setTotalModalOpened(true)
    if (typeof enhancedOverallData === 'undefined') {
      setModalError({'error': false, 'message': null});
      fetchEnhancedData('total', {force: force, monthSliderValue: monthSliderValue});
      ReactGA.event({
        category: "enhanced_overall_data",
        action: "enhanced_overall_data",
        label: [force, monthSliderValue].join('-'),
      });
    }
  }
    
  const handleRaceChange = (e: string) => {
    setRaceModalOpen(true)
    if (typeof enhancedRaceData === 'undefined' || e!=race) {
      if (e!=race) {
        setEnhancedRaceData(undefined);
      }
      setModalError({'error': false, 'message': null});
      fetchEnhancedData('race', {force: force, ethnicity: e});
      setRace(e);
      if (month === '') {
        console.log(`${startDate.getFullYear()}-${startDate.getMonth()+1<10?'0'+(startDate.getMonth()+1):startDate.getMonth()+1}`)
        ReactGA.event({
          category: "enhanced_race_data",
          action: "enhanced_race_data",
          label: [force, e, `${startDate.getFullYear()}-${startDate.getMonth()+1<10?'0'+(startDate.getMonth()+1):startDate.getMonth()+1}`].join('-'),
        });
      } else {
        ReactGA.event({
          category: "enhanced_race_data",
          action: "enhanced_race_data",
          label: [force, e, month==''?undefined:month].join('-'),
        });
      }
    }
  }
  
  const handleGenderChange = (e: string) => {
    setGenderModalOpen(true)
    if (typeof enhancedRaceData === 'undefined' || e!=gender) {
      if (e!=race) {
        setEnhancedRaceData(undefined);
      }
      setModalError({'error': false, 'message': null});
      fetchEnhancedData('gender', {force: force, gender: e});
      setGender(e);
      if (month === '') {
        ReactGA.event({
          category: "enhanced_gender_data",
          action: "enhanced_gender_data",
          label: [force, e, `${startDate.getFullYear()}-${startDate.getMonth()+1<10?'0'+(startDate.getMonth()+1):startDate.getMonth()+1}`].join('-'),
        });
      } else {
        ReactGA.event({
          category: "enhanced_gender_data",
          action: "enhanced_gender_data",
          label: [force, e, month==''?undefined:month].join('-'),
        });
      }
    }
  }

  const handleMonthSliderChange = (e: string) => {
    if (e!=monthSliderValue) {
      setModalError({'error': false, 'message': null});
      setMonthSliderValue(e)
      fetchEnhancedData('total', {force: force, monthSliderValue: e});
      ReactGA.event({
        category: "enhanced_overall_data",
        action: "enhanced_overall_data",
        label: [force, e].join('-'),
      });
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
  
  const fetchEnhancedData = (dataType: string, queryparameters: any) => {
    setEnhancedDataLoading(true)
    if (dataType === 'total') {
      let url = constructURL('/stopsearch/enhanceddata', queryparameters)
      
      fetchData(url)
      .then(data => {
        setEnhancedOverallData(data)
        setEnhancedDataLoading(false)
      })
      .catch((error) => {
        setModalError({'error': true, 'message': error.message});
      })
    } else if (dataType === 'race') {
      let url = ''
      if (month === '') {
        url = constructURL('/stopsearch/enhanceddata', queryparameters)
      } else {
        url = constructURL('/stopsearch/enhanceddata', Object.assign(queryparameters, { month: month}))
      }

      fetchData(url)
      .then(data => {
        setEnhancedRaceData(data)
        setEnhancedDataLoading(false)
      })
      .catch((error) => {
        setModalError({'error': true, 'message': error.message});
      })
    } else {
      let url = ''
      if (month === '') {
        url = constructURL('/stopsearch/enhanceddata', queryparameters)
      } else {
        url = constructURL('/stopsearch/enhanceddata', Object.assign(queryparameters, { month: month}))
      }

      fetchData(url)
      .then(data => {
        setEnhancedGenderData(data)
        setEnhancedDataLoading(false)
      })
      .catch((error) => {
        setModalError({'error': true, 'message': error.message});
      })
    }
  }
  
  return (
    <>
      <StopSearchModal
        totalModalOpened={totalModalOpened}
        setTotalModalOpened={setTotalModalOpened}
        enhancedOverallData={enhancedOverallData!}
        isEnhancedDataLoading={isEnhancedDataLoading}
        modalError={modalError}
        force={force}
        monthSliderValue={monthSliderValue}
        handleMonthSliderChange={handleMonthSliderChange}
        />
      <RaceModal
        raceModalOpen={raceModalOpen}
        setRaceModalOpen={setRaceModalOpen}
        race={race}
        enhancedRaceData={enhancedRaceData}
        isEnhancedDataLoading={isEnhancedDataLoading}
        modalError={modalError}
        force={force}
        startDate={startDate}
        />
      <GenderModal
        genderModalOpen={genderModalOpen}
        setGenderModalOpen={setGenderModalOpen}
        gender={gender}
        enhancedGenderData={enhancedGenderData}
        isEnhancedDataLoading={isEnhancedDataLoading}
        modalError={modalError}
        force={force}
        startDate={startDate}
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
        handleTotalClick={handleTotalClick}
        handleRaceChange={handleRaceChange}
        handleGenderChange={handleGenderChange}
      />
    </>
  )
}

export default StopSearchDashboardController;