import React from 'react';

import graph1 from '../../assets/img/Graphs/Barchart.png';
import graph2 from '../../assets/img/Graphs/PieChart.jpg';
import graph3 from '../../assets/img/Graphs/ScatterPlot2.png';

const imgs = [graph1, graph2, graph3];

function GraphPreview({ data, onClick }) {
  return (
    <div className='graph-flex-item' onClick={onClick}>
      <img src={imgs[data.graphtypeid - 1]} alt={data.source} />
    </div>
  );
}

export default GraphPreview;
