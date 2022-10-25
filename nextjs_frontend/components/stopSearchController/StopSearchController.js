import { useState, useEffect, useRef } from "react";
import { Select, Spinner, Tooltip, Text } from "@geist-ui/core/";
import { allForceOptions, allEthnicityOptions, months } from '../../assets/Constants';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import styles from "./StopSearchController.module.css";
import { ChevronDown, ChevronUp, Info, Minus } from '@geist-ui/icons';
import { setCookie } from  'cookies-next';
//import ReactGA from "react-ga4";
import dynamic from 'next/dynamic'
import Image from 'next/image'

const Chart = dynamic(() => import('../chart/Chart'), {
    ssr: false
})

const fetchDataFromBackend = (url, parameters) => {

};

const StopSearchDashboardController = ({savedForce, savedEthnicity}) => { 
  const [force, setForce] = useState(savedForce);
  const [ethnicity, setEthnicity] = useState(savedEthnicity);
  const [month, setMonth] = useState(null);
  
  const [data, setData] = useState(null);
  const [isView1DataLoading, setView1DataLoading] = useState(true);
  const [isView2DataLoading, setView2DataLoading] = useState(true);
  const [error, setError] = useState({'error': false, 'message': null})
  
  //useEffect(() => {
  //  ReactGA.send("pageview");
  //}, [])
  
  const loadData = () => {
    let forceQueryString = force
    let ethnicityQueryString = ethnicity
    let url = ''

    if (month === null) {
      url = `/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}`
    } else {
      let monthQueryString = month
      url = `/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}&month=${monthQueryString}`
    }
    
    fetch(url)
    .then(response => {
      if (!response.ok) {  
        if (response.status === 404) {
          throw new Error(`Status: ${response.status}, Message: Data for ${force.replace("-", " ")} police force ${response.statusText}`); 
        }
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setData(data)
      setView1DataLoading(false)
      setView2DataLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }

  useEffect(loadData, [force, ethnicity, month])

  const [isForceLoading, setForceLoading] = useState(true);
  const [forceSelectOptions, setForceSelectOptions] = useState([]);

  const fetchForces = () => {
    setForceLoading(true)
    fetch('/stopsearch/forces')
    .then(response => {
      if (!response.ok) {  
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`); 
      }
      return response.json();
    })
    .then(data => {
      let forceSelectOptions = []
      allForceOptions.forEach(element => {
        if (data.includes(element.value)) {
          forceSelectOptions.push(element)
        }        
      }); 
      setForceSelectOptions(forceSelectOptions)
      setForceLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }
  
  useEffect(fetchForces, [])

  const [isEthnicityLoading, setEthnicityLoading] = useState(true);
  const [ethnicitySelectOptions, setEthnicitySelectOptions] = useState([]);

  const fetchEthnicity = () => {
    setEthnicityLoading(true)
    let forceQueryString = force
    let url = ''

    if (month === null) {
      url = `/stopsearch/ethnicity?force=${forceQueryString}`
    } else {
      let monthQueryString = month
      url = `/stopsearch/ethnicity?force=${forceQueryString}&month=${monthQueryString}`
    }
    
    fetch(url)
    .then(response => {
      if (!response.ok) {  
        if (response.status === 404) {
          throw new Error(`Status: ${response.status}, Message: Data for ${force.replace("-", " ")} police force ${response.statusText}`); 
        }
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      let ethnicitySelectOptions = []
      allEthnicityOptions.forEach(element => {
        if (data.includes(element.value)) {
          ethnicitySelectOptions.push(element)
        }        
      }); 
      setEthnicitySelectOptions(ethnicitySelectOptions)
      setEthnicityLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }
  
  useEffect(fetchEthnicity, [force, month])
  
  const handleForceChange = (e) => {
    if (e!=force) {
      setView1DataLoading(true);
      setMonth(null);
      setForce(e);
      setError({'error': false, 'message': null});
      setCookie('insightStopSearchForce', e);
      //ReactGA.event({
      //  category: "force change",
      //  action: "change force select",
      //  label: e,
      //});
    }
  }

  const handleEthnicityChange = (e) => {
    if (e!=ethnicity) {
      setView2DataLoading(true)
      setEthnicity(e);
      setError({'error': false, 'message': null});
      setCookie('insightStopSearchEthnicity', e);
      //ReactGA.event({
      //  category: "ethnicity change",
      //  action: "change ethnicity select",
      //  label: e,
      //});
    }
  }
  
  const handleMonthChange = (date) => {
    setStartDate(date)
    setView1DataLoading(true)
    setMonth(`${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`)
    setError({'error': false, 'message': null});
    //ReactGA.event({
    //  category: "month change",
    //  action: "change month select",
    //  label: `${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`,
    //});
  }

  const [startDate, setStartDate] = useState();
  const [isMonthsLoading, setMonthsLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);

  const fetchMonths = () => {
    setMonthsLoading(true)
    let forceQueryString = force
    fetch(`/stopsearch/months?force=${forceQueryString}`)
    .then(response => {
      if (!response.ok) {  
        throw new Error(`Status: ${response.status}, Message: ${response.statusText}`); 
      }
      return response.json();
    })
    .then(data => data.map((date) => new Date(date)))
    .then(data => {
      setStartDate(new Date(data.slice(-1)[0]))
      setAvailableMonths(data)
      setMonthsLoading(false)
    })
    .catch((err) => {
      setError({'error': true, 'message': err.message});
    })
  }
  
  useEffect(fetchMonths, [force])

  const [showChartTickLabels, setChartTickLabels] = useState()
  const chartRef = useRef()

  const getChartWidth = () => {
    if (chartRef.current) {
      const newChartWidth = chartRef.current.clientWidth;
      setChartTickLabels(newChartWidth > 550);
    }
  }

  useEffect(() => {
    getChartWidth();
    window.addEventListener("resize", getChartWidth);
    return () => {
      window.removeEventListener("resize", getChartWidth);
    };
  }, []);

  return (
    <div className={styles.stopSearchDashboard}>
      <h1>UK stop and search dashboard</h1>
      <div className={styles.selectContainer}>
        <h2>Select options</h2>
        <div className={styles.selectInputs}>
          <span className={styles.forceLabel}>Police force:</span>
          <div className={styles.forceDropdown}>
            <Select
              initialValue={force}
              value={force}
              onChange={handleForceChange}
              dropdownClassName={styles.forceDropdown}
              aria-label={'select police force data'}
              disableMatchWidth
            >
              {forceSelectOptions.map(({value, label}) =>
                <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
                )}
            </Select>
          </div>
          <span className={styles.monthLabel}>Month:</span>
          <div className={styles.monthPicker}>
            <DatePicker
              views={['year', 'month']}
              openTo="year"
              minDate={availableMonths[0]}
              maxDate={availableMonths.slice(-1)[0]}
              value={startDate}
              onChange={handleMonthChange}
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </div>
          <span className={styles.raceLabel}>{"Suspect's race:"}</span>
          <div className={styles.raceDropdown}>
            <Select 
              initialValue={ethnicity}
              value={ethnicity}
              onChange={handleEthnicityChange}
              dropdownClassName='ethnicity-dropdown'
              aria-label={'select police ethnicity data'}
              >
              {ethnicitySelectOptions.map(({value, label}) => 
                <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
                )}
            </Select>   
          </div>
        </div>
      </div>
      <div className={styles.monthlyStopSearchContainer}>
        <div className={styles.monthlyStopSearchFigure}>
        {
          error.error ? 
          <>{error.message}</> :
          isForceLoading || isMonthsLoading || isView1DataLoading ? 
          <Spinner /> :
          <>
            <div className={styles.figureTitle}>
              <span>Number of stop and searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}</span>
              <Tooltip text={<Text font="1.4rem">Number of stop and searches this month and percentage change compared to previous month</Text>} placement="bottomEnd">
                <Info/>
              </Tooltip>  
            </div>
            <div className={styles.stopSearchNo}>
              <span className="month-stop-search">
                {data.figure_1.monthly_no_stop_search}
              </span>
              <span className={`${styles.percentageChange} 
              ${data.figure_1.pct_change > 0 ? styles.positive : data.figure_1.pct_change === 0 || data.figure_1.pct_change === 'N/A' ? '' : styles.negative }`}>
                {data.figure_1.pct_change > 0 ? <ChevronUp /> : data.figure_1.pct_change === 0 || data.figure_1.pct_change === 'N/A' ? <Minus /> : <ChevronDown />}
                {data.figure_1.pct_change > 0 ? data.figure_1.pct_change+'%' : data.figure_1.pct_change === 0 || data.figure_1.pct_change === 'N/A' ? data.figure_1.pct_change : data.figure_1.pct_change+'%'}
              </span>
            </div>
          </> 
        }
        </div>
      </div>
      <div className={styles.charts}>
        <div className={styles.chart} ref={chartRef}>
        {
          error.error ? 
          <>{error.message}</> :
          isForceLoading || isMonthsLoading || isView1DataLoading ?
          <Spinner /> :
          <>
            <span>Stop and search count by race</span>
            <Chart data={data.breakdown_by_race} ylabel={'Stop & search count'} xlabel={"Suspect's race"} showChartTickLabels={showChartTickLabels}/>
          </>  
        }
        </div>
        <div className={styles.chart}>
        {
          error.error ? 
          <>{error.message}</> :
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>{`Breakdown of ${ethnicity.toLowerCase()} suspects by officer's race`}</span>
            <Chart data={data.breakdown_by_police_ethnicity} ylabel={'Stop & search count'} xlabel={'Race of officer conducting stop & search'} showChartTickLabels={showChartTickLabels}/>
          </>  
        }
        </div>
        <div className={styles.chart}>
        {
          error.error ? 
          <>{error.message}</> :
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>Breakdown of {ethnicity.toLowerCase()} suspects by object of search</span>
            <Chart data={data.breakdown_of_object_of_search_by_ethnicity} ylabel={'Stop & search count'} xlabel={'Object for stop & search'} showChartTickLabels={showChartTickLabels}/>
          </>  
        }      
        </div>        
        <div className={styles.chart}>
        {
          error.error ? 
          <>{error.message}</> :
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>Breakdown of {ethnicity.toLowerCase()} suspects by outcomes</span>
            <Chart data={data.breakdown_of_outcomes_by_ethnicity} ylabel={'Stop & search count'} xlabel={'Outcome of stop & search'} showChartTickLabels={showChartTickLabels}/>
          </>  
        }
        </div>
      </div>
      <div className={styles.contributors}>
        <h2>Contributors</h2>
        <div className={styles.avatarImages}>
          <a href="https://github.com/ezeahunanya" className="contributor-link" target="_blank" rel="noreferrer">
            <Image src='https://avatars.githubusercontent.com/u/57296341?v=4' layout="fixed" width={65} height={65} quality={100} alt="Avatar" className={styles.avatar}/>
            <span>Eze Ahunanya</span>
          </a>
          <a href="https://github.com/Primebrook" className="contributor-link" target="_blank" rel="noreferrer">
            <Image src='https://avatars.githubusercontent.com/u/71849503?v=4' layout="fixed" width={65} height={65} quality={100} alt="Avatar" className={styles.avatar}/>
            <span>Brook Abraha</span>
          </a>
        </div>
      </div> 
    </div>
  )
}

export default StopSearchDashboardController;