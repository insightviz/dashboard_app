import React, { useEffect, useState } from "react";
import StopSearchDashboard from "./StopSearchDashboard";
import dynamic from 'next/dynamic'
import dayjs, { Dayjs } from "dayjs";

const StopSearchModal = dynamic(() => import('./EnhancedDataModal'), {
  ssr: false,
})
const RaceModal = dynamic(() => import('./RaceDataModal'), {
  ssr: false,
})
const GenderModal = dynamic(() => import('./GenderDataModal'), {
  ssr: false,
})
const ReactGA = ( await import('react-ga4')).default

const StopSearchDashboardController = () => { 
  const [force, setForce] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [gender, setGender] = useState<string>('');
    
  const [datePickerDate, setDatePickerDate] = useState<Dayjs>(dayjs());
  
  const [totalModalOpened, setTotalModalOpened] = useState<boolean>(false)
  const [raceModalOpen, setRaceModalOpen] = useState<boolean>(false)
  const [genderModalOpen, setGenderModalOpen] = useState<boolean>(false)
  const [monthSliderValue, setMonthSliderValue] = useState<string>('12')

  useEffect(() => {
    setForce(localStorage.getItem('insightStopSearchForce') || 'metropolitan')
  }, [])

  function changeDatePickerDate (e: Dayjs) {
    setDatePickerDate(e)
  }
  function openTotalModal (e: boolean) {
    setTotalModalOpened(e)
  }
  function openRaceModal (e: boolean) {
    setRaceModalOpen(e)
  }
  function openGenderModal (e: boolean) {
    setGenderModalOpen(e)
  }

  const handleForceChange = (e: string) => {
    if (e!=force) {
      setMonth('');
      setForce(e);
      localStorage.setItem('insightStopSearchForce', e);
      setRace('');
      setGender('');
      setMonthSliderValue('12');
      ReactGA.event({
        category: "force_select",
        action: "force_select",
        label: e,
      });
    }
  }
  
  const handleMonthChange = (date: Dayjs | null) => {
    if (dayjs.isDayjs(date)) {
      setDatePickerDate(date)
      setMonth(`${date.year()}-${date.month()+1<10?'0'+(date.month()+1):date.month()+1}`)
      setRace('');
      setGender('');
      ReactGA.event({
        category: "month_select",
        action: "month_select",
        label: [force, `${date.year()}-${date.month()+1<10?'0'+(date.month()+1):date.month()+1}`].join('-'),
      });
    }
  }

  const handleTotalClick = () => {
    setTotalModalOpened(true)    
    ReactGA.event({
      category: "enhanced_overall_data",
      action: "enhanced_overall_data",
      label: [force, monthSliderValue].join('-'),
    });
  }
    
  const handleRaceChange = (e: string) => {
    setRaceModalOpen(true)
    if (e!=race) {
      setRace(e);
      ReactGA.event({
        category: "enhanced_race_data",
        action: "enhanced_race_data",
        label: [force, e, month?month:`${datePickerDate.year()}-${datePickerDate.month()+1<10?'0'+(datePickerDate.month()+1):datePickerDate.month()+1}`].join('-'),
      });
    }     
  }
  
  const handleGenderChange = (e: string) => {
    setGenderModalOpen(true)
    if (e!=gender) {
      setGender(e);   
      ReactGA.event({
        category: "enhanced_gender_data",
        action: "enhanced_gender_data",
        label: [force, e, month?month:`${datePickerDate.year()}-${datePickerDate.month()+1<10?'0'+(datePickerDate.month()+1):datePickerDate.month()+1}`].join('-'),
      });
    }    
  }  

  const handleMonthSliderChange = (e: string) => {
    if (e!=monthSliderValue) {
      setMonthSliderValue(e)
      ReactGA.event({
        category: "enhanced_overall_data",
        action: "enhanced_overall_data",
        label: [force, e].join('-'),
      });
    }
  }
  
  return (
    <>
      {
        totalModalOpened && (
          <StopSearchModal
            totalModalOpened={totalModalOpened}
            openTotalModal={openTotalModal}
            force={force}
            monthSliderValue={monthSliderValue}
            handleMonthSliderChange={handleMonthSliderChange}
            />
        )
      }
      {
        raceModalOpen && (
          <RaceModal
            raceModalOpen={raceModalOpen}
            openRaceModal={openRaceModal}
            race={race}
            month={month}
            force={force}
            datePickerDate={datePickerDate}
            />
        )
      }
      {
        genderModalOpen && (
          <GenderModal
            genderModalOpen={genderModalOpen}
            openGenderModal={openGenderModal}
            gender={gender}
            month={month}
            force={force}
            datePickerDate={datePickerDate}
          />
        )
      }
      {
        force && (
          <StopSearchDashboard
            force={force}
            month={month}
            handleForceChange={handleForceChange}
            handleMonthChange={handleMonthChange}
            handleTotalClick={handleTotalClick}
            handleRaceChange={handleRaceChange}
            handleGenderChange={handleGenderChange}
            changeDatePickerDate={changeDatePickerDate}
            datePickerDate={datePickerDate}
          />          
        )
      }
    </>
  )
}

export default StopSearchDashboardController;