import Plot from 'react-plotly.js';
import { ThemeContext } from '../../../AppTheme';
import { useContext } from 'react';

function Chart({data, title, ylabel, xlabel, chartWidth}) {
  const { theme } = useContext(ThemeContext);
  data.marker = theme==='dark' ? { color: '#279adc' } : { color: '#1F77B4' };
  return (
    <Plot
      data={[
        data,
      ]}
      layout={theme==='dark' ? 
      chartWidth < 550 ?
      {margin: {r: 0, b: 40, l: 40, t:60}, title: title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', font: {color: '#fff'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true, showticklabels: false}, xaxis: {title: {text: xlabel}, automargin: true, showticklabels: false}, bargap :0.1}:
      {margin: {r: 0, b: 40, l: 40, t:60}, title: title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', font: {color: '#fff'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true, showticklabels: false}, xaxis: {title: {text: xlabel}, automargin: true}, bargap :0.1}:
      chartWidth < 550 ?
      {margin: {r: 0, b: 40, l: 40, t:60}, title: title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', font: {color: '#fff'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true, showticklabels: false}, xaxis: {title: {text: xlabel}, automargin: true, showticklabels: false}, bargap :0.1}:
      {margin: {r: 0, b: 40, l: 40, t:60}, title: title, autosize: true, paper_bgcolor: '#f2f2f6', plot_bgcolor: '#f2f2f6', font: {color: '#000'}, yaxis: {showgrid: false, title: {text: ylabel}, automargin: true, showticklabels: false}, xaxis: {title: {text: xlabel}, automargin: true}, bargap :0.1} }
      useResizeHandler= {true}
      style= { {width: "100%", height: "100%"} }
    />
  );
}

export default Chart;
