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
import { Title } from '@mantine/core';


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


function LineChart({ chartData, title, months }: lineChartProps) {
  return (
    <div className="chart-container">
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
                  if (months <= 12) {
                    return this.getLabelForValue(val)
                  } else if (months <= 24) {
                    // Hide every 2nd tick label
                    return index % 2 === 0 ? this.getLabelForValue(val) : null;
                  } else {
                    return index % 3 === 0 ? this.getLabelForValue(val) : null;
                  }            
              }
            }}
          }
        }}
      />
    </div>
  );
}
export default LineChart;