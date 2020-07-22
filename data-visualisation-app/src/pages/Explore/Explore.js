import React from 'react';
import DataConnection from '../../components/DataConnection';
import Entities from '../../components/Entities';
import Suggestions from '../../components/Suggestions';


function Explore(props) {


  var exploreHandler;
  if (props.exploreStage === 'dataConnection') {
    exploreHandler = <DataConnection setStage= {props.setExploreStage}/>;
  } 
  if(props.exploreStage === 'entities') {
    exploreHandler = <Entities setStage= {props.setExploreStage}/>;
  }
  if(props.exploreStage === 'suggestions') {
    exploreHandler = <Suggestions setStage= {props.setExploreStage}/>;
  }
 
  return (
    <nav>
      {exploreHandler}
    </nav>
  );
}

export default Explore;