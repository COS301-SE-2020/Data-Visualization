/**
 *   @file Home.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys           Original
 *   5/8/2020    Byron Tomkinson    Redesigned
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React from 'react';

import { Typography } from 'antd';
import './Home.scss';
import Anime, {anime} from 'react-anime';
import {ReactComponent as ExploreIllustration} from '../../assets/svg/explore_ill.svg';
import {ReactComponent as DashboardIllustration} from '../../assets/svg/dashboard_ill.svg';
import { Button } from 'antd';
import {CompassOutlined} from '@ant-design/icons';


const { Title, Text } = Typography;


function Home(props) {

  
  //Our app is makes visualizing data easy! We require data sources then we generate chart suggestions of your data with the help of an Interactive Genetic Algorithm.
  return (
      <div class = 'outterDiv'>
        <Anime delay={anime.stagger(100)} scale={[.7, .9]}>
          <Title id = 'welcomeTitle'>Visualize your data.</Title>
          <Text id = 'welcomeText'>The Data Visualization App helps make it easy to visualize your data with the help of an Interactive Genetic Algorithm. All the we require is your data source and we show you the results!</Text>
          
          <div id = 'getStarted'>

          
          <Title id = 'howTitle'>Getting started</Title>
          
          <div class = 'guideDiv'>
            <div id = 'illustrationExploreDiv'>
              <ExploreIllustration class = 'exploreIllustration'/>
            </div>
            <div id = 'explainExploreDiv'>
              <Button id = 'explore-button' type="primary" htmlType="submit" shape = 'round' size = 'large' icon={<CompassOutlined />} onClick={() => props.handlePageType('explore')}>
                  Explore
              </Button>
              <div class = 'spacerDiv'></div>
              <Text id = 'explainExplore'>Find suggestions. Add them to dashboards.</Text>
            </div>
          </div>

          <div class = 'guideDiv'>
            <div id = 'illustrationDashboardsDiv'>
              <DashboardIllustration class = 'dashboardIllustration'/>
            </div>
            <div id = 'explainDashboardsDiv'>
              <Button id = 'dashboard-button' type="primary" htmlType="submit" shape = 'round' size = 'large' onClick={() => props.handlePageType('dashboards')}>
                  Dashboards
              </Button>
              <div class = 'spacerDiv'></div>
              <Text id = 'explainDashboards'>View your dashboards</Text>
            </div>
          </div>
          </div>
        </Anime>
      </div>
  );
}

export default Home;





