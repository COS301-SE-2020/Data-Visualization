import React, { useState, useEffect } from 'react';
import './App.css';

import DataSources from './data-source/data-sources.comp';
import GraphSelector from './graph-selection/graph-selector.comp';
import GraphSuggestions from './graph-suggestions/graph-suggestions.comp';

import { requestDataSourceList } from './network';
// import { MockGraphTypes } from './mock-data';

function App() {
  const [dataSrc, setDataSrc] = useState('');
  const [srcList, setSrcList] = useState([]);

  const [graphType, setGraphType] = useState('');
  const [graphTypeList, setGraphTypeList] = useState([]);
  const [graphSuggestions, setGraphSuggestions] = useState([]);

  useEffect(() => {
    //API call is made here to ge the available data sources
    requestDataSourceList()
      .then((list) => setSrcList(list))
      .catch((err) => console.error(err));
  }, []); //NOTE: Empty array [] indicates that useEffect will only be called once, after the initial render.

  const renderBody = () => {
    if (dataSrc.length > 0) {
      if (graphType.length > 0) {
        return (
          <GraphSuggestions
            type={graphType}
            list={graphSuggestions}
            setList={setGraphSuggestions}
          />
        );
      } else {
        return (
          <GraphSelector
            setGraph={setGraphType}
            setList={setGraphTypeList}
            types={graphTypeList}
          />
        );
      }
    } else {
      return <DataSources setSrc={setDataSrc} SrcList={srcList} />;
    }
  };

  return <div className='App'>{renderBody()}</div>;
}

export default App;
