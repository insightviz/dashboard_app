import { useState, useEffect } from "react";
import View1 from '../View1/View1';
import { Select } from "@geist-ui/core/";
import Chart from '../Chart/Chart';

const forceOptions = [
  {value: 'avon-and-somerset', label: 'Avon and Somerset Constabulary'},
  {value: 'bedfordshire', label: 'Bedfordshire Police'},
  {value: 'cambridgeshire', label: 'Cambridgeshire Constabulary'},
  {value: 'cheshire', label: 'Cheshire Constabulary'},
  {value: 'city-of-london', label: 'City of London Police'},
  {value: 'cleveland', label: 'Cleveland Police'},
  {value: 'cumbria', label: 'Cumbria Constabulary'},
  {value: 'derbyshire', label: 'Derbyshire Constabulary'},
  {value: 'devon-and-cornwall', label: 'Devon & Cornwall Police'},
  {value: 'dorset', label: 'Dorset Police'},
  {value: 'durham', label: 'Durham Constabulary'},
  {value: 'dyfed-powys', label: 'Dyfed-Powys Police'},
  {value: 'essex', label: 'Essex Police'},
  {value: 'gloucestershire', label: 'Gloucestershire Constabulary'},
  {value: 'greater-manchester', label: 'Greater Manchester Police'},
  {value: 'gwent', label: 'Gwent Police'},
  {value: 'hampshire', label: 'Hampshire Constabulary'},
  {value: 'hertfordshire', label: 'Hertfordshire Constabulary'},
  {value: 'humberside', label: 'Humberside Police'},
  {value: 'kent', label: 'Kent Police'},
  {value: 'lancashire', label: 'Lancashire Constabulary'},
  {value: 'leicestershire', label: 'Leicestershire Police'},
  {value: 'lincolnshire', label: 'Lincolnshire Police'},
  {value: 'merseyside', label: 'Merseyside Police'},
  {value: 'metropolitan', label: 'Metropolitan Police Service'},
  {value: 'norfolk', label: 'Norfolk Constabulary'},
  {value: 'north-wales', label: 'North Wales Police'},
  {value: 'north-yorkshire', label: 'North Yorkshire Police'},
  {value: 'northamptonshire', label: 'Northamptonshire Police'},
  {value: 'northumbria', label: 'Northumbria Police'},
  {value: 'nottinghamshire', label: 'Nottinghamshire Police'},
  {value: 'northern-ireland', label: 'Police Service of Northern Ireland'},
  {value: 'south-wales', label: 'South Wales Police'},
  {value: 'south-yorkshire', label: 'South Yorkshire Police'},
  {value: 'staffordshire', label: 'Staffordshire Police'},
  {value: 'suffolk', label: 'Suffolk Constabulary'},
  {value: 'surrey', label: 'Surrey Police'},
  {value: 'sussex', label: 'Sussex Police'},
  {value: 'thames-valley', label: 'Thames Valley Police'},
  {value: 'warwickshire', label: 'Warwickshire Police'},
  {value: 'west-mercia', label: 'West Mercia Police'},
  {value: 'west-midlands', label: 'West Midlands Police'},
  {value: 'west-yorkshire', label: 'West Yorkshire Police'},
  {value: 'wiltshire', label: 'Wiltshire Police'}
]

const ethnicityOptions = [
  {value: 'Asian', label: 'Asian'},
  {value: 'Black', label: 'Black'},
  {value: 'Mixed', label: 'Mixed'},
  {value: 'Other', label: 'Other'},
  {value: 'White', label: 'White'}
]

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
          {forceOptions.map(({value, label}) => 
            <Select.Option key={value} value={value} aria-label={label}>{label}</Select.Option>
          )}
      </Select>
      {
        isView1DataLoading ? 
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
          {ethnicityOptions.map(({value, label}) => 
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