import React from 'react';

function GraphPreview({ data, onClick }) {
  return (
    <div className='graph-flex-item' onClick={onClick}>
      <img src={data} alt={data} />
    </div>
  );
}

export default GraphPreview;
