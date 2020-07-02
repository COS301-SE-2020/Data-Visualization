import React from 'react';
import DataConnection from '../../components/DataConnection';
import AddEntities from '../../components/AddEntities';

function Explore() {

  const [exploreStage, setExploreStage] = React.useState('dataConnection');
  return (

          exploreStage === 'dataConnection' ?
          <DataConnection setStage= {setExploreStage}/>
          :
          exploreStage === 'addEntities' ?
          <AddEntities setStage= {setExploreStage}/>
          :
          null
  );
}

export default Explore;