import Chart from '../Chart/Chart';

function View1(props) {
  return (
    <div>
      <Chart data={props.data.chart1} title={'Monthly count of stop and searches'}/>
    </div>
  );
}

export default View1;
