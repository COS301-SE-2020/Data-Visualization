import React from 'react';

import GraphPreview from '../GraphPreview';

import graph1 from '../../assets/img/Graphs/Barchart.png';
import graph2 from '../../assets/img/Graphs/PieChart.jpg';
import graph3 from '../../assets/img/Graphs/ScatterPlot2.png';

const graphs = [graph1, graph2, graph3, graph1];

function AddGraphs({ add }) {
  return (
    <div className='graph-flex-container'>
      Add Graphs
      <div className='list'>
        {graphs.map((graph, i) => (
          <GraphPreview key={i} data={graph} onClick={() => add(graph)} />
        ))}
      </div>
    </div>
  );
}

export default AddGraphs;
