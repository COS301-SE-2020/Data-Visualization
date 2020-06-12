import React from 'react';

import GraphPreview from '../GraphPreview';

function DashboardPreview({ dashboard, remove }) {
  return (
    <div className='graph-flex-container'>
      Dashboard
      {dashboard.graphs &&
        dashboard.graphs.map((graph, i) => <GraphPreview key={i} data={graph} onClick={() => remove(i)} />)}
    </div>
  );
}

export default DashboardPreview;
