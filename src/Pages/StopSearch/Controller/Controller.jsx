import { useState, useEffect } from "react";
import { Select } from "@geist-ui/core/";
import Chart from '../Chart/Chart';
import { allForceOptions, allEthnicityOptions} from '../../../Asset/Constants';


const DashboardController = () => {
  const initialForce = () => localStorage.getItem("force") || 'metropolitan' 
  const [force, setForce] = useState(initialForce);
  const initialEthnicity = () => localStorage.getItem("ethnicity") || 'White' 
  const [ethnicity, setEthnicity] = useState(initialEthnicity);
  
  const [data, setData] = useState(null);
  const [isView1DataLoading, setView1DataLoading] = useState(true);
  const [isView2DataLoading, setView2DataLoading] = useState(true);
  
  const loadData = () => {
    let forceQueryString = force
    let ethnicityQueryString = ethnicity
    let url = `http://localhost:5000/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}`
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
      setData(data)
      setView1DataLoading(false)
      setView2DataLoading(false)
    });
  }
  useEffect(loadData, [force, ethnicity])

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
  
  return (
    <div>
      <Select 
          initialValue={force}
          value={force}
          onChange={handleForceChange}
          dropdownClassName='force-dropdown'
          aria-label={'select police force data'}
        >
          {forceSelectOptions.map(({value, label}) => 
            <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
          )}
      </Select>
      {
        isForceLoading || isView1DataLoading ? 
        <div>loading...</div> : 
        <div className="view1">
          <div className="monthly-stop-searches">
            {data.figure_1.monthly_no_stop_search}
            {data.figure_1.pct_change}
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
          {allEthnicityOptions.map(({value, label}) => 
            <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
          )}
      </Select>          
      {
        isView1DataLoading || isView2DataLoading ? 
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