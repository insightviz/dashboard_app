import Plot from 'react-plotly.js';

function Chart(props) {
  return (
    <Plot
      data={[
        props.data,
      ]}
      layout={ {title: props.title, autosize: true} }
      useResizeHandler= {true}
      style= { {width: "100%", height: "100%"} }
    />
  );
}

export default Chart;
