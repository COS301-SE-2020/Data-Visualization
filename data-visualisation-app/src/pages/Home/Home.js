/**
 *   @file Home.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys      Original
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React from 'react';
import {CompassOutlined, WindowsOutlined} from '@ant-design/icons';
import BackgroundDots from '../../helpers/backgroundWebGL';
import './Home.scss';

function Home(props) {

  function exploreClick() {
    props.handlePageType('explore');
  };

  function dashboardsClick(){
    props.handlePageType('dashboards');
  };

  return (
      <React.Fragment>
          {props.renderBackground && <BackgroundDots width={props.width} height={props.height}/>}
          <div id = 'masterPalette'>
              <div className='button__home' id='button__explore' onClick = {exploreClick}>
                  <CompassOutlined className='button__home--icon'/> <div className='button__home--label'>Explore</div>
              </div>
              <div className='button__home' id = 'button__dashboard' onClick = {dashboardsClick}>
                  <WindowsOutlined className='button__home--icon' /> <div className='button__home--label'>Dashboards</div>
              </div>
          </div>
      </React.Fragment>
  );
}

export default Home;