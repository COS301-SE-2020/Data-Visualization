import React, { useState, useEffect } from 'react';
import './App.css';

import DataSources from './data-source/data-sources.comp';

import { requestDataSourceList } from './network';

function App() {
  const [dataSrc, setDataSrc] = useState('');
  const [srcList, setSrcList] = useState([]);

  useEffect(() => {
    //API call is made here to ge the available data sources
    requestDataSourceList()
      .then((list) => setSrcList(list))
      .catch((err) => console.error(err));
  }, []); //NOTE: Empty array [] indicates that useEffect will only be called once, after the initial render.

  const renderBody = () => {
    if (dataSrc.length > 0) {
      return <div>Data Source: {dataSrc}</div>;
    } else {
      return <DataSources setSrc={setDataSrc} SrcList={srcList} />;
    }
  };

  return <div className='App'>{renderBody()}</div>;
}

export default App;
