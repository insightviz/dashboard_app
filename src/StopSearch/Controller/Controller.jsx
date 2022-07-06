import { useState, useEffect } from "react";
import View1 from '../View1/View1';
import Select from 'react-select';


const DashboardController = () => {
  const [force, setForce] = useState([]);
  const [data, setData] = useState(null);
  const [isDataLoading, setDataLoading] = useState(true);
  
  const loadData = () => {
    setDataLoading(true)
    let url = ''

    if (force.length === 0) {
      url = 'http://localhost:5000/stopsearch'
    } else {
      let queryString = force.map(({ value, label}) => ( [value] )).toString()
      console.log(queryString)
      url = `http://localhost:5000/stopsearch?force=${queryString}`
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setData(data)
      setDataLoading(false)
    });
  }
  useEffect(loadData, [force])

  
  const [isForceLoading, setForceLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState([]);
  
  const fetchForces = () => {
    setForceLoading(true)
    fetch('https://data.police.uk/api/forces')
    .then(response => response.json())
    .then(data => data.map(({ id, name}) => ({ 'value': id, 'label': name })))
    .then(data => {
      console.log(data)
      setSelectOptions(data)
      setForceLoading(false)
    })
  }
  
  useEffect(fetchForces, [])
  
  const handleForceChange = (e) => {
    setForce(e)
  }
  if (isDataLoading || isForceLoading) {
    return (      
      <div>
        <Select options={selectOptions} onChange={handleForceChange} isMulti/>
        <div>loading...</div>
      </div>
      )
  }
  else {
    return (
      <div>
        <Select options={selectOptions} onChange={handleForceChange} isMulti/>
        <View1 data={data}/>
      </div>
    )
  }
}

export default DashboardController