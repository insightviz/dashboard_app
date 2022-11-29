import { Select, Loader } from '@mantine/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./StopSearchController.module.css";
import { ChevronDown, ChevronUp, Info, Minus } from '@geist-ui/icons';
import { styled } from '@mui/material/styles';
import StatsGridIcons from './StatsGrid'
//import ReactGA from "react-ga4";
import dynamic from 'next/dynamic'
import Image from 'next/image'
import TextField from '@mui/material/TextField';
//import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { getMonthsNames } from '@mantine/dates';
import  { error, forceSelectOption, Data } from './sharedTypes';
import React from "react";

const Chart = dynamic(() => import('../chart/Chart'), {
    ssr: false
})

const months = getMonthsNames('en', 'MMMM');

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#22b8e6',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ced4da',
    },
    '&:hover fieldset': {
      borderColor: '#ced4da',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#22b8e6',
    },
  },
});

interface DashboardProps {
  force: string,
  handleForceChange: (e: string) => void, 
  availableMonths: Date[], 
  startDate: Date, 
  handleMonthChange: (date: Date | null ) => void,
  error: error,
  isDataLoading: boolean,
  isForceLoading: boolean,
  isMonthsLoading: boolean,
  data: Data | undefined,
  forceSelectOptions: forceSelectOption[]
}
const StopSearchDashboard = ({
  force,
  handleForceChange, 
  availableMonths, 
  startDate, 
  handleMonthChange,
  error,
  isDataLoading,
  isForceLoading,
  isMonthsLoading,
  data,
  forceSelectOptions
}: DashboardProps) => { 
  return (
    <div className={styles.stopSearchDashboard}>
      <h1>UK stop and search dashboard</h1>
      <div className={styles.selectContainer}>
        <h2>Select options</h2>
        <div className={styles.selectInputs}>
          <span className={styles.forceLabel}>Police force:</span>
          <div className={styles.forceDropdown}>
            <Select
              label="Select police force"
              data={forceSelectOptions}
              searchable={true}
              value={force}
              onChange={handleForceChange}
            />
          </div>
          <span className={styles.monthLabel}>Month:</span>
          <div className={styles.monthPicker}>
            <DatePicker
              views={['year', 'month']}
              label="Select month"
              openTo="year"
              minDate={availableMonths[0]}
              maxDate={availableMonths.slice(-1)[0]}
              value={startDate}
              onChange={handleMonthChange}
              renderInput={(params) => <CssTextField {...params} helperText={null} />}
            />
          </div>
        </div>
      </div>
      
      {isForceLoading || isMonthsLoading || isDataLoading ?
      <Loader variant="bars" size='md' /> :
      <StatsGridIcons data={data!} startDate={startDate}/>
      }
      <div className={styles.contributors}>
        <h2>Contributors</h2>
        <div className={styles.avatarImages}>
          <a href="https://github.com/ezeahunanya" className="contributor-link" target="_blank" rel="noreferrer">
            <Image src='https://avatars.githubusercontent.com/u/57296341?v=4' layout="fixed" width={65} height={65} quality={100} alt="Avatar" className={styles.avatar}/>
            <span>Eze Ahunanya</span>
          </a>
          <a href="https://github.com/Primebrook" className="contributor-link" target="_blank" rel="noreferrer">
            <Image src='https://avatars.githubusercontent.com/u/71849503?v=4' layout="fixed" width={65} height={65} quality={100} alt="Avatar" className={styles.avatar}/>
            <span>Brook Abraha</span>
          </a>
        </div>
      </div> 
    </div>
  )
}

export default StopSearchDashboard;