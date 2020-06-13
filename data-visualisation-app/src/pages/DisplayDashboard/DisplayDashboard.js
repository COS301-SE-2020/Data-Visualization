import React, { useEffect } from 'react';
import { requestGraphList } from '../../helpers/apiRequests';

import DisplayGraph from './DisplayGraph';
// import graph2 from '../../assets/img/Graphs/PieChart.jpg';

function DisplayDashboard({ backFunc, editDashboard, dashboard, reqGraphList }) {
  useEffect(() => {
    reqGraphList();
  }, []);

  return (
    <div className='DisplayDashboard'>
      <div className='display-header'>
        <h1>{dashboard.name}</h1>
        <button style={{ float: 'right' }} onClick={editDashboard}>
          Edit
        </button>
        <button type='Submit' style={{ float: 'right' }} onClick={backFunc}>
          Back
        </button>
      </div>
      <article className='DisplayGraph-container'>
        {dashboard.graphs && dashboard.graphs.length > 0
          ? dashboard.graphs.map((graph, i) => <DisplayGraph key={i} data={graph} />)
          : NoGraphs()}
      </article>
    </div>
  );
}

function NoGraphs() {
  return <div className='NoContent'>Edit the dashboard to add some graphs...</div>;
}

export default DisplayDashboard;
