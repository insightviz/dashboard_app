import { Modal, Loader, Paper, Text } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import RaceModalCharts from './RaceDataModalCharts';

interface ethnicityModalProps {
    raceModalOpen: boolean,
    setRaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    race: string,
    enhancedRaceData: enhancedData | undefined,
    isEnhancedDataLoading: boolean,
    modalError: error
}

const RaceModal = ({
  raceModalOpen, 
  setRaceModalOpen, 
  race,
  enhancedRaceData,
  isEnhancedDataLoading,
  modalError}: ethnicityModalProps) => {
  return (
      <Modal
        opened={raceModalOpen}
        onClose={() => setRaceModalOpen(false)}
        fullScreen
        zIndex={999}
      >
        {
          modalError.error ? 
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
          <Loader variant="bars" size='md' /> :
          <RaceModalCharts enhancedRaceData={enhancedRaceData!} race={race}/>
        }
      </Modal>
  )
}

export default RaceModal;