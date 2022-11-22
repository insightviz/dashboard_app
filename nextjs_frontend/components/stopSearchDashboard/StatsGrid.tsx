import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { ArrowDownRight, ArrowUpRight, Minus } from '@geist-ui/icons';
import { Data } from './sharedTypes'
import { getMonthsNames } from '@mantine/dates';
const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));
const months = getMonthsNames('en', 'MMMM');

interface StatsUIProps {
data: Data,
startDate: Date,
}

export default function StatsGridIcons( {data, startDate } : StatsUIProps) {
  const { classes } = useStyles();
  const totalStats = ({monthly_no_stop_search}: Data) => {
    const DiffIcon = monthly_no_stop_search.pct_change > 0 ? ArrowUpRight : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? Minus : ArrowDownRight;
    return (
      <Paper withBorder p="xl" radius="xl">
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="sm"
              className={classes.label}
            >
              Stop and searches
            </Text>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="sm"
              className={classes.label}
            >
              in {months[startDate.getMonth()]}, {startDate.getFullYear()}
            </Text>
            <Text weight={700} size={32}>
              {monthly_no_stop_search.monthly_no_stop_search}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: monthly_no_stop_search.pct_change > 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} />
          </ThemeIcon>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={monthly_no_stop_search.pct_change > 0 ? 'teal' : monthly_no_stop_search.pct_change == 0 ? 'grey' : 'red'} weight={700}>
            {monthly_no_stop_search.pct_change}%
          </Text>{' '}
          {monthly_no_stop_search.pct_change > 0 ? 'increase' : monthly_no_stop_search.pct_change === 0 ? 'no change' : 'decrease'} compared to last month
        </Text>
      </Paper>
    );
  };
  const raceBreakdownStats = data.breakdown_by_race.map((statItem) => {
    const DiffIcon = statItem.percentage > 0 ? ArrowUpRight : ArrowDownRight;
    return (
      <Paper withBorder p="xl" radius="xl" key={statItem.ethnicity}>
        <Group position="apart">
          <div>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="xs"
              className={classes.label}
            >
              {statItem.ethnicity}
            </Text>
            <Text weight={700} size="xl">
              {statItem.no_of_stop_and_searches}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: statItem.percentage > 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} />
          </ThemeIcon>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={statItem.percentage > 0 ? 'teal' : 'red'} weight={700}>
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
          <div>
            <Text
              color="dimmed"
              transform="uppercase"
              weight={700}
              size="xs"
              className={classes.label}
            >
              {statItem.gender}
            </Text>
            <Text weight={700} size="xl">
              {statItem.no_of_stop_and_searches}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: statItem.percentage > 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} />
          </ThemeIcon>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text component="span" color={statItem.percentage > 0 ? 'teal' : 'red'} weight={700}>
            {statItem.percentage}%
          </Text>{' '}
          of total stop and searches
        </Text>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {totalStats(data)}
      </SimpleGrid>
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {raceBreakdownStats}
      </SimpleGrid>
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {genderBreakdownStats}
      </SimpleGrid>
    </div>
  );
}