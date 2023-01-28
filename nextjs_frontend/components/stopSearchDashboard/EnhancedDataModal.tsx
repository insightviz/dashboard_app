import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex, Radio } from '@mantine/core';
import  OverallDataModalCharts from './OverallDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"
import { useReducedMotion } from '@mantine/hooks';

const FetchEnhancedOverallData = (await import('./dashboardHooks/FetchEnhancedOverallData')).default

interface stopSearchModalProps {
    totalModalOpened: boolean,
    openTotalModal: (e: boolean) => void,
    force: string,
    monthSliderValue: string,
    handleMonthSliderChange: (e: string) => void
}

const StopSearchModal = ({
  totalModalOpened, 
  openTotalModal,
  force,
  monthSliderValue,
  handleMonthSliderChange}: stopSearchModalProps) => {
  const shouldReduceMotion = useReducedMotion()
  const { enhancedData, enhancedDataError } = FetchEnhancedOverallData(force, monthSliderValue)
  return (
    <Modal
      opened={totalModalOpened}
      onClose={() => openTotalModal(false)}
      fullScreen
      zIndex={999}
      transition={shouldReduceMotion ? undefined : 'fade'}
      transitionDuration={shouldReduceMotion ? 0 : 400}
    >
      {
        <SimpleGrid cols={1} spacing="xl">
          <Title order={1} size={32} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police stop and searches over previous {monthSliderValue} months</Title>
          <Flex
            justify="center"
          >
            <Radio.Group
              value={monthSliderValue}
              onChange={(e) => handleMonthSliderChange(e)}
              name="monthSliderValue"
              label="Select number of months:"
              spacing='md'
              >
              <Radio value="12" label="12 months" />
              <Radio value="24" label="24 months" />
              <Radio value="36" label="36 months" />
            </Radio.Group>
          </Flex>
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
          <OverallDataModalCharts
            enhancedData={enhancedData}
            monthSliderValue={monthSliderValue}  
          />}
        </SimpleGrid>           
      }
    </Modal>
  )
}

export default StopSearchModal;