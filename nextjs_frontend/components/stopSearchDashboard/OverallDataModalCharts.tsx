import { SimpleGrid } from '@mantine/core';
import LineChart from "../chart/LineChart"
import  { enhancedData } from './SharedTypes';

interface overallDataModalChartsProps {
    enhancedOverallData: enhancedData
}

const OverallDataModalCharts = ({
  enhancedOverallData
  }: overallDataModalChartsProps) => {
      
  const overallChartData = {
    datasets: [{
      label: 'Total number of stop and searches',
      data: enhancedOverallData!.overall_enhanced_data!.past_monthly_stop_search.map(({ x, y}) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
      borderWidth: 1.5,
      tension: .25
    }],
  }

  const raceSet = new Set(enhancedOverallData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_race.map(({ category })  => category))
  const raceArr = Array.from(raceSet)
  const raceDataset = raceArr.map((race) => ({
    label: race,
    data: enhancedOverallData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_race.filter(item => item.category == race).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25
  })    
  )
  
  const genderSet = new Set(enhancedOverallData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_gender.map(({ category })  => category))
  const genderArr = Array.from(genderSet)
  const genderDataset = genderArr.map((gender) => ({
    label: gender,
    data: enhancedOverallData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_gender.filter(item => item.category == gender).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25
  })    
  )

  return (
    <SimpleGrid cols={2} 
      breakpoints={[
        { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
      ]} spacing="xl">
      <LineChart chartData={overallChartData} title="Stop and searches over previous 12 months"/>
      <LineChart chartData={{datasets: raceDataset}} title="Stop and searches over previous 12 months broken down by race"/>
      <LineChart chartData={{datasets: genderDataset}} title="Stop and searches over previous 12 months broken down by gender"/>
    </SimpleGrid>      
  )
}

export default OverallDataModalCharts;