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

import React, { useRef } from 'react';
import { Link, animateScroll as scroll } from 'react-scroll';
import { Typography } from 'antd';
import './Home.scss';
import Anime, { anime } from 'react-anime';
import { ReactComponent as ExploreIllustration } from '../../assets/svg/explore_ill.svg';
import { ReactComponent as DashboardIllustration } from '../../assets/svg/dashboard_ill.svg';
import { Button } from 'antd';
import { ReactComponent as WelcomeGraphic } from '../../assets/svg/welcome.svg';
import grid from '../../assets/svg/grid.svg';
import BackgroundDots from '../../helpers/backgroundWebGL';

const { Title, Text } = Typography;



function Home(props) {

	return (
		<>
		
		<div className='outterDiv' bg={grid} >

			<Anime delay={anime.stagger(100)} scale={[.85, .9]}>
				<div id='header__title'>
					<p id='welcomeTitle'>Visualize Data</p>
					<p id='welcomeText'><b>Data Visualization Generator </b>makes it easy to visualize your data with the help of an Interactive Genetic Algorithm. Simply provide your OData or GraphQL link and visualize away!</p>

				</div>
		
				<div id='header__graphic'>
					<WelcomeGraphic/>
				</div>
				
				<div className = 'getStarted'>
					<Title id='getStartedTitle' >Get Started</Title>
					<Link className='ico animated'
						to="home__getStartedSections"
						spy={true}
						smooth={true}
						offset={-100}
						duration={500}>

					
					<div className="ico animated">
	
						<div className="circle circle-top"></div>
						<div className="circle circle-main"></div>
						<div className="circle circle-bottom"></div>
						
						<svg className="svg" version="1.1"  x="0px" y="0px" viewBox="0 0 612 612" >
							<defs>
								<clipPath id="cut-off-arrow">
								<circle cx="306" cy="306" r="287"/>
								</clipPath>
								
								<filter id="goo">
								<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
								<feBlend in="SourceGraphic" in2="goo" />
								</filter>
							
							</defs>
							<path  className="st-arrow" d="M317.5,487.6c0.3-0.3,0.4-0.7,0.7-1.1l112.6-112.6c6.3-6.3,6.3-16.5,0-22.7c-6.3-6.3-16.5-6.3-22.7,0
											l-86,86V136.1c0-8.9-7.3-16.2-16.2-16.2c-8.9,0-16.2,7.3-16.2,16.2v301.1l-86-86c-6.3-6.3-16.5-6.3-22.7,0
											c-6.3,6.3-6.3,16.5,0,22.7l112.7,112.7c0.3,0.3,0.4,0.7,0.7,1c0.5,0.5,1.2,0.5,1.7,0.9c1.7,1.4,3.6,2.3,5.6,2.9
											c0.8,0.2,1.5,0.4,2.3,0.4C308.8,492.6,313.8,491.3,317.5,487.6z"/>
						</svg>
					</div>
					</Link>
				</div>
				

				<div className='home__getStartedSections'>


					<div className='home__container' id='id__explore'>
						<div className='home__section--title' ><div className='home__pageSection--title' >Explore Data</div></div>
						<div className='home__section--middle'>
							<div><ExploreIllustration className='exploreIllustration' /></div>
							<div className='home__section--description'>
								<Text id='explainExplore'>Explore Big Data sources with an OData link. <br/> Generate and customize chart suggestions which can then be added a dashboard.</Text>
							</div>
						</div>
						<div className='home__section--button' >
							<Button id='button__explore' type="primary" htmlType="submit" shape='round' onClick={() => props.handlePageType('explore')}>
								Go Explore
							</Button>
						</div>
					</div>

					<div className='home__container' id='home__section--visualizeData'>
						<div className='home__section--title' ><div className='home__pageSection--title'>Visualize Data</div></div>
						<div className='home__section--middle'>
							<div><DashboardIllustration className='dashboardIllustration' /></div>
							<div className='home__section--description'>
								<div id='home__section--innerDescription'>
									<Text id='explainDashboards'>Login to create a dashboard for all suggested charts or manually crafted visualizations.</Text>
								</div>
							</div>
						</div>
						<div className='home__section--button' >
							<Button id='button__dashboard' type="primary" htmlType="submit" shape='round' onClick={() => props.handlePageType('dashboards')}>
								View Dashboards
							</Button>
						</div>
					</div>
				</div>

			</Anime>
		</div>
		</>
	);
}

export default Home;





