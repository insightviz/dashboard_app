import { Loader, Title, Flex } from '@mantine/core';
import styles from "./StopSearchController.module.css";
import React from "react";
import { AnimatePresence, useReducedMotion, m, LazyMotion, domAnimation } from "framer-motion";
import { useViewportSize } from '@mantine/hooks';
import dynamic from 'next/dynamic'
import dayjs, { Dayjs } from "dayjs";
import Image from 'next/image'
import { useEffect } from 'react';
import { useAppThemeContext } from '../../context/AppTheme';

const FetchForces = (await import('./dashboardHooks/FetchForces')).default
const FetchData = (await import('./dashboardHooks/FetchData')).default
const FetchMonths = (await import('./dashboardHooks/FetchMonths')).default

const StatsGridIcons = dynamic(() => import('./StatsGrid'), {
  ssr: false,
})
const SelectWrapper = dynamic(() =>
  import('../select/SelectWrapper')
)
const DatePickerWrapper = dynamic(() =>
  import('../datePicker/DatePicker')
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
  const { width, height } = useViewportSize();
  const shouldReduceMotion = useReducedMotion()
  const { data, dataError } = FetchData(force, month)
  const { forcesData, forceError } = FetchForces()
  const { monthsData, monthsError } = FetchMonths(force)
  const { theme } = useAppThemeContext();

  useEffect(() => {
    if (monthsData) {
      changeDatePickerDate(dayjs(monthsData.slice(-1)[0]))
    }
  }, [monthsData])

  return (
    <div className={styles.stopSearchDashboard}>
      <Title color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'} order={1} size={20} lh={1} mb={24}>UK Stop and Search Dashboard</Title>
      <div className={styles.selectInputs}>
        <SelectWrapper
          selectOptions={forcesData?forcesData:['Loading...']}
          value={forcesData?force:'Loading...'}
          onChange={handleForceChange}
          maxDropdownHeight={height/3}
          ariaLabel='Police Force Select'
          disabled={forcesData?false:true}
          className={styles.forceSelect}
          icons={forcesData?undefined:<Loader size='sm' />}
          />
        <DatePickerWrapper
          monthsData={monthsData?monthsData:[dayjs()]}
          datePickerDate={datePickerDate}
          handleMonthChange={handleMonthChange}
          disabled={monthsData?false:true}
          className={styles.monthPicker}
          />
      </div>
      <div className={styles.statsGrid}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            {
              dataError || forceError || monthsError || typeof data == 'string' ? 
                <m.div
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : .7 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  key="error-message"
                  className={styles.error}>
                  {
                    typeof data == 'string' ?
                    <ErrorWrapper message={data}/>
                    :
                    dataError ? 
                    <ErrorWrapper message={dataError!.message} status={dataError!.status} info={dataError!.info} />
                    :
                    forceError ?
                    <ErrorWrapper message={forceError!.message} status={forceError!.status} info={forceError!.info} />
                    :
                    <ErrorWrapper message={monthsError!.message} status={monthsError!.status} info={monthsError!.info} />
                  }
                </m.div>
              :
              !data ?
                <m.div
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  key="loader">
                  <Flex
                    mih={width > 500 ? 771.4 : 350}
                    justify="center"
                    align="center"
                    direction="column">
                    <Loader variant="bars" size='md' />
                  </Flex>
                </m.div>
              :
              <StatsGridIcons 
                data={data} 
                datePickerDate={datePickerDate}
                handleTotalClick={handleTotalClick}
                handleRaceChange={handleRaceChange}
                handleGenderChange={handleGenderChange}
                force={force}
              />
            }
          </AnimatePresence>
        </LazyMotion>
      </div>
      <div className={styles.contributors}>
        <Title color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'} order={2} size={16} lh={1} mt={32}>Contributors</Title>
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