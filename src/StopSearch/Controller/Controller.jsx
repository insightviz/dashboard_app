import { useState, useEffect } from "react";
import View1 from '../View1/View1';


const DashboardController = () => {
  const [force, setForce] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/stopsearch')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setData(data)
      setLoading(false)
    });
  },[force])

  
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
  if (isLoading || isForceLoading) {
    return <div>loading...</div>
  }
  else {
    return <View1 data={data} options={selectOptions} selectChange={handleForceChange}/>
  }
}

export default DashboardController