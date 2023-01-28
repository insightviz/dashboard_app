import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex } from '@mantine/core';
import GenderModalCharts from './GenderDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';
import { Dayjs } from 'dayjs';
import { useReducedMotion } from '@mantine/hooks';

const FetchEnhancedGenderData = (await import('./dashboardHooks/FetchEnhancedGenderData')).default

const months = getMonthsNames('en', 'MMMM');

interface genderModalProps {
    genderModalOpen: boolean,
    openGenderModal: (e: boolean) => void,
    gender: string,
    month: string,
    force: string,
    datePickerDate: Dayjs
}

const GenderModal = ({
  genderModalOpen, 
  openGenderModal, 
  gender,
  month,
  force,
  datePickerDate}: genderModalProps) => {
  const shouldReduceMotion = useReducedMotion()
  const { enhancedData, isEnhancedDataLoading, enhancedDataError } = FetchEnhancedGenderData(force, gender, month)
  return (
      <Modal
        opened={genderModalOpen}
        onClose={() => openGenderModal(false)}
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
            <GenderModalCharts gender={gender} enhancedData={enhancedData}/>}
          </SimpleGrid>
        }
      </Modal>
  )
}

export default GenderModal;