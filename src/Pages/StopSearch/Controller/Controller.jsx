import { useState, useEffect, useRef } from "react";
import { Select, Spinner, Tooltip, Text } from "@geist-ui/core/";
import Chart from '../Chart/Chart';
import { allForceOptions, allEthnicityOptions, months } from '../../../Asset/Constants';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Controller.css"
import { ChevronDown, ChevronUp, Info, Minus } from '@geist-ui/icons'
import Eze from '../../../Asset/Eze.jfif'
import Brook from '../../../Asset/Brook.jfif'


const DashboardController = () => {
  const initialForce = () => localStorage.getItem("force") || 'metropolitan' 
  const [force, setForce] = useState(initialForce);
  const initialEthnicity = () => localStorage.getItem("ethnicity") || 'White' 
  const [ethnicity, setEthnicity] = useState(initialEthnicity);
  const [month, setMonth] = useState(null);
  
  const [data, setData] = useState(null);
  const [isView1DataLoading, setView1DataLoading] = useState(true);
  const [isView2DataLoading, setView2DataLoading] = useState(true);
  
  const loadData = () => {
    let forceQueryString = force
    let ethnicityQueryString = ethnicity
    let url = ''

    if (month === null) {
      url = `http://localhost:5000/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}`
    } else {
      let monthQueryString = month
      url = `http://localhost:5000/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}&month=${monthQueryString}`
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
      setData(data)
      setView1DataLoading(false)
      setView2DataLoading(false)
    });
  }
  useEffect(loadData, [force, ethnicity, month])

  const [isForceLoading, setForceLoading] = useState(true);
  const [forceSelectOptions, setForceSelectOptions] = useState([]);

  const fetchForces = () => {
    setForceLoading(true)
    fetch('http://localhost:5000/stopsearch/forces')
    .then(response => response.json())
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
  }
  
  useEffect(fetchForces, [])

  const [isEthnicityLoading, setEthnicityLoading] = useState(true);
  const [ethnicitySelectOptions, setEthnicitySelectOptions] = useState([]);

  const fetchEthnicity = () => {
    setEthnicityLoading(true)
    let forceQueryString = force
    let url = ''

    if (month === null) {
      url = `http://localhost:5000/stopsearch/ethnicity?force=${forceQueryString}`
    } else {
      let monthQueryString = month
      url = `http://localhost:5000/stopsearch/ethnicity?force=${forceQueryString}&month=${monthQueryString}`
    }
    
    fetch(url)
    .then(response => response.json())
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
  }
  
  useEffect(fetchEthnicity, [force, month])
  
  const handleForceChange = (e) => {
    setView1DataLoading(true)
    setForce(e);
    localStorage.setItem("force", e);
  }

  const handleEthnicityChange = (e) => {
    setView2DataLoading(true)
    setEthnicity(e);
    localStorage.setItem("ethnicity", e);
  }
  
  const handleMonthChange = (date) => {
    setStartDate(date)
    setView1DataLoading(true)
    setMonth(`${date.getFullYear()}-${date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1}`)
  }

  const [startDate, setStartDate] = useState();
  const [isMonthsLoading, setMonthsLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);

  const fetchMonths = () => {
    setMonthsLoading(true)
    let forceQueryString = force
    fetch(`http://localhost:5000/stopsearch/months?force=${forceQueryString}`)
    .then(response => response.json())
    .then(data => data.map((date) => new Date(date)))
    .then(data => {
      setStartDate(new Date(data.slice(-1)[0]))
      setAvailableMonths(data)
      setMonthsLoading(false)
    })
  }
  
  useEffect(fetchMonths, [force])

  const [chartWidth, setChartWidth] = useState()
  const chartRef = useRef()

  const getChartWidth = () => {
    const newChartWidth = chartRef.current.clientWidth;
    setChartWidth(newChartWidth)
  }

  useEffect(() => {
    getChartWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getChartWidth);
  }, []);
 
  return (
    <div className="stop-search-dashboard">
      <h1>UK stop and search dashboard</h1>
      <div className="select-container">
        <h2>Select options</h2>
        <div className="select-inputs">
          <span className="force-label">Police force:</span>
          <div className="force-dropdown">
            <Select
              initialValue={force}
              value={force}
              onChange={handleForceChange}
              dropdownClassName='force-dropdown'
              aria-label={'select police force data'}
              disableMatchWidth
            >
              {forceSelectOptions.map(({value, label}) =>
                <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
                )}
            </Select>
          </div>
          <span className="month-label">Month:</span>
          <DatePicker
            selected={startDate}
            onChange={handleMonthChange}
            dateFormat="MMMM yyyy"
            wrapperClassName="datePicker"
            includeDates={availableMonths}
            showMonthYearPicker
            />
          <span className="race-label">Suspect's race:</span>
          <div className="race-dropdown">
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
      <div className="monthly-stop-search-container">
        <div className="monthly-stop-search-figure">
        {
          isForceLoading || isMonthsLoading || isView1DataLoading ? 
          <Spinner /> :
          <>
            <div className="figure-title">
              <span>Number of stop and searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}</span>
              <Tooltip text={<Text font="1.4rem">Number of stop and searches this month and percentage change compared to previous month</Text>} placement="bottomEnd">
                <Info/>
              </Tooltip>  
            </div>
            <div className="stop-search-no">
              <span className="month-stop-search">
                {data.figure_1.monthly_no_stop_search}
              </span>
              <span className={`percentage-change 
              ${data.figure_1.pct_change > 0 ? 'positive' : data.figure_1.pct_change === 0 ? '' : 'negative' }`}>
                {data.figure_1.pct_change > 0 ? <ChevronUp /> : data.figure_1.pct_change === 0 ? <Minus /> : <ChevronDown />}
                {data.figure_1.pct_change+'%'}
              </span>
            </div>
          </> 
        }
        </div>
      </div>
      <div className="charts">
        <div className="chart" ref={chartRef}>
        {
          isForceLoading || isMonthsLoading || isView1DataLoading ?
          <Spinner /> :
          <>
            <span>Stop and search count by race</span>
            <Chart data={data.breakdown_by_race} ylabel={'Stop & search count'} xlabel={"Suspect's race"} chartWidth={chartWidth}/>
          </>  
        }
        </div>
        <div className="chart">
        {
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>Breakdown of {ethnicity.toLowerCase()} suspects by officer's race</span>
            <Chart data={data.breakdown_by_police_ethnicity} ylabel={'Stop & search count'} xlabel={'Race of officer conducting stop & search'} chartWidth={chartWidth}/>
          </>  
        }
        </div>
        <div className="chart">
        {
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>Breakdown of {ethnicity.toLowerCase()} suspects by object of search</span>
            <Chart data={data.breakdown_of_object_of_search_by_ethnicity} ylabel={'Stop & search count'} xlabel={'Object for stop & search'} chartWidth={chartWidth}/>
          </>  
        }      
        </div>        
        <div className="chart">
        {
          isEthnicityLoading || isView1DataLoading || isView2DataLoading ?
          <Spinner /> :
          <>
            <span>Breakdown of {ethnicity.toLowerCase()} suspects by outcomes</span>
            <Chart data={data.breakdown_of_outcomes_by_ethnicity} ylabel={'Stop & search count'} xlabel={'Outcome of stop & search'} chartWidth={chartWidth}/>
          </>  
        }
        </div>
      </div>
      <div className="contributors">
        <h2>Contributors</h2>
        <div className="avatar-images">
          <a href="https://github.com/ezeahunanya" className="contributor-link" target="_blank" rel="noreferrer">
            <img src={Eze} alt="Avatar" className="avatar"/>
            <span>Eze Ahunanya</span>
          </a>
          <a href="https://github.com/Primebrook" className="contributor-link" target="_blank" rel="noreferrer">
            <img src={Brook} alt="Avatar" className="avatar"/>
            <span>Brook Abraha</span>
          </a>
        </div>
      </div> 
    </div>
  )
}

export default DashboardController