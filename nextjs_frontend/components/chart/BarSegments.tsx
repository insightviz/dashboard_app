import React from "react";
import { Title, SimpleGrid, Progress, Paper, Box, Text, Group } from '@mantine/core';
import { segmentsData } from '../stopSearchDashboard/SharedTypes';
import { useElementSize  } from '@mantine/hooks';
import { useAppThemeContext } from '../../context/AppTheme';
import styles from './ChartStyles.module.css'

interface barSegmentsProps {
  chartData: segmentsData[],
  title: string
}

function BarSegments({ chartData, title }: barSegmentsProps) {
  const { ref, width } = useElementSize();
  const { theme } = useAppThemeContext();
  const colourPaleteLight = ["primaryBlue.9", "primaryBlue.8", "primaryBlue.7", "primaryBlue.6", "primaryBlue.5", "primaryBlue.4", "primaryBlue.3", "primaryBlue.2", "primaryBlue.1", "primaryBlue.0"] 
  const colourPaleteLight1 = ["Theme.colors.primaryBlue[9]", "Theme.colors.primaryBlue[8]", "Theme.colors.primaryBlue[7]", "Theme.colors.primaryBlue[6]", "Theme.colors.primaryBlue[5]", "Theme.colors.primaryBlue[4]", "Theme.colors.primaryBlue[3]", "Theme.colors.primaryBlue[2]", "Theme.colors.primaryBlue[1]", "Theme.colors.primaryBlue[0]"] 
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
    <Paper withBorder p={32} radius="xl" className={styles.barSegment} ref={ref}>
      <Title order={3} size={16} weight={700} lh={1} mb={8} align="left" transform="uppercase" color="supportCoolGrey.4">{title}</Title>
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
  );
}
export default BarSegments;