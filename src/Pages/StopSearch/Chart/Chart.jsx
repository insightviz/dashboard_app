import Plot from 'react-plotly.js';
import { ThemeContext } from '../../../AppTheme';
import { useContext } from 'react';

function Chart({data, title, ylabel, xlabel}) {
  const { theme } = useContext(ThemeContext);
  data.marker = theme==='dark' ? { color: '#279adc' } : { color: '#1F77B4' };
  return (
    <Plot
      data={[
        data,
      ]}
      layout={theme==='dark' ? 
      {title: title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', font: {color: '#fff'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true}, xaxis: {title: {text: xlabel}, automargin: true}, bargap :0.1}:
      {title: title, autosize: true, paper_bgcolor: '#f2f2f6', plot_bgcolor: '#f2f2f6', font: {color: '#000'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true}, xaxis: {title: {text: xlabel}, automargin: true}, bargap :0.1} }
      useResizeHandler= {true}
      style= { {width: "100%", height: "100%"} }
    />
  );
}

export default Chart;
