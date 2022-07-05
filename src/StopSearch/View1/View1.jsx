import Chart1 from '../Chart1/Chart1';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

function View1(props) {
  return (
    <div>
      <SelectDropdown/>
      <Chart1 data={props.data.chart1}/>
    </div>
  );
}

export default View1;
