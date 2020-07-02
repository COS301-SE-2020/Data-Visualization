import React from 'react';
import DataConnection from '../../components/DataConnection';
import Entities from '../../components/Entities';

function Explore() {

  const [exploreStage, setExploreStage] = React.useState('dataConnection');
  return (

          exploreStage === 'dataConnection' ?
          <DataConnection setStage= {setExploreStage}/>
          :
          exploreStage === 'entities' ?
          <Entities setStage= {setExploreStage}/>
          :
          null
  );
}

export default Explore;