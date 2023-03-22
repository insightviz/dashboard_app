import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex } from '@mantine/core';
import RaceModalCharts from './RaceDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { getMonthsNames } from '@mantine/dates';
import { Dayjs } from 'dayjs';
import { useReducedMotion, useViewportSize } from '@mantine/hooks';
import { useAppThemeContext } from '../../context/AppTheme';

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
  const { width } = useViewportSize()
  const { enhancedData, enhancedDataError } = FetchEnhancedRaceData(force, race, month)
  const { theme } = useAppThemeContext();
  return (
    <Modal
      opened={raceModalOpen}
      onClose={() => openRaceModal(false)}
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
        <Title order={1} size={20} weight={700} align="left" color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'}>{sentenceCase(force.replace(/[-]/g, ' '))} police searches in {months[datePickerDate.month()]}, {datePickerDate.year()}</Title>
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
           <RaceModalCharts enhancedData={enhancedData} race={race}/>}
        </SimpleGrid>
      }
    </Modal>
  )
}

export default RaceModal;