import React, { useEffect } from 'react';

import GraphSelectItem from './graph-select-item.comp';
import Panel from '../misc-components/panel.comp';
import { requestGraphTypeList } from '../network';

function GraphSelector({ setGraph, setList, types }) {
  useEffect(() => {
    //API call is made here to ge the available graph/chart types
    requestGraphTypeList()
      .then((list) => setList(list))
      .catch((err) => console.error(err));
  }, []); //NOTE: Empty array [] indicates that useEffect will only be called once, after the initial render.

  const renderBody = () => {
    if (types.length <= 0) return <Panel caption='Loading Graph Types' />;
    else {
      return types.map((graphType, i) => (
        <GraphSelectItem key={i} setGraph={setGraph} graphType={graphType} />
      ));
    }
  };

  return <div className='graph-selector-container'>{renderBody()}</div>;
}

export default GraphSelector;
