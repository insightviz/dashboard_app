import Chart1 from '../Chart1/Chart1';

function View1(props) {
  return (
    <div>
      <Chart1 data={props.data.chart1} title={'Monthly count of stop and searches'}/>
    </div>
  );
}

export default View1;
