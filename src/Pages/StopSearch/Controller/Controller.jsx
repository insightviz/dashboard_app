import { useState, useEffect } from "react";
import View1 from '../View1/View1';
import { Select } from "@geist-ui/core/";

const DashboardController = () => {
  const initialForce = () => { return (localStorage.getItem("force")) || 'avon-and-somerset' }
  const [force, setForce] = useState(initialForce);
  const initialEthnicity = () => { return (localStorage.getItem("ethnicity")) || {'value': 'White'} }
  const [ethnicity, setEthnicity] = useState(initialEthnicity);
  
  const [data, setData] = useState(null);
  const [isDataLoading, setDataLoading] = useState(true);
  
  const loadData = () => {
    setDataLoading(true)

    let forceQueryString = force
    let ethnicityQueryString = ethnicity
    let url = `http://localhost:5000/stopsearch/data?force=${forceQueryString}&ethnicity=${ethnicityQueryString}`
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
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
      setSelectOptions(data)
      setForceLoading(false)
    })
  }
  
  useEffect(fetchForces, [])
  
  const handleForceChange = (e) => {
    setForce(e)
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
          {selectOptions.map((element) => 
            <Select.Option key={element.value} value={element.value} aria-label={element.label}>{element.label}</Select.Option>
          )}
      </Select>
      {(isDataLoading || isForceLoading) ? <div>loading...</div> : <View1 data={data}/>}           
    </div>
  )
}

export default DashboardController