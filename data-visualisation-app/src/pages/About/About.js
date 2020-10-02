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
 *   5/8/2020    Gian Uys            Improved overall layout
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
import BackgroundDots from '../../helpers/backgroundWebGL';
import './About.scss';
import * as constants from '../../globals/constants';
import {Typography} from 'antd';

/**
  * @return React Component
*/
function About(props) {
    return (
        <React.Fragment>
            {props.renderBackground && <BackgroundDots id = 'backgroundCanvas' width={props.width} height={props.height} />}
            <div id='about__container'>
                <div id='about__item'>
                    
                    <img id='about__image' src={constants.APPLICATION_LOGO_GLOW} alt='logo'/>
                    <div id={'about__p'}>
                        <Typography.Paragraph style={{fontSize: '20px', marginTop: '30px'}}>
                            Data Visualization Generator is a progressive web application used to capture data and suggest visualizations for dashboards and drill-down. Instead of building these visualization from scratch, an Interactive Genetic Algorithm is used to generate suggestions.
                        </Typography.Paragraph>

                        <Typography.Title level={3} style={{marginTop: '80px', marginBottom: '26px'}}>Background</Typography.Title>

                        <Typography.Paragraph>
                            Huge amounts of structured and unstructured data is being stored and processed at a very high rate. This is where the term <b>Big Data</b> comes from. Data is captured to help detect problems and to make better decisions. It is much easier for us as humans to gain insight from data patterns if it is visually represented using charts.
                            <br/><br/>
                            These representations take a lot of time to create manually for each data set, especially when we want to create powerful tools like dashboards and drill-downs for end-users.
                            <br/><br/>
                            An <b>Interactive Genetic Algorithm (IGA)</b> will be used to suggest visualizations for dashboards and to provide drill-down of these suggestions. These visualizations will help the end-user to make adequate decisions and to make more accurate predictions.
                        </Typography.Paragraph>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default About;