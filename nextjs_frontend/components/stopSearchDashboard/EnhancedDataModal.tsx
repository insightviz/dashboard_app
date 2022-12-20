import { Modal, SimpleGrid } from '@mantine/core';
import testData from "./data";
import LineChart from "../chart/LineChart"
import { useState } from 'react';

interface stopSearchModalProps {
    totalModalOpened: boolean,
    setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const StopSearchModal = ({totalModalOpened, setTotalModalOpened}: stopSearchModalProps) => {
  console.log(testData.overall_enhanced_data.past_monthly_stop_search.map(({ x, y}) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })))
  const [totalChartData, setTotalChartData] = useState({
    datasets: [{
      label: 'Total number of stop and searches',
      data: testData.overall_enhanced_data.past_monthly_stop_search.map(({ x, y}) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
      borderWidth: 1.5,
      tension: .25
    }],
  });

  const raceSet = new Set(testData.overall_enhanced_data.past_monthly_stop_search_breakdown_by_race.map(({ race })  => race))
  const raceArr = Array.from(raceSet)
  const raceDataset = raceArr.map((race) => ({
    label: race,
    data: testData.overall_enhanced_data.past_monthly_stop_search_breakdown_by_race.filter(item => item.race == race).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25
  })    
  )
  const [raceChartData, setRaceChartData] = useState({datasets: raceDataset});
  
  const genderSet = new Set(testData.overall_enhanced_data.past_monthly_stop_search_breakdown_by_gender.map(({ gender })  => gender))
  const genderArr = Array.from(genderSet)
  const genderDataset = genderArr.map((gender) => ({
    label: gender,
    data: testData.overall_enhanced_data.past_monthly_stop_search_breakdown_by_gender.filter(item => item.gender == gender).map(({ x, y }) => ({ x: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(new Date(x)), y })),
    borderWidth: 1.5,
    tension: .25
  })    
  )
  const [genderChartData, setGenderChartData] = useState({datasets: genderDataset});

  return (
      <Modal
        opened={totalModalOpened}
        onClose={() => setTotalModalOpened(false)}
        fullScreen
        zIndex={999}
      >
        {
          <SimpleGrid cols={2} 
            breakpoints={[
              { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
            ]} spacing="xl">
            <LineChart chartData={totalChartData} title="Stop and searches over previous 12 months"/>
            <LineChart chartData={raceChartData} title="Stop and searches over previous 12 months broken down by race"/>
            <LineChart chartData={genderChartData} title="Stop and searches over previous 12 months broken down by gender"/>
          </SimpleGrid>
        }
      </Modal>
  )
}

export default StopSearchModal;