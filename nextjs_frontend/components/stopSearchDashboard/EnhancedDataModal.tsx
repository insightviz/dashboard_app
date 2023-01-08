import { Modal, Loader, Paper, Text, Title, SimpleGrid, Flex, Radio } from '@mantine/core';
import  { enhancedData, error } from './SharedTypes';
import  OverallDataModalCharts from './OverallDataModalCharts';
import { sentenceCase } from "../../assets/UtilFunctions"

interface stopSearchModalProps {
    totalModalOpened: boolean,
    setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    enhancedOverallData: enhancedData,
    isEnhancedDataLoading: boolean,
    modalError: error,
    force: string,
    monthSliderValue: string,
    handleMonthSliderChange: (e: string) => void
}

const StopSearchModal = ({
  totalModalOpened, 
  setTotalModalOpened,
  enhancedOverallData,
  isEnhancedDataLoading,
  modalError,
  force,
  monthSliderValue,
  handleMonthSliderChange}: stopSearchModalProps) => {

  return (
      <Modal
        opened={totalModalOpened}
        onClose={() => setTotalModalOpened(false)}
        fullScreen
        zIndex={999}
      >
        {
          <SimpleGrid cols={1} spacing="xl">
            <Title order={1} align="center">{sentenceCase(force.replace(/[-]/g, ' '))} police stop and searches over previous {monthSliderValue} months</Title>
            <Flex
              justify="center"
            >
              <Radio.Group
                value={monthSliderValue}
                onChange={(e) => handleMonthSliderChange(e)}
                name="monthSliderValue"
                label="Select number of months:"
                >
                <Radio value="12" label="12 months" />
                <Radio value="24" label="24 months" />
                <Radio value="36" label="36 months" />
              </Radio.Group>
            </Flex>
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
            <Flex
              mih={500}
              justify="center"
              align="center"
              direction="column"
            >
              <Loader variant="bars" size='md' />
            </Flex> :
            <OverallDataModalCharts
              enhancedOverallData={enhancedOverallData}
              monthSliderValue={monthSliderValue}  
            />}
          </SimpleGrid>           
        }
      </Modal>
  )
}

export default StopSearchModal;