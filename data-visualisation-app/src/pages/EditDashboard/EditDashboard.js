import React from 'react';

function EditDashboard(props) {
  return (
    <div className='EditDashboard'>
      <button
        type='Submit'
        onClick={() => alert('Functionality not ready yet')}>
        Add Connection
      </button>

      <button
        type='Submit'
        onClick={() => alert('Functionality not ready yet')}>
        Filter
      </button>

      <button
        type='Submit'
        onClick={() => props.Back(false)}
        style={{ float: 'right' }}>
        Back
      </button>

      <Suggestions />

      <button type='Submit' style={{ float: 'right' }} onClick={props.Delete}>
        Delete Dashboard
      </button>
    </div>
  );
}

function Suggestions() {
  return <div>Suggestions Here...</div>;
}

export default EditDashboard;
