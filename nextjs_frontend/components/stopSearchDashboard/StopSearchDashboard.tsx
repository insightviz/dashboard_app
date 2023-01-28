import { Loader, Title, Flex } from '@mantine/core';
import styles from "./StopSearchController.module.css";
import React from "react";
import { AnimatePresence, useReducedMotion, m, LazyMotion, domAnimation } from "framer-motion";
import { useViewportSize } from '@mantine/hooks';
import dynamic from 'next/dynamic'
import DatePickerWrapper from '../datePicker/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import Image from 'next/image'
import { useEffect } from 'react';

const FetchForces = (await import('./dashboardHooks/FetchForces')).default
const FetchData = (await import('./dashboardHooks/FetchData')).default
const FetchMonths = (await import('./dashboardHooks/FetchMonths')).default

const StatsGridIcons = dynamic(() => import('./StatsGrid'), {
  ssr: false,
})
const SelectWrapper = dynamic(() =>
  import('../select/SelectWrapper')
)
const ErrorWrapper = dynamic(() =>
  import('./errorComponent/ErrorWarning')
)

interface DashboardProps {
  force: string,
  month: string,
  handleForceChange: (e: string) => void, 
  datePickerDate: Dayjs, 
  handleMonthChange: (Dayjs: Dayjs | null ) => void,
  handleTotalClick: () => void,
  handleRaceChange: (race: string ) => void,
  handleGenderChange: (gender: string ) => void,
  changeDatePickerDate: (e: Dayjs) => void
}
const StopSearchDashboard = ({
  force,
  month,
  handleForceChange, 
  datePickerDate,
  handleMonthChange,
  handleTotalClick,
  handleRaceChange,
  handleGenderChange,
  changeDatePickerDate
}: DashboardProps) => { 
  const { width } = useViewportSize();
  const shouldReduceMotion = useReducedMotion()
  const { data, isDataLoading, dataError } = FetchData(force, month)
  const { forcesData, isForcesLoading, forceError } = FetchForces()
  const { monthsData, isMonthsLoading, monthsError } = FetchMonths(force)

  useEffect(() => {
    if (monthsData) {
      changeDatePickerDate(dayjs(monthsData.slice(-1)[0]))
    }
  }, [monthsData])

  return (
    <div className={styles.stopSearchDashboard}>
      <Title order={1} size={32} align="center">UK stop and search dashboard</Title>
      <div className={styles.selectContainer}>
        <Title order={2} size={24}>Select options</Title>
        <div className={styles.selectInputs}>
          <div className={styles.forceDropdown}>
            <span>Select police force:</span>
            {
              forcesData && (
                <SelectWrapper
                  selectOptions={forcesData}
                  value={force}
                  onChange={handleForceChange}
                  maxDropdownHeight={300}
                  ariaLabel='Police Force Select'
                  />
              )
            }
          </div>
          <div className={styles.monthPicker}>
            <span>Select month:</span>
            {
              monthsData && (
                <DatePickerWrapper
                  monthsData={monthsData}
                  datePickerDate={datePickerDate}
                  handleMonthChange={handleMonthChange}
                  />
              )
            }
          </div>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <AnimatePresence initial={false} mode="wait">
          {
            dataError || forceError || monthsError || typeof data == 'string' ? 
            <LazyMotion features={domAnimation}>
              <m.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : .7 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                key="error-message">
                {
                  typeof data == 'string' ?
                  <ErrorWrapper errorMessage={data}/>
                  :
                  dataError ? 
                  <ErrorWrapper errorMessage={dataError!.message} errorStatus={dataError!.status} errorInfo={dataError!.info} />
                  :
                  forceError ?
                  <ErrorWrapper errorMessage={forceError!.message} errorStatus={forceError!.status} errorInfo={forceError!.info} />
                  :
                  <ErrorWrapper errorMessage={monthsError!.message} errorStatus={monthsError!.status} errorInfo={monthsError!.info} />
                }
              </m.div>
            </LazyMotion>
            :
            isForcesLoading || isMonthsLoading || isDataLoading ?
            <LazyMotion features={domAnimation}>
              <m.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                key="loader">
                <Flex
                  mih={width > 500 ? 637.08 : 350}
                  justify="center"
                  align="center"
                  direction="column">
                  <Loader variant="bars" size='md' />
                </Flex>
              </m.div>
            </LazyMotion> :
            <StatsGridIcons 
              data={data!} 
              startDate={datePickerDate}
              handleTotalClick={handleTotalClick}
              handleRaceChange={handleRaceChange}
              handleGenderChange={handleGenderChange}
              force={force}
            />
          }
        </AnimatePresence>
      </div>
      <div className={styles.contributors}>
        <Title order={2} size={24}>Contributors</Title>
        <div className={styles.avatarImages}>
          <a href="https://github.com/ezeahunanya" className="contributor-link" target="_blank" rel="noreferrer">
            <Image className={styles.image} src="https://avatars.githubusercontent.com/u/57296341?v=4" alt='Eze Ahunanya image' width={56} height={56} /> 
            <span>Eze Ahunanya</span>
          </a>
          <a href="https://github.com/Primebrook" className="contributor-link" target="_blank" rel="noreferrer">
            <Image className={styles.image} src="https://avatars.githubusercontent.com/u/71849503?v=4" alt='Brook Abraha image' width={56} height={56} /> 
            <span>Brook Abraha</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default StopSearchDashboard;