import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex, useMantineTheme  } from '@mantine/core';
import GenderModalCharts from './GenderDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';
import { Dayjs } from 'dayjs';
import { useReducedMotion, useViewportSize } from '@mantine/hooks';

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
  const { width } = useViewportSize()
  const { enhancedData, enhancedDataError } = FetchEnhancedGenderData(force, gender, month)
  return (
      <Modal
        opened={genderModalOpen}
        onClose={() => openGenderModal(false)}
        zIndex={999}
        transition={shouldReduceMotion ? undefined : 'fade'}
        transitionDuration={shouldReduceMotion ? 0 : 400}
        size={1000}
        padding={width<600 ? 16 : 32}
        fullScreen={ width<1000 ? width !== 0 ? true : false : false}
        overlayBlur={3}
        overlayOpacity={0.7}
      >
        {          
          <SimpleGrid cols={1} spacing="xl">
            <Title order={1} size={24} weight={400} align="left" color="supportCoolGrey.9">{sentenceCase(force.replace(/[-]/g, ' '))} police searches in {months[datePickerDate.month()]}, {datePickerDate.year()}</Title>
            {enhancedDataError ? 
            <Paper withBorder p="xl" radius="xl">
              <Text
                color="dimmed"
                transform="uppercase"
                weight={700}
                size="md"
              >
                {enhancedDataError.message} 
              </Text>
              {
                enhancedDataError.status ?
                <Text
                  color="dimmed"
                  transform="uppercase"
                  weight={700}
                  size="md"
                >
                  Status code: {enhancedDataError.status} 
                </Text>
                :
                undefined
              }
              {
                enhancedDataError.info ?
                <Text
                  color="dimmed"
                  transform="uppercase"
                  weight={700}
                  size="md"
                >
                  Error: {enhancedDataError.info.message}
                </Text>
                :
                undefined
              }
            </Paper>
             :
            !enhancedData ?
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