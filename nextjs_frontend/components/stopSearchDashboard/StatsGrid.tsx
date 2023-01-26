import { Group, Paper, Text, ThemeIcon, SimpleGrid, Divider } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import ArrowDownRight from '@geist-ui/icons/arrowDownRight'
import ArrowUpRight from '@geist-ui/icons/arrowUpRight';
import Minus from '@geist-ui/icons/minus';
import { Data } from './SharedTypes';
import { getMonthsNames } from '@mantine/dates';
import { useAppThemeContext } from '../../context/AppTheme';
import { useReducedMotion, m, LazyMotion, domAnimation } from "framer-motion";
import { Dayjs } from "dayjs";

const months = getMonthsNames('en', 'MMMM');

interface StatsUIProps {
data: Data,
startDate: Dayjs,
handleTotalClick: () => void,
handleRaceChange: (race: string ) => void,
handleGenderChange: (gender: string ) => void,
force: string
}

export default function StatsGridIcons({
  data, 
  startDate,
  handleTotalClick,
  handleRaceChange,
  handleGenderChange,
  force
  } : StatsUIProps) {
  const { theme } = useAppThemeContext();
  const { width } = useViewportSize();
  const shouldReduceMotion = useReducedMotion()
  const totalStats = ({monthly_no_stop_search}: Data) => {
    const DiffIcon = monthly_no_stop_search.pct_change > 0 ? ArrowUpRight : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? Minus : ArrowDownRight;
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          whileHover={{
            scale: width < 901 ? 1 : 1.04,
            transition: { duration: width < 901 ? 0 : .2 },
          }}
          whileTap={{
            scale: width < 901 ? 0.98 : 0.95,
            transition: { duration: .1} }}>
          <Paper withBorder p="xl" radius="xl" onClick={() => handleTotalClick()} sx={(theme) => ({cursor: 'pointer'})}>
            <Group position="apart" noWrap>
              <div>
                <Text
                  color="dimmed"
                  transform="uppercase"
                  weight={700}
                  size="sm"
                >
                  {force.replace(/[-]/g, ' ')} searches in {months[startDate.month()]}, {startDate.year()}
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
            {
              width < 901 ?
              <Text size="sm" mt="md" color="dimmed">Expand +</Text> :
              <></>
            }
          </Paper>
        </m.div>
      </LazyMotion>      
    );
  };

  const raceBreakdownStats = data.breakdown_by_race.map((statItem) => {
    return (
      <LazyMotion features={domAnimation} key={statItem.ethnicity}>
        <m.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          whileHover={{
            scale: width < 901 ? 1 : statItem.ethnicity.toLowerCase() !== 'not defined' ? data.breakdown_by_race.length > 3 ? 1.04 : 1.02 : 1,
            transition: { duration: width < 901 ? 0 : .2 },
          }}
          whileTap={{
            scale: width < 901 ? statItem.ethnicity.toLowerCase() !== 'not defined' ? 0.98 : 1 : statItem.ethnicity.toLowerCase() !== 'not defined' ? 0.95 : 1,
            transition: { duration: .1} }}
          key={statItem.ethnicity}>
          <Paper withBorder p="xl" radius="xl" key={statItem.ethnicity}
            onClick={statItem.ethnicity.toLowerCase() !== 'not defined' ? () => handleRaceChange(statItem.ethnicity) : undefined }
            sx={(theme) => (statItem.ethnicity.toLowerCase() !== 'not defined' ? {cursor: 'pointer'} : {})}>
            <Group position="apart" noWrap>
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
            {
              (width < 901) && (statItem.ethnicity.toLowerCase() !== 'not defined') ?
              <Text size="sm" mt="md" color="dimmed">Expand +</Text> :
              <></>
            }
          </Paper>
        </m.div>
      </LazyMotion>
    );
  });
  
  const genderBreakdownStats = data.breakdown_by_gender.map((statItem) => {
    return (
      <LazyMotion features={domAnimation} key={statItem.gender}>
        <m.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          whileHover={{
            scale: width < 901 ? 1 : statItem.gender.toLowerCase() !== 'not defined' ? data.breakdown_by_gender.length > 3 ? 1.04 : 1.02 : 1,
            transition: { duration: width < 901 ? 0 : .2 },
          }}
          whileTap={{
            scale: width < 901 ? statItem.gender.toLowerCase() !== 'not defined' ? 0.98 : 1 : statItem.gender.toLowerCase() !== 'not defined' ? 0.95 : 1,
            transition: { duration: .1} }}
          key={statItem.gender}>
          <Paper withBorder p="xl" radius="xl" key={statItem.gender}
            onClick={statItem.gender.toLowerCase() !== 'not defined' ? () => handleGenderChange(statItem.gender) : undefined }
            sx={(theme) => (statItem.gender.toLowerCase() !== 'not defined' ? {cursor: 'pointer'} : {})}>
            <Group position="apart" noWrap>
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
            {
              (width < 901) && (statItem.gender.toLowerCase() !== 'not defined') ?
              <Text size="sm" mt="md" color="dimmed">Expand +</Text> :
              <></>
            }
          </Paper>
        </m.div>
      </LazyMotion>
    );
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : .95 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        key="stats-grid">
        <SimpleGrid cols={1} spacing='xl' breakpoints={[
          { maxWidth: 980, cols: 1, verticalSpacing: 'md' },
          { maxWidth: 755, cols: 1, verticalSpacing: 'sm' },
        ]}>
          <Divider size="lg" labelProps={{'size': '24px', weight: 700}} label="Total stop and searches" labelPosition="center" />
          <SimpleGrid cols={3} breakpoints={[{ maxWidth: 980, cols: 1 }]}>
            <div></div>
            {totalStats(data)}
          </SimpleGrid>
          <Divider size="lg" labelProps={{'size': '24px', weight: 700}} label="Breakdown by race" labelPosition="center" />
          <SimpleGrid cols={Object.keys(data.breakdown_by_race).length}
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: 'md', verticalSpacing: 'md' },
              { maxWidth: 755, cols: 2, spacing: 'sm', verticalSpacing: 'sm' },
            ]} spacing="xl">
            {raceBreakdownStats}
          </SimpleGrid>
          <Divider size="lg" labelProps={{'size': '24px', weight: 700}} label="Breakdown by gender" labelPosition="center" />
          <SimpleGrid cols={Object.keys(data.breakdown_by_gender).length}
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: 'md', verticalSpacing: 'md' },
              { maxWidth: 755, cols: 2, spacing: 'sm', verticalSpacing: 'sm' },
            ]} spacing="xl">
            {genderBreakdownStats}
          </SimpleGrid>
        </SimpleGrid>
      </m.div>
    </LazyMotion>
  );
}