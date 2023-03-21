import { SimpleGrid } from '@mantine/core';
import LineChart from "../chart/LineChart"
import  { enhancedData } from './SharedTypes';

interface overallDataModalChartsProps {
    enhancedData: enhancedData | undefined,
    monthSliderValue: string
}

const colourPalette = ["#0A558C", "#003E6B", "#186FAF", "#0F609B", "#4098D7", "#2680C2", "#84C5F4", "#62B0E8", "#DCEEFB", "#B6E0FE", "#55AAD4", "#3994C1"]

const OverallDataModalCharts = ({
  enhancedData,
  monthSliderValue
  }: overallDataModalChartsProps) => {
      
  const overallChartData = {
    datasets: [{
      label: 'Total stop and searches',
      data: enhancedData!.overall_enhanced_data!.past_monthly_stop_search.map(({ x, y}) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
      borderWidth: 1.5,
      tension: .25,
      borderColor: colourPalette[1],
      backgroundColor: colourPalette[0]
    }],
  }

  const raceSet = new Set(enhancedData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_race.map(({ category })  => category))
  const raceArr = Array.from(raceSet)
  const raceDataset = raceArr.map((race, index) => ({
    label: race,
    data: enhancedData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_race.filter(item => item.category == race).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25,
    borderColor: colourPalette[index*2 + 1],
    backgroundColor: colourPalette[index*2]
  })    
  )
  
  const genderSet = new Set(enhancedData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_gender.map(({ category })  => category))
  const genderArr = Array.from(genderSet)
  const genderDataset = genderArr.map((gender, index) => ({
    label: gender,
    data: enhancedData!.overall_enhanced_data!.past_monthly_stop_search_breakdown_by_gender.filter(item => item.category == gender).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25,
    borderColor: colourPalette[index*2 + 1],  
    backgroundColor: colourPalette[index*2]  
  })    
  )

  return (
    <SimpleGrid cols={1} spacing="xl">
      <LineChart chartData={overallChartData} title={`Total`} months={Number(monthSliderValue)}/>
      <LineChart chartData={{datasets: raceDataset}} title={`Breakdown by race`} months={Number(monthSliderValue)}/>
      <LineChart chartData={{datasets: genderDataset}} title={`Breakdown by gender`} months={Number(monthSliderValue)}/>
    </SimpleGrid>      
  )
}

export default OverallDataModalCharts;