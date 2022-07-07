import Plot from 'react-plotly.js';

function Chart1(props) {
  return (
    <Plot
      data={[
        props.data,
      ]}
      layout={ {width: 320, height: 240, title: props.title} }
    />
  );
}

export default Chart1;
