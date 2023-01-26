import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import RaceModalCharts from './RaceDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';
import { Dayjs } from 'dayjs';
import { useReducedMotion } from '@mantine/hooks';

const months = getMonthsNames('en', 'MMMM');

interface ethnicityModalProps {
    raceModalOpen: boolean,
    setRaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    race: string,
    enhancedRaceData: enhancedData | undefined,
    isEnhancedDataLoading: boolean,
    modalError: error,
    force: string,
    startDate: Dayjs
}

const RaceModal = ({
  raceModalOpen, 
  setRaceModalOpen, 
  race,
  enhancedRaceData,
  isEnhancedDataLoading,
  modalError,
  force,
  startDate}: ethnicityModalProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
      <Modal
        opened={raceModalOpen}
        onClose={() => setRaceModalOpen(false)}
        fullScreen
        zIndex={999}
        transition={shouldReduceMotion ? undefined : 'fade'}
        transitionDuration={shouldReduceMotion ? 0 : 400}
      >
        {
          <SimpleGrid cols={1} spacing="xl">              
            <Title order={1} size={32} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police searches in {months[startDate.month()]}, {startDate.year()}</Title>
            {modalError.error ? 
            <Paper withBorder p="xl" radius="xl">
              <Text
                color="dimmed"
                transform="uppercase"
                weight={700}
                size="md"
                >
                {modalError.message}
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
             <RaceModalCharts enhancedRaceData={enhancedRaceData!} race={race}/>}
          </SimpleGrid>
        }
      </Modal>
  )
}

export default RaceModal;