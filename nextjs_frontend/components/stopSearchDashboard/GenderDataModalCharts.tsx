import { SimpleGrid } from '@mantine/core';
import  { enhancedData } from './SharedTypes';
import BarSegments from "../chart/BarSegments"

interface genderModalChartsProps {
    gender: string,
    enhancedGenderData: enhancedData
}

const GenderModalCharts = ({
  gender,
  enhancedGenderData
  }: genderModalChartsProps) => {
  return (
      <SimpleGrid cols={2} 
        breakpoints={[
          { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
        ]} spacing="xl">
        <BarSegments chartData={enhancedGenderData!.gender_data!.breakdown_of_outcomes_by_gender} title={`Outcome of searches for ${gender.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedGenderData!.gender_data!.breakdown_of_object_of_search_by_gender} title={`Object for search for ${gender.toLowerCase()} supspects`}/>
      </SimpleGrid>        
  )
}

export default GenderModalCharts;