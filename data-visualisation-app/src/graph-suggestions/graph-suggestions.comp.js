import React, { useEffect } from 'react';

import Panel from '../misc-components/panel.comp';
import { requestGraphsFromType } from '../network';

function GraphSuggestions({ type, list, setList }) {
  useEffect(() => {
    //API call is made here to ge suggestions based on the given graph/chart type
    requestGraphsFromType(type)
      .then((lst) => setList(lst))
      .catch((err) => console.error(err));
  }, []); //NOTE: Empty array [] indicates that useEffect will only be called once, after the initial render.

  const renderBody = () => {
    if (list.length <= 0) return <Panel caption='Loading Graph Suggestions' />;
    else {
      return list.map((graphType, i) => (
        <div className='Graph-Select-Item' key={i}>
          <div className='title'>{graphType.name}</div>
          <img className='img' alt={graphType.type} src={graphType.image} />
        </div>
      ));
    }
  };

  return <div className='graph-selector-container'>{renderBody()}</div>;
}

export default GraphSuggestions;
