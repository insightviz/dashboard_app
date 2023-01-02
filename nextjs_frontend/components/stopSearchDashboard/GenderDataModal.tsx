import { Modal, SimpleGrid, } from '@mantine/core';
import testData from "./data";
import { useState } from 'react';
import BarSegments from "../chart/BarSegments"
import  { enhancedData } from './SharedTypes';

interface ethnicityModalProps {
    genderModalOpen: boolean,
    setGenderModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    gender: string,
    enhancedGenderData: enhancedData | undefined,
    isEnhancedDataLoading: boolean
}

const GenderModal = ({
  genderModalOpen, 
  setGenderModalOpen, 
  gender,
  enhancedGenderData,
  isEnhancedDataLoading}: ethnicityModalProps) => {
  const [ethnicityChartData, setEthnicityChartData] = useState({
    datasets: [{
      label: 'Total number of stop and searches',
      data: testData.overall_enhanced_data.past_monthly_stop_search.map(({ x, y}) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
      borderWidth: 1.5,
      tension: .25
    }],
  });

  return (
      <Modal
        opened={genderModalOpen}
        onClose={() => setGenderModalOpen(false)}
        fullScreen
        zIndex={999}
      >
        {
          <SimpleGrid cols={2} 
          breakpoints={[
            { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
          ]} spacing="xl">
            <BarSegments chartData={testData.gender_data.breakdown_of_outcomes_by_gender} title={`Outcome of searches for ${gender.toLowerCase()} supspects`}/>
            <BarSegments chartData={testData.gender_data.breakdown_of_object_of_search_by_gender} title={`Object for search for ${gender.toLowerCase()} supspects`}/>
          </SimpleGrid>
        }
      </Modal>
  )
}

export default GenderModal;