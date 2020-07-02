import React from 'react';
import DataConnection from '../../components/DataConnection';
import Entities from '../../components/Entities';
import Suggestions from '../../components/Suggestions';

function Explore(props) {

  return (

          props.exploreStage === 'dataConnection' ?
          <DataConnection setStage= {props.setExploreStage}/>
          :
          props.exploreStage === 'entities' ?
          <Entities setStage= {props.setExploreStage}/>
          :
          props.exploreStage === 'suggestions' ?
          <Suggestions setStage= {props.setExploreStage}/>
          :
          null
  );
}

export default Explore;