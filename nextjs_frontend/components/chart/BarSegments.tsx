import React from "react";
import { Title, SimpleGrid, Progress, Paper, Box, Text, Group } from '@mantine/core';
import { segmentsData } from '../stopSearchDashboard/SharedTypes';
import { useElementSize  } from '@mantine/hooks';
import { useAppThemeContext } from '../../context/AppTheme';

interface barSegmentsProps {
  chartData: segmentsData[],
  title: string
}

function BarSegments({ chartData, title }: barSegmentsProps) {
  const { ref, width } = useElementSize();
  const { theme } = useAppThemeContext();
  const colourPaleteLight = ["blue.4", "green.4", "red.4", "yellow.4", "orange.4", "violet.4", "gray.4", "lime.4", "indigo.4", "grape.4"] 
  const colourPaleteLight1 = ["Theme.colors.blue[4]", "Theme.colors.green[4]", "Theme.colors.red[4]", "Theme.colors.yellow[4]", "Theme.colors.orange[4]", "Theme.colors.violet[4]", "Theme.colors.gray[4]", "Theme.colors.lime[4]", "Theme.colors.indigo[4]", "Theme.colors.grape[4]"] 
  const colourPaleteDark = ["blue.5", "green.5", "red.5", "yellow.5", "orange.5", "violet.5", "gray.5", "lime.5", "indigo.5", "grape.5"] 
  const colourPaleteDark1 = ["Theme.colors.blue[5]", "Theme.colors.green[5]", "Theme.colors.red[5]", "Theme.colors.yellow[5]", "Theme.colors.orange[5]", "Theme.colors.violet[5]", "Theme.colors.gray[5]", "Theme.colors.lime[5]", "Theme.colors.indigo[5]", "Theme.colors.grape[5]"] 

  const segments = chartData.map((segment, index) => ({
    value: parseFloat(segment.percentage),
    color: theme=='dark' ? colourPaleteDark[index] : colourPaleteLight[index],
    label: width > 650 ? parseFloat(segment.percentage) > 10 ? `${segment.percentage}%` : undefined : parseFloat(segment.percentage) > 20 ? `${segment.percentage}%` : undefined,
  }));

  const descriptions = chartData.map((stat, index) => (
    <Box key={stat.label} sx={(Theme) => ({ 
      borderBottom: `3px solid`,
      paddingBottom: 5, 
      borderBottomColor: eval(theme=='dark' ? colourPaleteDark1[index] : colourPaleteLight1[index]) })} >
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700}>{stat.count}</Text>
        <Text color={theme=='dark' ? colourPaleteDark[index] : colourPaleteLight[index]} weight={700} size="sm" >
          {stat.percentage}%
        </Text>
      </Group>
    </Box>
  ));
  return (
    <div className="chart-container" ref={ref}>
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