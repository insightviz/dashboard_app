import { Modal, SimpleGrid, } from '@mantine/core';
import testData from "./data";
import { useState } from 'react';
import BarSegments from "../chart/BarSegments"

interface ethnicityModalProps {
    raceModalOpen: boolean,
    setRaceModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    race: string
}

const RaceModal = ({raceModalOpen, setRaceModalOpen, race}: ethnicityModalProps) => {
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
        opened={raceModalOpen}
        onClose={() => setRaceModalOpen(false)}
        fullScreen
        zIndex={999}
      >
        {
          <SimpleGrid cols={2} 
          breakpoints={[
            { maxWidth: 980, cols: 1, spacing: 'sm', verticalSpacing: 'sm' },
          ]} spacing="xl">
            <BarSegments chartData={testData.ethnicity_data.breakdown_by_police_ethnicity} title={`Race of police officer conducting searches for ${race.toLowerCase()} supspects`}/>
            <BarSegments chartData={testData.ethnicity_data.breakdown_of_outcomes_by_ethnicity} title={`Outcome of searches for ${race.toLowerCase()} supspects`}/>
            <BarSegments chartData={testData.ethnicity_data.breakdown_of_object_of_search_by_ethnicity} title={`Object for search for ${race.toLowerCase()} supspects`}/>
          </SimpleGrid>
        }
      </Modal>
  )
}

export default RaceModal;