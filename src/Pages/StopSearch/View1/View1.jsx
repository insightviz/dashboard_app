import Chart from '../Chart/Chart';

function View1({data}) {
  return (
    <div>
      <div className="monthly-stop-searches">
        {data.figure_1.monthly_no_stop_search}
        {data.figure_1.pct_change}
      </div>
      <Chart data={data.breakdown_by_race} title={'Monthly count of stop and searches'}/>
      <Chart data={data.breakdown_by_police_ethnicity} title={'Monthly count of stop and searches'}/>
      <Chart data={data.breakdown_of_object_of_search_by_ethnicity} title={'Monthly count of stop and searches'}/>
      <Chart data={data.breakdown_of_outcomes_by_ethnicity} title={'Monthly count of stop and searches'}/>
    </div>
  );
}

export default View1;
