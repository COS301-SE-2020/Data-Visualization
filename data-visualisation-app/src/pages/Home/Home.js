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


const { Title, Text } = Typography;


function Home(props) {

  
  //Our app is makes visualizing data easy! We require data sources then we generate chart suggestions of your data with the help of an Interactive Genetic Algorithm.
  return (
      <div class = 'outterDiv'>
        <Anime delay={anime.stagger(100)} scale={[.1, .9]}>
          <Title id = 'welcomeTitle'>Visualize your data.</Title>
          <Text id = 'welcomeText'>The Data Visualization App helps make it easy to visualize your data with the help of an Interactive Genetic Algorithm. All the we require is your data source and we show you the results!</Text>
          <Title id = 'howTitle'>Getting started</Title>
          
          <div class = 'guideDiv'>
            <div id = 'illustrationExploreDiv'>
              <ExploreIllustration class = 'exploreIllustration'/>
            </div>
            <div id = 'explainExploreDiv'>
              <Text id = 'explainExplore'>Select 'Explore' from the side menu to find graph suggestions.</Text>
            </div>
          </div>

          <div class = 'guideDiv'>
            <div id = 'illustrationDashboardsDiv'>
              <DashboardIllustration class = 'dashboardIllustration'/>
            </div>
            <div id = 'explainDashboardsDiv'>
              <Text id = 'explainDashboards'>Select 'Dashboards' from the side menu to view or create dashbaords.</Text>
            </div>
          </div>
          
        </Anime>
      </div>
  );
}

export default Home;





