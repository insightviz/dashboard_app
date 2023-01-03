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

function LineChart({ chartData, title }) {
  return (
    <div className="chart-container">
      <Title order={3} align="center">{title}</Title>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            colors: {
              enabled: true
            },
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
              }
            }
          }
        }}
      />
    </div>
  );
}
export default LineChart;