import { Modal, Loader, Paper, Text } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import GenderModalCharts from './GenderDataModalCharts';

interface genderModalProps {
    genderModalOpen: boolean,
    setGenderModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    gender: string,
    enhancedGenderData: enhancedData | undefined,
    isEnhancedDataLoading: boolean,
    modalError: error
}

const GenderModal = ({
  genderModalOpen, 
  setGenderModalOpen, 
  gender,
  enhancedGenderData,
  isEnhancedDataLoading,
  modalError}: genderModalProps) => {
  return (
      <Modal
        opened={genderModalOpen}
        onClose={() => setGenderModalOpen(false)}
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
          <GenderModalCharts gender={gender} enhancedGenderData={enhancedGenderData!}/>
        }
      </Modal>
  )
}

export default GenderModal;