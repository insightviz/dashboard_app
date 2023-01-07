import { Modal, Loader, Paper, Text, Title, SimpleGrid } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import GenderModalCharts from './GenderDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';

const months = getMonthsNames('en', 'MMMM');

interface genderModalProps {
    genderModalOpen: boolean,
    setGenderModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    gender: string,
    enhancedGenderData: enhancedData | undefined,
    isEnhancedDataLoading: boolean,
    modalError: error,
    force: string,
    startDate: Date
}

const GenderModal = ({
  genderModalOpen, 
  setGenderModalOpen, 
  gender,
  enhancedGenderData,
  isEnhancedDataLoading,
  modalError,
  force,
  startDate}: genderModalProps) => {
  return (
      <Modal
        opened={genderModalOpen}
        onClose={() => setGenderModalOpen(false)}
        fullScreen
        zIndex={999}
      >
        {          
          <SimpleGrid cols={1} spacing="xl">
            <Title order={1} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police stop and searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}</Title>
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
            <GenderModalCharts gender={gender} enhancedGenderData={enhancedGenderData!}/>}
          </SimpleGrid>
        }
      </Modal>
  )
}

export default GenderModal;