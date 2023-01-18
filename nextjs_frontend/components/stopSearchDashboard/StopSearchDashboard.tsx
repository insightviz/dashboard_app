import { Select, Loader, Title, Avatar, Text, Paper, Flex } from '@mantine/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from "./StopSearchController.module.css";
import { styled } from '@mui/material/styles';
import StatsGridIcons from './StatsGrid'
import TextField from '@mui/material/TextField';
import { getMonthsNames } from '@mantine/dates';
import  { error, forceSelectOption, Data } from './SharedTypes';
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewportSize } from '@mantine/hooks';

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
  return (
    <div className={styles.stopSearchDashboard}>
      <Title order={1} size={42} align="center">UK stop and search dashboard</Title>
      <div className={styles.selectContainer}>
        <Title order={2} size={26}>Select options</Title>
        <div className={styles.selectInputs}>
          <div className={styles.forceDropdown}>
            <span>Select police force:</span>
            <Select
              data={forceSelectOptions}
              searchable={true}
              value={force}
              onChange={handleForceChange}
              transition='fade'
              transitionDuration={400}
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
        <AnimatePresence initial={false} mode="wait">
          {
            error.error ? 
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: .7 }}
              transition={{ duration: 0.3 }}
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
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
        <Title order={2} size={26}>Contributors</Title>
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