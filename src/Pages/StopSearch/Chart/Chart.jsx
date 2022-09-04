import Plot from 'react-plotly.js';
import { ThemeContext } from '../../../AppTheme';
import { useContext } from 'react';

function Chart(props) {
  const { theme } = useContext(ThemeContext);
  return (
    <Plot
      data={[
        props.data,
      ]}
      layout={theme==='dark' ? 
      {title: props.title, autosize: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e'}:
      {title: props.title, autosize: true, paper_bgcolor: '#f2f2f6', plot_bgcolor: '#f2f2f6'} }
      useResizeHandler= {true}
      style= { {width: "100%", height: "100%"} }
    />
  );
}

export default Chart;
