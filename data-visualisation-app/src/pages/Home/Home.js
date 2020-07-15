import React from 'react';
import { Button, Radio } from 'antd';
import {CompassOutlined, WindowsOutlined} from '@ant-design/icons';
// import DashboardIcon from '@material-ui/icons/Dashboard';
// import {Dashboard} from '@styled-icons/material-rounded/Dashboard';

import BackgroundDots from '../../helpers/backgroundWebGL';

import './Home.scss';

function Home(props) {

  function exploreClick() {
    props.setpType('explore');
  };

  function dashboardsClick(){
    props.setpType('dashboards');
  };

  return (
      <React.Fragment>
          {props.renderBackground && <BackgroundDots width={props.width} height={props.height}/>}
          <div id = 'masterPalette'>
              <div className='button__home' id='button__explore' onClick = {exploreClick}>
                  <CompassOutlined className='button__home--icon'/> <div className='button__home--label'>Explore</div>
                  {/*<CompassOutlined  />*/}
                  {/*<div className='button__home--icon'>*/}
                  {/*    <CompassOutlined  />*/}
                  {/*</div>*/}
                  {/*<div className='button__home--label'>Explore</div>*/}
              </div>
              <div className='button__home' id = 'button__dashboard' onClick = {dashboardsClick}>
                  <WindowsOutlined className='button__home--icon' /> <div className='button__home--label'>Dashboards</div>
                  {/*<Dashboard  />*/}
                  {/*<div className='button__home--icon'>*/}
                  {/*    <Dashboard  />*/}
                  {/*</div>*/}
                  {/*<div className='button__home--label'>Dashboards</div>*/}
              </div>
          </div>
      </React.Fragment>
 
 //style={{ background: '#05192F' }}
  );
}

export default Home;