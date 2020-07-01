import React from 'react';
import { Button, Radio } from 'antd';
import {CompassOutlined, WindowsOutlined} from '@ant-design/icons';
import DashboardIcon from '@material-ui/icons/Dashboard';

import './Home.scss';

function Home(props) {

  function exploreClick() {
    props.setpType('explore');
  };

  function dashboardsClick(){
    props.setpType('dashboards');
  };

  return (
    <div id = 'masterPalette'>
      <Button id = 'exploreButton' type = 'default' shape='round' icon={<CompassOutlined />} size={'large'} onClick = {exploreClick}>
          Explore
      </Button>
      <Button id = 'dashboardsButton' type = 'default' shape='round' icon={<DashboardIcon />} size={'large'} onClick = {dashboardsClick}>
          Dashboards
      </Button>
    </div>
 
 //style={{ background: '#05192F' }}
  );
}

export default Home;