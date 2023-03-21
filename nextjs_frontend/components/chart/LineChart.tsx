import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Colors 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Title, Paper } from '@mantine/core';
import { useElementSize, useViewportSize } from '@mantine/hooks';
import styles from './ChartStyles.module.css'
import { useAppThemeContext } from '../../context/AppTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Colors 
);

interface lineChartProps {
  chartData: any,
  title: string,
  months: number
}

ChartJS.defaults.font.size = 16;
ChartJS.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
ChartJS.defaults.font.weight = '400';

function LineChart({ chartData, title, months}: lineChartProps) {
  const { theme } = useAppThemeContext();
  ChartJS.defaults.color = theme=='dark' ? "#9AA5B1" : "#7B8794";
  const { ref, width } = useElementSize();
  const { width: viewWidth } = useViewportSize()
  return (
    <Paper p={viewWidth<600 ? 16 : 32} radius="xl" className={styles.chart} ref={ref}>
      <Title order={3} size={16} weight={700} lh={1} mb={8} align="left" transform="uppercase" color="supportCoolGrey.4">{title}</Title>
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