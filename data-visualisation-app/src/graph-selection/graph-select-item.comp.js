import React from 'react';

function GraphSelectItem({ setGraph, graphType }) {
  return (
    <div className='Graph-Select-Item'>
      <div className='title'>{graphType.name}</div>
      <img
        className='img'
        alt={graphType.type}
        src={graphType.image}
        onClick={() => {
          setGraph(graphType.type);
        }}
      />
    </div>
  );
}

export default GraphSelectItem;
