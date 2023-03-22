import { SimpleGrid, } from '@mantine/core';
import  { enhancedData } from './SharedTypes';
import dynamic from 'next/dynamic'

const BarSegments = dynamic(() => import('../chart/BarSegments'), {
  ssr: false,
})

interface raceModalChartsProps {
    race: string,
    enhancedData: enhancedData | undefined
}

const RaceModalCharts = ({
  race,
  enhancedData
  }: raceModalChartsProps) => {
  return (
      <SimpleGrid cols={1}  spacing="xl">
        <BarSegments chartData={enhancedData!.ethnicity_data!.breakdown_by_police_ethnicity} title={`Race of police officer conducting searches for ${race.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedData!.ethnicity_data!.breakdown_of_outcomes_by_ethnicity} title={`Outcome of searches for ${race.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedData!.ethnicity_data!.breakdown_of_object_of_search_by_ethnicity} title={`Object for search for ${race.toLowerCase()} supspects`}/>
      </SimpleGrid>       
  )
}

export default RaceModalCharts;