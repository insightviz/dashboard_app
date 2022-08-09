import { useState, useEffect } from "react";
import View1 from '../View1/View1';
import { Select } from "@geist-ui/core/";

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
  
  const handleForceChange = (e) => {
    setForce(e);
    localStorage.setItem("force", e);
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
          {forceOptions.map((element) => 
            <Select.Option key={element.value} value={element.value} aria-label={element.label}>{element.label}</Select.Option>
          )}
      </Select>
      {isDataLoading ? <div>loading...</div> : <View1 data={data}/>}           
    </div>
  )
}

export default DashboardController