import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as TitleJS,
  Tooltip,
  Legend,
  TimeScale,
  Colors 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Title, Paper } from '@mantine/core';
import { useElementSize  } from '@mantine/hooks';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TitleJS,
  Tooltip,
  Legend,
  TimeScale,
  Colors 
);

interface lineChartProps {
  chartData: any,
  title: string,
  months: number
}


function LineChart({ chartData, title, months}: lineChartProps) {
  const { ref, width } = useElementSize();
  return (
    <Paper withBorder p="md" radius="md" className="chart-container" ref={ref}>
      <Title order={3} align="center">{title}</Title>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: true
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              }
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                callback: function(val, index) {
                  if (width>=600) {
                    if (months <= 12) {
                      return this.getLabelForValue(Number(val))
                    } else if (months <= 24) {
                      // Hide every 2nd tick label
                      return index % 2 === 0 ? this.getLabelForValue(Number(val)) : null;
                    } else {
                      return index % 3 === 0 ? this.getLabelForValue(Number(val)) : null;
                    }
                  } else {
                    if (months <= 12) {
                      return index % 3 === 0 ? this.getLabelForValue(Number(val)) : null;
                    } else if (months <= 24) {
                      // Hide every 2nd tick label
                      return index % 6 === 0 ? this.getLabelForValue(Number(val)) : null;
                    } else {
                      return index % 8 === 0 ? this.getLabelForValue(Number(val)) : null;
                    }
                  }
              }
            }}
          }
        }}
      />
    </Paper>
  );
}
export default LineChart;