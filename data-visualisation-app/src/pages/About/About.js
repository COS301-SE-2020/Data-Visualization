/**
 *   @file About.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   15/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/About.test.js
 *
 *   Functional Description:
 *   Infomation regarding the project
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */


/**
  * Imports
*/
import React from 'react';


/**
  * @return React Component
*/
function About() {
  return (

    <div style={{ color: '#3C6A7F', width : '50%', margin : 'auto', paddingTop : '10%' }}>
      <p>
        Big Data is an ever-growing source of information, with governments and corporations generating more Big Data than ever. It proves to be extremely valuable for companies and governments to be able to extract trends and patterns from this data and use this information to better prepare and/or optimize any services they offer.
        This repository represents the visualisation of Big Data. However, the catch comes in where, instead of manually creating these visualisations of Big Data, an Interactive Genetic Algorithm (IGA) will be implemented and let the user be able to select/choose the best visualisation of the given data, be it a graph/chart/scatter plot etc.
      </p>
    </div>
    
  );
}

export default About;