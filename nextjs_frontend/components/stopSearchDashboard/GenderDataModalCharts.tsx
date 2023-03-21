import { SimpleGrid } from '@mantine/core';
import  { enhancedData } from './SharedTypes';
import dynamic from 'next/dynamic'

const BarSegments = dynamic(() => import('../chart/BarSegments'), {
  ssr: false,
})

interface genderModalChartsProps {
    gender: string,
    enhancedData: enhancedData | undefined
}

const GenderModalCharts = ({
  gender,
  enhancedData
  }: genderModalChartsProps) => {
  return (
      <SimpleGrid cols={1} spacing="xl">
        <BarSegments chartData={enhancedData!.gender_data!.breakdown_of_outcomes_by_gender} title={`Outcome of searches for ${gender.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedData!.gender_data!.breakdown_of_object_of_search_by_gender} title={`Object for search for ${gender.toLowerCase()} supspects`}/>
      </SimpleGrid>        
  )
}

export default GenderModalCharts;