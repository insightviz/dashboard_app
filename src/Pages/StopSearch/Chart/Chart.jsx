import Plot from 'react-plotly.js';
import { ThemeContext } from '../../../AppTheme';
import { useContext } from 'react';

function Chart({data, title, ylabel, xlabel}) {
  const { theme } = useContext(ThemeContext);
  return (
    <Plot
      data={[
        data,
      ]}
      layout={theme==='dark' ? 
      {title: title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', font: {color: '#fff'}, yaxis: {showgrid: false, title: {text: ylabel}}, xaxis: {title: {text: xlabel}}}:
      {title: title, autosize: true, paper_bgcolor: '#f2f2f6', plot_bgcolor: '#f2f2f6', font: {color: '#000'}, yaxis: {showgrid: false, title: {text: ylabel}}, xaxis: {title: {text: xlabel}}} }
      useResizeHandler= {true}
      style= { {width: "100%", height: "100%"} }
    />
  );
}

export default Chart;
