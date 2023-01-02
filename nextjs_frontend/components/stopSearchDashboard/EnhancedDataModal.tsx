import { Modal, SimpleGrid, Loader } from '@mantine/core';
import  { enhancedData } from './SharedTypes';
import  OverallDataModalCharts from './OverallDataModalCharts';

interface stopSearchModalProps {
    totalModalOpened: boolean,
    setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    enhancedOverallData: enhancedData,
    isEnhancedDataLoading: boolean
}

const StopSearchModal = ({
  totalModalOpened, 
  setTotalModalOpened,
  enhancedOverallData,
  isEnhancedDataLoading}: stopSearchModalProps) => {

  return (
      <Modal
        opened={totalModalOpened}
        onClose={() => setTotalModalOpened(false)}
        fullScreen
        zIndex={999}
      >
        {
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