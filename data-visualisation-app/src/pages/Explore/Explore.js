/**
 *   @file Explore.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   15/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/Explore.test.js
 *
 *   Functional Description:
 *   Explore is a controller for the 'explore stage'.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */


/**
  * Imports
*/
import React from 'react';
import DataConnection from '../../components/DataConnection';
import Entities from '../../components/Entities';
import Suggestions from '../../components/Suggestions';



/**
  * @param props passed from the App function.
  * @return React Component
*/
function Explore(props) {

  var exploreHandler;
  if (props.exploreStage === 'dataConnection') {
    exploreHandler = <DataConnection setStage= {props.setExploreStage}/>;
  } 
  if(props.exploreStage === 'entities') {
    exploreHandler = <Entities setStage= {props.setExploreStage}/>;
  }
  if(props.exploreStage === 'suggestions') {
    exploreHandler = <Suggestions setStage= {props.setExploreStage} newPage={true}/>;
  }
 
  return (
    <nav>
      {exploreHandler}
    </nav>
  );
}

export default Explore;