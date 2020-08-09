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
import Anime, { anime } from 'react-anime';
import { ReactComponent as ExploreIllustration } from '../../assets/svg/explore_ill.svg';
import { ReactComponent as DashboardIllustration } from '../../assets/svg/dashboard_ill.svg';
import { Button } from 'antd';
import { CompassOutlined, WindowsOutlined } from '@ant-design/icons';
import { ReactComponent as WelcomeGraphic } from '../../assets/svg/welcome.svg';
import grid from '../../assets/svg/grid.svg';

const { Title, Text } = Typography;


function Home(props) {


	//Our app is makes visualizing data easy! We require data sources then we generate chart suggestions of your data with the help of an Interactive Genetic Algorithm.
	return (
		<div className='outterDiv' bg={grid} >
			<img src={grid} id='home__background'/>
			<Anime delay={anime.stagger(100)} scale={[.7, 1]}>
				<div id='header__title'>
					<Title id='welcomeTitle'>Visualize your data.</Title>
					<Text id='welcomeText'>Data Visualization Generator makes it easy to visualize your data with the help of an Interactive Genetic Algorithm. Simply provide your OData link to generate chart suggestions!</Text>

				</div>
				{/*<div id='getStarted'>*/}
				{/*</div>*/}
				<div id='header__graphic'>
					<WelcomeGraphic/>
				</div>
				<Title id='howTitle'>Get Started</Title>

				<div className='guideDiv'>
					<div className='guideDiv__innerContainer'>
						<div id='illustrationExploreDiv'>
							<ExploreIllustration className='exploreIllustration' />
						</div>
						<div id='explainExploreDiv'>
							<Button id='button__explore' type="primary" htmlType="submit" shape='round' icon={<CompassOutlined />} onClick={() => props.handlePageType('explore')}>
								Explore
							</Button>
							<div className='spacerDiv'></div>
							<Text id='explainExplore'>Find suggestions. Add them to dashboards.</Text>
						</div>
					</div>
				</div>

				<div className='guideDiv'>
					<div className='guideDiv__innerContainer'>
						<div id='illustrationDashboardsDiv'>
							<DashboardIllustration className='dashboardIllustration' />
						</div>
						<div id='explainDashboardsDiv'>
							<Button id='button__dashboard' type="primary" htmlType="submit" shape='round' icon={<WindowsOutlined />} onClick={() => props.handlePageType('dashboards')}>
								Dashboards
							</Button>
							<div className='spacerDiv'></div>
							<Text id='explainDashboards'>View your dashboards.</Text>
						</div>
					</div>
				</div>
			</Anime>
		</div>
	);
}

export default Home;





