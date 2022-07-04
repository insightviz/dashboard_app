import { useState, useEffect } from "react";
import View1 from '../View1/View1';


const DashboardController = () => {
  const [force, setForce] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/stopsearch')
    .then(response => response.json())
    .then(data => console.log(data));

  }, [])

  return (
    <View1 />
  )

}

export default DashboardController