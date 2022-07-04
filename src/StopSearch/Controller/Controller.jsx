import { useState, useEffect } from "react";
import View1 from '../View1/View1';


const DashboardController = () => {
  const [force, setForce] = useState('all');
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
   

  useEffect(() => {
    fetch('http://localhost:5000/stopsearch')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setData(data)
      setLoading(false)
    });
  },[force])
  

  return (
    <div>
      {isLoading || !data ? (
        <div>loading...</div>
      ) : (<View1 data={data}/>)}
      
    </div>
  )
}

export default DashboardController