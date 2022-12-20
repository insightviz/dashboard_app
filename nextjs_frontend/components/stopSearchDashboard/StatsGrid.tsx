import { Group, Paper, Text, ThemeIcon, SimpleGrid, Divider } from '@mantine/core';
import { ArrowDownRight, ArrowUpRight, Minus } from '@geist-ui/icons';
import { Data } from './SharedTypes'
import { getMonthsNames } from '@mantine/dates';
import { useAppThemeContext } from '../../context/AppTheme';

const months = getMonthsNames('en', 'MMMM');

interface StatsUIProps {
data: Data,
startDate: Date,
setTotalModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function StatsGridIcons( {data, startDate, setTotalModalOpened } : StatsUIProps) {
  const { theme } = useAppThemeContext();
  const totalStats = ({monthly_no_stop_search}: Data) => {
    const DiffIcon = monthly_no_stop_search.pct_change > 0 ? ArrowUpRight : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? Minus : ArrowDownRight;
    return (
      <Paper withBorder p="xl" radius="xl" onClick={() => setTotalModalOpened(true)}>
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="sm"
            >
              Searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}
            </Text>
            <Text weight={700} size={32}>
              {monthly_no_stop_search.monthly_no_stop_search}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: monthly_no_stop_search.pct_change > 0 ? theme.colors.teal[6] : monthly_no_stop_search.pct_change == 0 || monthly_no_stop_search.pct_change === 'N/A' ? theme.colors.gray[6] : theme.colors.red[6] })}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} />
          </ThemeIcon>
        </Group>
        {
        monthly_no_stop_search.pct_change === 'N/A' ?
        <Text color="dimmed" size="sm" mt="md">
          No data for previous month
        </Text>
        :
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={monthly_no_stop_search.pct_change > 0 ? 'teal' : monthly_no_stop_search.pct_change == 0 ? 'gray' : 'red'} weight={700}>
            {monthly_no_stop_search.pct_change}%
          </Text>{' '}
          {monthly_no_stop_search.pct_change > 0 ? 'increase' : monthly_no_stop_search.pct_change === 0 ? 'no change' : 'decrease'} compared to last month
        </Text>
        }
      </Paper>
    );
  };
  const raceBreakdownStats = data.breakdown_by_race.map((statItem) => {
    const DiffIcon = statItem.percentage > 0 ? ArrowUpRight : ArrowDownRight;
    return (
      <Paper withBorder p="xl" radius="xl" key={statItem.ethnicity}>
        <Group position="apart">
          <Text
            color="dimmed"
            transform="uppercase"
            weight={700}
            size="xs"
          >
            {statItem.ethnicity}
          </Text>
          <Text weight={700} size="xl">
            {statItem.no_of_stop_and_searches}
          </Text>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={ theme == 'light' ? 'black' : '#C1C2C5'} weight={700}>
            {statItem.percentage}%
          </Text>{' '}
          of total stop and searches
        </Text>
      </Paper>
    );
  });
  
  const genderBreakdownStats = data.breakdown_by_gender.map((statItem) => {
    const DiffIcon = statItem.percentage > 0 ? ArrowUpRight : ArrowDownRight;
    return (
      <Paper withBorder p="xl" radius="xl" key={statItem.gender}>
        <Group position="apart">
          <Text
            color="dimmed"
            transform="uppercase"
            weight={700}
            size="xs"
          >
            {statItem.gender}
          </Text>
          <Text weight={700} size="xl">
            {statItem.no_of_stop_and_searches}
          </Text>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={ theme == 'light' ? 'black' : '#C1C2C5'} weight={700}>
            {statItem.percentage}%
          </Text>{' '}
          of total stop and searches
        </Text>
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={1} spacing='xl' breakpoints={[
      { maxWidth: 980, cols: 1, verticalSpacing: 'md' },
      { maxWidth: 755, cols: 1, verticalSpacing: 'sm' },
    ]}>
      <Divider size="lg" labelProps={{'size': 'xl'}} label="Total stop and searches" labelPosition="center" />
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 980, cols: 1 }]}>
        <div></div>
        {totalStats(data)}
      </SimpleGrid>
      <Divider size="lg" labelProps={{'size': 'xl'}} label="Breakdown by race" labelPosition="center" />
      <SimpleGrid cols={Object.keys(data.breakdown_by_race).length} 
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md', verticalSpacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm', verticalSpacing: 'sm' },
        ]} spacing="xl">
        {raceBreakdownStats}
      </SimpleGrid>
      <Divider size="lg" labelProps={{'size': 'xl'}} label="Breakdown by gender" labelPosition="center" />
      <SimpleGrid cols={Object.keys(data.breakdown_by_gender).length} 
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md', verticalSpacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm', verticalSpacing: 'sm' },
        ]} spacing="xl">
        {genderBreakdownStats}
      </SimpleGrid>
    </SimpleGrid>
  );
}