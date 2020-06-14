import React from 'react';
import GraphPreview from '../GraphPreview';

import graph1 from '../../assets/img/Graphs/Barchart.png';
import graph2 from '../../assets/img/Graphs/PieChart.jpg';
import graph3 from '../../assets/img/Graphs/ScatterPlot2.png';

const graphs = [
  { graphtypeid: 1, source: '' },
  { graphtypeid: 2, source: '' },
  { graphtypeid: 3, source: '' },
];

function GraphSuggestions({ add, dashboardID }) {
  return (
    <div className='graph-flex-container'>
      Suggested Graphs
      <div className='list'>
        {graphs.map((graph, i) => (
          <GraphPreview key={i} data={graph} onClick={() => add({ dashboardID, graphtypeid: i + 1 })} />
        ))}
      </div>
    </div>
  );
}

export default GraphSuggestions;
