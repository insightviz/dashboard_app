import { Group, Paper, Text, Button, SimpleGrid, ThemeIcon, Flex} from '@mantine/core';
import { Data } from './SharedTypes';
import { getMonthsNames } from '@mantine/dates';
import { useAppThemeContext } from '../../context/AppTheme';
import { useReducedMotion, m } from "framer-motion";
import { Dayjs } from "dayjs";
import ArrowTrendingUp from "../../assets/svgs/arrowTrendingUp.svg";
import ArrowTrendingDown from "../../assets/svgs/arrowTrendingDown.svg";
import Minus from "../../assets/svgs/minus.svg";
import ChevronRight from "../../assets/svgs/chevronRight.svg";
import styles from "./StopSearchController.module.css";

const months = getMonthsNames('en', 'MMMM');

interface StatsUIProps {
data: Data,
datePickerDate: Dayjs,
handleTotalClick: () => void,
handleRaceChange: (race: string ) => void,
handleGenderChange: (gender: string ) => void,
force: string
}

export default function StatsGridIcons({
  data, 
  datePickerDate,
  handleTotalClick,
  handleRaceChange,
  handleGenderChange,
  force
  } : StatsUIProps) {
  const { theme } = useAppThemeContext();
  const shouldReduceMotion = useReducedMotion()
  const totalStats = ({monthly_no_stop_search}: Data) => {
    const DiffIcon = monthly_no_stop_search.pct_change > 0 ? ArrowTrendingUp : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? Minus : ArrowTrendingDown;
    return (
      <m.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}>
        <Paper p={32} radius="xl" className={styles.totalStat}>
          <Group position="apart" noWrap align="flex-end">
            <div>
              <Text
                color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'}
                transform="uppercase"
                weight={700}
                size={14} lh={1}
                className={styles.statsGridTitle}
              >
                {force.replace(/[-]/g, ' ')} police force
              </Text>
              <Text
                color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'}
                transform='uppercase'
                weight={700}
                size={14} lh={1}
                mt={8}
                className={styles.statsGridTitle}
              >
                {months[datePickerDate.month()]} {datePickerDate.year()}
              </Text>
              <Text weight={400} size={36} mt={24} lh={1} color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'}>
                {monthly_no_stop_search.monthly_no_stop_search}
              </Text>
            </div>           
            <div className={monthly_no_stop_search.pct_change > 0 ? styles.diffGroupUp : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? styles.diffGroupNoChange : styles.diffGroupDown}>
              <DiffIcon className={monthly_no_stop_search.pct_change > 0 ? styles.arrowTrendingUp : monthly_no_stop_search.pct_change === 0 || monthly_no_stop_search.pct_change === 'N/A' ? styles.minus : styles.arrowTrendingDown} />
              <Text size="sm" component="span" weight={700} lh={1.3} color={monthly_no_stop_search.pct_change > 0 ? theme=='dark' ? 'supportGreen.0' : 'supportGreen.7' : monthly_no_stop_search.pct_change == 0 ? theme=='dark' ? 'supportCoolGrey.0' : 'supportCoolGrey.7' : theme=='dark' ? 'supportRed.0' : 'supportRed.7'}>
                {monthly_no_stop_search.pct_change==="N/A" ? undefined : monthly_no_stop_search.pct_change.toString().replace('-', '') + '%'}
              </Text>
            </div>
          </Group>
          {
          monthly_no_stop_search.pct_change === 'N/A' ?
          <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} mt={24} lh={1}>
            No data for previous month
          </Text>
          :
          <></>
          }
          <Button variant={ theme=='dark' ? 'filled' : 'light'} bg={ theme=='dark' ? 'primaryBlue.6' : 'primaryBlue.1'} mt={24}  onClick={() => handleTotalClick()} fw={700} fz={14}
          rightIcon={
          <ThemeIcon 
            size={24} 
            radius="xl"  
            variant="filled"
            color={ theme=='dark' ? 'primaryBlue.5' : 'primaryBlue.2'}>
            <ChevronRight className={styles.chevronRight} />
          </ThemeIcon>
          }>
            More details
          </Button>
        </Paper>        
      </m.div>      
    );
  };

  const raceBreakdownStats = data.breakdown_by_race.map((statItem) => {
    return (
      <m.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        key={statItem.ethnicity}>
        <Paper p={32} radius="xl" key={statItem.ethnicity} className={styles.raceStat}>
          <Group position="apart" noWrap>
            <Text
              color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'}
              transform="uppercase"
              weight={700}
              size={14}
              className={styles.statsGridTitle} lh={1}
            >
              {statItem.ethnicity}
            </Text>
            <Text weight={700} size="xl" lh={1} color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'}>
              {statItem.no_of_stop_and_searches}
            </Text>
          </Group>
          <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} mt={24} lh={1}>
            <Text component="span" color={ theme == 'light' ? 'supportCoolGrey.9' : 'supportCoolGrey.1'} weight={700}>
              {statItem.percentage}%
            </Text>{' '}
            of total searches
          </Text>
          {
            statItem.ethnicity.toLowerCase() !== 'not defined' ? 
            <Button variant={ theme=='dark' ? 'filled' : 'light'} bg={ theme=='dark' ? 'primaryBlue.6' : 'primaryBlue.1'} mt={24}
            rightIcon={
              <ThemeIcon 
                size={24} 
                radius="xl"  
                variant="filled"
                color={ theme=='dark' ? 'primaryBlue.5' : 'primaryBlue.2'}>
                <ChevronRight className={styles.chevronRight} />
              </ThemeIcon>
              }
            onClick={statItem.ethnicity.toLowerCase() !== 'not defined' ? () => handleRaceChange(statItem.ethnicity) : undefined } fw={700} fz={14}>
              More details
            </Button>
             : 
            <></> 
          }
        </Paper>
      </m.div>
    );
  });
  
  const genderBreakdownStats = data.breakdown_by_gender.map((statItem) => {
    return (
      <m.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        key={statItem.gender}>
        <Paper p={32} radius="xl" key={statItem.gender} className={styles.genderStat}>
          <Group position="apart" noWrap>
            <Text
              color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'}
              transform="uppercase"
              weight={700}
              size={14}
              className={styles.statsGridTitle} lh={1}
            >
              {statItem.gender}
            </Text>
            <Text weight={700} size="xl" lh={1} color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'}>
              {statItem.no_of_stop_and_searches}
            </Text>
          </Group>
          <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} mt={24} lh={1}>
            <Text component="span" color={ theme == 'light' ? 'supportCoolGrey.9' : 'supportCoolGrey.1'} weight={700}>
              {statItem.percentage}%
            </Text>{' '}
            of total searches
          </Text>
          {
            statItem.gender.toLowerCase() !== 'not defined' ? 
            <Button variant={ theme=='dark' ? 'filled' : 'light'} bg={ theme=='dark' ? 'primaryBlue.6' : 'primaryBlue.1'} mt={24}
            rightIcon={
              <ThemeIcon 
                size={24} 
                radius="xl"  
                variant="filled"
                color={ theme=='dark' ? 'primaryBlue.5' : 'primaryBlue.2'}>
                <ChevronRight className={styles.chevronRight} />
              </ThemeIcon>
              }
            onClick={statItem.gender.toLowerCase() !== 'not defined' ? () => handleGenderChange(statItem.gender) : undefined } fw={700} fz={14}>
              More details
            </Button>
             : 
            <></> 
          }
        </Paper>
      </m.div>
    );
  });

  return (
    <m.div
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : .95 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      key="stats-grid">
      <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} weight={400} lh={1} mb={8} mt={24}>Total searches</Text>
      <Flex >
        {totalStats(data)}
      </Flex>
      <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} weight={400} lh={1} mt={32} mb={8}>Searches by race</Text>
      <SimpleGrid cols={Object.keys(data.breakdown_by_race).length}
        breakpoints={[
          { maxWidth: 1600, cols: 5, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 1400, cols: 4, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 1100, cols: 3, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 800, cols: 2, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 550, cols: 1, spacing: 'xl', verticalSpacing: 'xl' },
        ]} spacing="xl">
        {raceBreakdownStats}
      </SimpleGrid>  
      <Text color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} size={14} weight={400} lh={1} mt={32} mb={8}>Searches by gender</Text>
      <SimpleGrid cols={Object.keys(data.breakdown_by_race).length}
        breakpoints={[
          { maxWidth: 1600, cols: 5, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 1400, cols: 4, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 1100, cols: 3, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 800, cols: 2, spacing: 'xl', verticalSpacing: 'xl' },
          { maxWidth: 550, cols: 1, spacing: 'xl', verticalSpacing: 'xl' },
        ]} spacing="xl">
        {genderBreakdownStats}
      </SimpleGrid>
    </m.div>
  );
}