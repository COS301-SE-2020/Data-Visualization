import React from 'react';

function DisplayGraph({ data }) {
  return (
    <div className='DisplayGraph'>
      <img src={data} alt={data} />
    </div>
  );
}

export default DisplayGraph;
