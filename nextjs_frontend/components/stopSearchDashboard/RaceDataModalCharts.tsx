import { SimpleGrid, } from '@mantine/core';
import BarSegments from "../chart/BarSegments"
import  { enhancedData } from './SharedTypes';

interface raceModalChartsProps {
    race: string,
    enhancedRaceData: enhancedData
}

const RaceModalCharts = ({
  race,
  enhancedRaceData
  }: raceModalChartsProps) => {
  return (
      <SimpleGrid cols={2} 
        breakpoints={[
          { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
        ]} spacing="xl">
        <BarSegments chartData={enhancedRaceData!.ethnicity_data!.breakdown_by_police_ethnicity} title={`Race of police officer conducting searches for ${race.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedRaceData!.ethnicity_data!.breakdown_of_outcomes_by_ethnicity} title={`Outcome of searches for ${race.toLowerCase()} supspects`}/>
        <BarSegments chartData={enhancedRaceData!.ethnicity_data!.breakdown_of_object_of_search_by_ethnicity} title={`Object for search for ${race.toLowerCase()} supspects`}/>
      </SimpleGrid>       
  )
}

export default RaceModalCharts;