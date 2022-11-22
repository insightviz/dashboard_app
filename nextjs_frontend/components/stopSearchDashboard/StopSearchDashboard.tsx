import { useState, useEffect, useRef } from "react";
import { Select } from '@mantine/core';
import { Spinner, Tooltip, Text } from "@geist-ui/core/";
import { Loader } from '@mantine/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./StopSearchController.module.css";
import { ChevronDown, ChevronUp, Info, Minus, Calendar } from '@geist-ui/icons';

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
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </div>
        </div>
      </div>
      <div className={styles.monthlyStopSearchContainer}>
        <div className={styles.monthlyStopSearchFigure}>
        {
          error.error ? 
          <>{error.message}</> :
          isForceLoading || isMonthsLoading || isDataLoading ? 
          <Loader variant="bars" /> :
          <>
            <div className={styles.figureTitle}>
              <span>Number of stop and searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}</span>
              <Tooltip text={<Text font="1.4rem">Number of stop and searches this month and percentage change compared to previous month</Text>} placement="bottomEnd">
                <Info/>
              </Tooltip>  
            </div>
            <div className={styles.stopSearchNo}>
              <span className="month-stop-search">
                {data!.monthly_no_stop_search.monthly_no_stop_search}
              </span>
              <span className={`${styles.percentageChange} 
              ${data!.monthly_no_stop_search.pct_change > 0 ? styles.positive : data!.monthly_no_stop_search.pct_change === 0 || data!.monthly_no_stop_search.pct_change === 'N/A' ? '' : styles.negative }`}>
                {data!.monthly_no_stop_search.pct_change > 0 ? <ChevronUp /> : data!.monthly_no_stop_search.pct_change === 0 || data!.monthly_no_stop_search.pct_change === 'N/A' ? <Minus /> : <ChevronDown />}
                {data!.monthly_no_stop_search.pct_change > 0 ? data!.monthly_no_stop_search.pct_change+'%' : data!.monthly_no_stop_search.pct_change === 0 || data!.monthly_no_stop_search.pct_change === 'N/A' ? data!.monthly_no_stop_search.pct_change : data!.monthly_no_stop_search.pct_change+'%'}
              </span>
            </div>
          </> 
        }
        </div>
      </div>
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