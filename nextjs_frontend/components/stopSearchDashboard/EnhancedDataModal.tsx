import { Modal, Loader, Paper, Text } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import  OverallDataModalCharts from './OverallDataModalCharts';

interface stopSearchModalProps {
    totalModalOpened: boolean,
    setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    enhancedOverallData: enhancedData,
    isEnhancedDataLoading: boolean,
    modalError: error
}

const StopSearchModal = ({
  totalModalOpened, 
  setTotalModalOpened,
  enhancedOverallData,
  isEnhancedDataLoading,
  modalError}: stopSearchModalProps) => {

  return (
      <Modal
        opened={totalModalOpened}
        onClose={() => setTotalModalOpened(false)}
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
          <OverallDataModalCharts
            enhancedOverallData={enhancedOverallData}
          />
            
        }
      </Modal>
  )
}

export default StopSearchModal;