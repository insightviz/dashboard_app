import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex } from '@mantine/core';
import RaceModalCharts from './RaceDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';
import { Dayjs } from 'dayjs';
import { useReducedMotion } from '@mantine/hooks';

const FetchEnhancedRaceData = (await import('./dashboardHooks/FetchEnhancedRaceData')).default

const months = getMonthsNames('en', 'MMMM');

interface ethnicityModalProps {
    raceModalOpen: boolean,
    openRaceModal: (e: boolean) => void,
    race: string,
    month: string,
    force: string,
    datePickerDate: Dayjs
}

const RaceModal = ({
  raceModalOpen, 
  openRaceModal, 
  race,
  month,
  force,
  datePickerDate}: ethnicityModalProps) => {
  const shouldReduceMotion = useReducedMotion()
  const { enhancedData, isEnhancedDataLoading, enhancedDataError } = FetchEnhancedRaceData(force, race, month)
  return (
      <Modal
        opened={raceModalOpen}
        onClose={() => openRaceModal(false)}
        fullScreen
        zIndex={999}
        transition={shouldReduceMotion ? undefined : 'fade'}
        transitionDuration={shouldReduceMotion ? 0 : 400}
      >
        {
          <SimpleGrid cols={1} spacing="xl">              
            <Title order={1} size={32} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police searches in {months[datePickerDate.month()]}, {datePickerDate.year()}</Title>
            {enhancedDataError ? 
            <Paper withBorder p="xl" radius="xl">
              <Text
                color="dimmed"
                transform="uppercase"
                weight={700}
                size="md"
                >
                {enhancedDataError.message} 
                Status code: {enhancedDataError.status} 
                Error: {enhancedDataError.info}
              </Text>
            </Paper>
             :
            isEnhancedDataLoading ?
            <Flex
              mih={500}
              justify="center"
              align="center"
              direction="column"
            >
              <Loader variant="bars" size='md' />
            </Flex> :
             <RaceModalCharts enhancedData={enhancedData} race={race}/>}
          </SimpleGrid>
        }
      </Modal>
  )
}

export default RaceModal;