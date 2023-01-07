import { Modal, Loader, Paper, Text, Title, SimpleGrid } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import  OverallDataModalCharts from './OverallDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"

interface stopSearchModalProps {
    totalModalOpened: boolean,
    setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    enhancedOverallData: enhancedData,
    isEnhancedDataLoading: boolean,
    modalError: error,
    force: string
}

const StopSearchModal = ({
  totalModalOpened, 
  setTotalModalOpened,
  enhancedOverallData,
  isEnhancedDataLoading,
  modalError,
  force}: stopSearchModalProps) => {

  return (
      <Modal
        opened={totalModalOpened}
        onClose={() => setTotalModalOpened(false)}
        fullScreen
        zIndex={999}
      >
        {
          <SimpleGrid cols={1} spacing="xl">
            <Title order={1} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police stop and searches</Title>
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
             <Loader variant="bars" size='md' /> :
             <OverallDataModalCharts
             enhancedOverallData={enhancedOverallData}
             />}
          </SimpleGrid>           
        }
      </Modal>
  )
}

export default StopSearchModal;