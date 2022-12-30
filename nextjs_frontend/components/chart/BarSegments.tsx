import React from "react";
import { Title, SimpleGrid, Progress, Paper, Box, Text, Group } from '@mantine/core';
import { segmentsData } from '../stopSearchDashboard/SharedTypes'

interface barSegmentsProps {
  chartData: segmentsData[],
  title: string
}

function BarSegments({ chartData, title }: barSegmentsProps) {
  const colourPalete = ["blue.4", "green.4", "red.4", "yellow.4", "orange.4", "violet.4", "gray.4", "lime.4", "indigo.4", "grape.4"] 
  const colourPalete1 = ["theme.colors.blue[4]", "theme.colors.green[4]", "theme.colors.red[4]", "theme.colors.yellow[4]", "theme.colors.orange[4]", "theme.colors.violet[4]", "theme.colors.gray[4]", "theme.colors.lime[4]", "theme.colors.indigo[4]", "theme.colors.grape[4]"] 

  const segments = chartData.map((segment, index) => ({
    value: parseFloat(segment.percentage),
    color: colourPalete[index],
    label: parseFloat(segment.percentage) > 20 ? `${segment.percentage}%` : undefined,
  }));

  const descriptions = chartData.map((stat, index) => (
    <Box key={stat.label} sx={(theme) => ({ 
      borderBottom: `3px solid`,
      paddingBottom: 5, 
      borderBottomColor: eval(colourPalete1[index]) })} >
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700}>{stat.count}</Text>
        <Text color={colourPalete[index]} weight={700} size="sm" >
          {stat.percentage}%
        </Text>
      </Group>
    </Box>
  ));
  return (
    <div className="chart-container">
      <Paper withBorder p="md" radius="md">
        <Title order={3} align="center">{title}</Title>
        <Progress
          sections={segments}
          size={34}
          mt="xl"
          radius="xl"
        />
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
          {descriptions}
        </SimpleGrid>
      </Paper>
    </div>
  );
}
export default BarSegments;