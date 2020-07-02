import React from 'react';
import DataConnection from '../../components/DataConnection';
import Entities from '../../components/Entities';
import Suggestions from '../../components/Suggestions';

function Explore() {

  const [exploreStage, setExploreStage] = React.useState('dataConnection');
  return (

          exploreStage === 'dataConnection' ?
          <DataConnection setStage= {setExploreStage}/>
          :
          exploreStage === 'entities' ?
          <Entities setStage= {setExploreStage}/>
          :
          exploreStage === 'suggestions' ?
          <Suggestions setStage= {setExploreStage}/>
          :
          null
  );
}

export default Explore;