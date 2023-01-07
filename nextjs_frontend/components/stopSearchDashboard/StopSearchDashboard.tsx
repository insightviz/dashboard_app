import { Select, Loader } from '@mantine/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./StopSearchController.module.css";
import { styled } from '@mui/material/styles';
import StatsGridIcons from './StatsGrid'
//import ReactGA from "react-ga4";
import dynamic from 'next/dynamic'
import TextField from '@mui/material/TextField';
import { Title, Avatar, Text, Paper } from '@mantine/core';
import { getMonthsNames } from '@mantine/dates';
import  { error, forceSelectOption, Data } from './SharedTypes';
import React from "react";

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
  setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
  handleTotalClick: () => void,
  handleRaceChange: (race: string ) => void,
  handleGenderChange: (gender: string ) => void,
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
  forceSelectOptions,
  setTotalModalOpened,
  handleTotalClick,
  handleRaceChange,
  handleGenderChange
}: DashboardProps) => { 
  
  return (
    <div className={styles.stopSearchDashboard}>
      <Title order={1}>UK stop and search dashboard</Title>
      <div className={styles.selectContainer}>
        <Title order={2}>Select options</Title>
        <div className={styles.selectInputs}>
          <div className={styles.forceDropdown}>
            <span>Select police force:</span>
            <Select
              data={forceSelectOptions}
              searchable={true}
              value={force}
              onChange={handleForceChange}
              />
          </div>
          <div className={styles.monthPicker}>
            <span>Select month:</span>
            <DatePicker
              views={['year', 'month']}
              openTo="year"
              minDate={availableMonths[0]}
              maxDate={availableMonths.slice(-1)[0]}
              value={startDate}
              onChange={handleMonthChange}
              renderInput={(params) => <CssTextField {...params} helperText={null} size="small" fullWidth/>}
            />
          </div>
        </div>
      </div>
      <div className={styles.statsGrid}>
        {
        error.error ? 
        <Paper withBorder p="xl" radius="xl">
          <Text
            color="dimmed"
            transform="uppercase"
            weight={700}
            size="md"
          >
            {error.message}
          </Text>
        </Paper>
         :
        isForceLoading || isMonthsLoading || isDataLoading ?
        <Loader variant="bars" size='md' /> :
        <StatsGridIcons 
          data={data!} 
          startDate={startDate}
          setTotalModalOpened={setTotalModalOpened}
          handleTotalClick={handleTotalClick}
          handleRaceChange={handleRaceChange}
          handleGenderChange={handleGenderChange}
          force={force}
        />
        }
      </div>
      <div className={styles.contributors}>
        <Title order={2}>Contributors</Title>
        <div className={styles.avatarImages}>
          <a href="https://github.com/ezeahunanya" className="contributor-link" target="_blank" rel="noreferrer">
            <Avatar src="https://avatars.githubusercontent.com/u/57296341?v=4" alt="Eze Ahunanya" size="lg" />
            <span>Eze Ahunanya</span>
          </a>
          <a href="https://github.com/Primebrook" className="contributor-link" target="_blank" rel="noreferrer">
            <Avatar src="https://avatars.githubusercontent.com/u/71849503?v=4" alt="Brook Abraha" size="lg" />
            <span>Brook Abraha</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default StopSearchDashboard;