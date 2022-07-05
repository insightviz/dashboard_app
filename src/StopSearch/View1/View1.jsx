import Chart1 from '../Chart1/Chart1';
import Select from 'react-select';

function View1(props) {
  return (
    <div>
      <Select options={props.options} onChange={props.selectChange} isMulti/>
      <Chart1 data={props.data.chart1}/>
    </div>
  );
}

export default View1;
