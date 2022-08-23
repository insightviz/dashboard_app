import { useState, useEffect } from "react";
import { Select } from "@geist-ui/core/";
import Chart from '../Chart/Chart';
import { allForceOptions, allEthnicityOptions, months } from '../../../Asset/Constants';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Controller.css"
import { ChevronDown, ChevronUp, Info, Minus } from '@geist-ui/icons'


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
 
  return (
    <div>
      <div className="force-select">
        <span>Police force:</span>
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
      <div className="month-select">
        <span>Month:</span>
        <DatePicker
          selected={startDate}
          onChange={handleMonthChange}
          dateFormat="MMMM yyyy"
          wrapperClassName="datePicker"
          includeDates={availableMonths}
          showMonthYearPicker
        />
      </div>
      {
        isForceLoading || isMonthsLoading || isView1DataLoading ? 
        <div>loading...</div> : 
        <div className="view1">
          <div className="monthly-stop-search-figure">
            <div className="figure-title">
              <span>Number of stop and searches in {months[startDate.getMonth()]}, {startDate.getFullYear()}</span>
              <Info/>
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
          </div>
          <Chart data={data.breakdown_by_race} title={'Monthly count of stop and searches'}/>
        </div>
      } 
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
      {
        isEthnicityLoading || isView1DataLoading || isView2DataLoading ? 
        <div>loading...</div> : 
        <div className="view2">
          <Chart data={data.breakdown_by_police_ethnicity} title={'Monthly count of stop and searches'}/>
          <Chart data={data.breakdown_of_object_of_search_by_ethnicity} title={'Monthly count of stop and searches'}/>
          <Chart data={data.breakdown_of_outcomes_by_ethnicity} title={'Monthly count of stop and searches'}/>
        </div>
      } 
    </div>
  )
}

export default DashboardController