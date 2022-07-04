import Plot from 'react-plotly.js';

function Chart1(props) {
  return (
    <Plot
      data={[
        props.data,
      ]}
      layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
    />
  );
}

export default Chart1;
