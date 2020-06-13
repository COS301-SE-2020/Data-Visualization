import React from 'react';
import GraphSuggestions from '../../components/GraphSuggestions';
import AddGraphs from '../../components/AddGraphs';
import DashboardPreview from '../../components/DashboardPreview';
import './EditDashboard.css';

function EditDashboard({ dashboard, Back, Delete, Update, addGraph, removeGraph }) {
  return (
    <div className='EditDashboard'>
      <div className='controls'>
        <button onClick={() => alert(noFuncYet)}>Add Connection</button>
        <button onClick={() => alert(noFuncYet)}>Filter</button>
        <button onClick={Delete}>Delete Dashboard</button>
        <button onClick={() => Back(false)}>Back</button>
      </div>
      <div className='dashBoardWrapper'>
        <DashboardPreview dashboard={dashboard} remove={removeGraph} />
        <div>
          <AddGraphs add={addGraph} dashboardID={dashboard.id} />
          <GraphSuggestions add={addGraph} />
        </div>
      </div>
    </div>
  );
}

const noFuncYet = 'Functionality not ready yet';

export default EditDashboard;
