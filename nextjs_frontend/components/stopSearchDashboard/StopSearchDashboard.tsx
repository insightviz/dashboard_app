import { Select, Loader, Title, Avatar, Text, Paper, Flex } from '@mantine/core';
import styles from "./StopSearchController.module.css";
import  { error, forceSelectOption, Data } from './SharedTypes';
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useViewportSize } from '@mantine/hooks';
import dynamic from 'next/dynamic'
import DatePickerWrapper from '../datePicker/DatePicker';
import { Dayjs } from "dayjs";

const StatsGridIcons = dynamic(() => import('./StatsGrid'), {
  ssr: false,
})

interface DashboardProps {
  force: string,
  handleForceChange: (e: string) => void, 
  availableMonths: Dayjs[], 
  startDate: Dayjs, 
  handleMonthChange: (Dayjs: Dayjs | null ) => void,
  error: error,
  isDataLoading: boolean,
  isForceLoading: boolean,
  isMonthsLoading: boolean,
  data: Data | undefined,
  forceSelectOptions: forceSelectOption[]
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
  handleTotalClick,
  handleRaceChange,
  handleGenderChange
}: DashboardProps) => { 
  const { width } = useViewportSize();
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className={styles.stopSearchDashboard}>
      <Title order={1} size={32} align="center">UK stop and search dashboard</Title>
      <div className={styles.selectContainer}>
        <Title order={2} size={24}>Select options</Title>
        <div className={styles.selectInputs}>
          <div className={styles.forceDropdown}>
            <span>Select police force:</span>
            <Select
              data={forceSelectOptions}
              value={force}
              onChange={handleForceChange}
              transition='fade'
              transitionDuration={400}
              maxDropdownHeight={300}
              />
          </div>
          <div className={styles.monthPicker}>
            <span>Select month:</span>
            <DatePickerWrapper
              availableMonths={availableMonths}
              startDate={startDate}
              handleMonthChange={handleMonthChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <AnimatePresence initial={false} mode="wait">
          {
            error.error ? 
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : .7 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              key="error-message">
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
            </motion.div>
            :
            isForceLoading || isMonthsLoading || isDataLoading ?
            <motion.div
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
            </motion.div> :
            <StatsGridIcons 
              data={data!} 
              startDate={startDate}
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