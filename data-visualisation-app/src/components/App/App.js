/**
 *   @file App.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Byron Tominson      Original
 *   19/7/2020   Byron Tominson      Changed how the routing occurs
 *
 *   Test Cases: data-visualisation-app/src/tests/App.test.js
 *
 *   Functional Description:
 *   Core comonent from which other components are rendered.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

/**
 *   imports
*/
import React, {useRef, useState, useLayoutEffect, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, makeStyles, useTheme } from '@material-ui/core/styles';
//import DashboardIcon from '@material-ui/icons/Dashboard';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from 'antd';
import {Home as HomeIcon} from '@styled-icons/feather';
import InfoIcon from '@material-ui/icons/Info';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './App.scss';
import { WindowsOutlined } from '@ant-design/icons';
import EditChart from '../../components/EditChart';
import {PlusSquare} from '@styled-icons/feather';
import {Trash as TrashIcon} from '@styled-icons/octicons';
import {Dashboard as DashboardIcon} from '@styled-icons/remix-line';
import {Info} from '@styled-icons/feather';

/**
 *   globals import
*/
import request from '../../globals/requests';
import * as constant from '../../globals/constants';

/**
 *   pages import
*/
import Dashboards from '../../pages/Dashboards/Dashboards';
import About from '../../pages/About';
import Trash from '../../pages/Trash';
import LoginDialog from '../../pages/LoginDialog/LoginDialog';
import Home from '../../pages/Home';
import Explore from '../../pages/Explore';
import { MuiThemeProvider } from '@material-ui/core';

/**
 *   State Variables import
*/
import GlobalStateProvider  from '../../globals/Store';
import {useGlobalState} from '../../globals/Store';


let w = window.innerWidth;
let h = window.innerHeight;
var drawerWidth = 240;

const globalMaterialUITheme = createMuiTheme({
	typography: {
		'fontFamily': 'Segoe UI'
	},
	palette: {
		background: {
			default: '#F4F5F9',
		},
		primary: {
			main: '#FFFFFF',
			mainGradient: 'linear-gradient(to right, tomato, cyan)',
		}
	},
	overrides:{
		MuiListItem: {
			root: {
			  '&$selected': {
				backgroundColor: 'rgba(244,245,249,0)',
				color: '#434EE8',
				'&:hover': {
				  backgroundColor: 'rgba(244,245,249,0)',
				},
			  },
			  '&:hover:before': {
				backgroundColor: 'rgba(244,245,249,0)',
			  }
			},
		  },
	}
	
});


const useStyles = makeStyles((theme) => ({
	overrides:{
		main: {
			
			backgroundColor: 'rgba(244,245,249,0)',
				
		  },
	},
	root: {
		//background: '#242424',
		display: 'flex',
	},
	home: {
		background: '#F4F5F9', //#03befc
		display: 'flex'
	},
	suggestions: {
		background: 'white', //#03befc
		minHeight: '100%',
  		minWidth: '1024px',
	
		/* Set up proportionate scaling */
		width: '100%',
		height: 'auto',
			
		/* Set up positioning */
		position: 'absolute',
		top:'0',
		left:'0',
		display: 'flex'
	},

	selected: {
		backgroundColor: 'rgba(0,0,0,0)',
	},

	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
		zIndex: 1
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			marginLeft: drawerWidth,
		},
		zIndex: '1000'
	},
	appBarNotLoggedIn: {
		[theme.breakpoints.up('sm')]: {
			marginLeft: drawerWidth,
		},
	},

	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
		backgroundColor: '#434EE8',
	},

	menuButtonNotLoggedIn: {
		display: 'none',
	},

	userButton: {

		// marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
		},
		display: 'flex',
		justifyContent: 'flex-end',
		maxWidth: '210px',
		marginLeft: 'auto',
		marginRight: -20

	},

	// necessary for content to be below app bar
	toolbar: {
		...theme.mixins.toolbar,
	},
	drawerPaper: {
		border: 'none',
		width: drawerWidth,
		background: '#F4F5F9',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),

	},
	nested: {
		paddingLeft: theme.spacing(11),
		color: '#e6e6e6',
	},
	nestedNoIcon: {
		paddingLeft: theme.spacing(9),
	},
	listItemText: {
		fontSize: '0.9em',
		paddingLeft: theme.spacing(9),
	},
	typographyHeading: {
		color: '#434EE8',
		fontSize: '1.5em', 
		fontWeight: '500',
	},
	typographyHeading_home: {
		color: '#242424',
		fontSize: '1.5em', 
		fontWeight: '500',
		cursor: 'pointer',
		[theme.breakpoints.down('xs')]: {
			fontSize: '1.2em',
		},
	},
	typographyHeading_black:{
		color: '#242424',
		fontSize: '1.5em', 
		fontWeight: '500',
	},
	typographyLocationHeading: {
		color: '#969698',
		fontSize: '1.1em',
		paddingRight: '7px'
	},
	drawerList: {
		color: '#969698',
		paddingLeft: '10px',
	},
	icon: {
		color: '#969698',
	},
	drawerListCollapse: {
		color: '#969698',
	},

}));

/**
  * @param props
  * Core component 
*/
function App(props) {

	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [renderHomeBackground, setRenderHomeBackground] = React.useState(false);

	const targetRef = useRef();
	const [dimensions, setDimensions] = useState({ width:0, height: 0 });
    const [loginButton, setLoginButton] = useState(false);

	useLayoutEffect(() => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight
			});
			setRenderHomeBackground(true);
		}
	}, []);

	useEffect(() => {
		setLoginButton(request.user.rememberLogin(setLoginButton));
	}, []);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const [openIcon, setopenIcon] = React.useState(false);
	const handleOpenIcon = () => {
		setopenIcon(!openIcon);
	};
	const [loginNameState, setLoginNameState] = React.useState('Login/Sign up');

	const [pageType, setPageType] = React.useState('home');
	const [exploreStage, setExploreStage] = React.useState('dataConnection');
	const [dashboardStage, setDashboardStage] = React.useState('dashboardHome');
	const [dashboardName, setDashboardName] = React.useState('Dashboard1');
	const [isAddingDashboard, setIsAddingDashboard] = useState(false);
	const [dashboardIndex, setDashboardIndex] = useState('');
	const [showEditChart, setShowEditChart] = useState(false);

	const handlePageType = (t) => {
		if (pageType !== 'dashboards' && t === 'dashboards') {
			setDashboardIndex('');
		}
		setPageType(t);
		return (
			mobileOpen === true ? handleDrawerToggle() : null
		);
	};

	/**
  	  * back function 
    */
	const handleBack = () => {
		if(pageType === 'explore' && exploreStage === 'dataConnection'){
			setPageType('home');
		}
		if(pageType === 'explore' && exploreStage === 'entities'){
			setExploreStage('dataConnection');
		}
		if(pageType === 'explore' && exploreStage === 'suggestions' && !showEditChart){
			setExploreStage('entities');
		}
		if(pageType === 'explore' && exploreStage === 'suggestions' && showEditChart){
			setShowEditChart(false);
		}
		if(pageType === 'dashboards' && dashboardStage === 'dashboardHome'){
			setPageType('home');
		}	
		if(pageType === 'dashboards' && dashboardStage === 'selected'){
			setDashboardStage('dashboardHome');
			setDashboardIndex('');
			setIsAddingDashboard(false);
		}	
		if(pageType === 'about'){
			setPageType('home');
		}	
		if(pageType === 'trash'){
			setPageType('home');
		}	
		
	};

	/**
  	  * back button variable
    */
	var backButton;
	if(pageType === 'dashboards'){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else if(pageType === 'explore'){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else if(pageType === 'about'){
		backButton = <Button id = 'backButtonAbout'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else if(pageType === 'trash'){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else{
		// backButton = <Button id = 'backButton'  type="primary" disabled = {true} icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}


	/**
  	  * hanlde page title
    */
	var pageTitle = 'Home';
	var locationTitle = '';

	if(pageType === 'home'){
		pageTitle = 'Data Visualization Generator.';
	}
	if(pageType === 'explore'){
		pageTitle = 'Expore';
		if(exploreStage === 'dataConnection'){
			pageTitle = 'Data Sources';
			locationTitle = 'Explore /';
		}
		if(exploreStage === 'entities'){
			pageTitle = 'Entities';
			locationTitle = 'Explore / Data Source /';
		}
		if(exploreStage === 'suggestions'){
			pageTitle = 'Suggestions';
			locationTitle = 'Explore / Data Source / Entities /';
		}
	}
	if(pageType === 'dashboards'){
		pageTitle = 'Dashboards';
		if(dashboardStage === 'dashboardHome'){
			pageTitle = 'Dashboards';	
		}
		if(dashboardStage === 'adding'){
			
		}
		if(dashboardStage === 'selected'){
			pageTitle = ''; //dashboardName
		}
	}
	if(pageType === 'about'){
		pageTitle = 'About';
	}
	if(pageType === 'trash'){
		pageTitle = 'Trash';
	}

	/**
  	  * handle page 
    */
	var page;
	if(pageType === 'home'){
		page = <Home pType={pageType} handlePageType={handlePageType} renderBackground={renderHomeBackground} width={dimensions.width-4} height={dimensions.height-10} />;
	}
	if(pageType === 'explore'){
		page = <Explore exploreStage = {exploreStage} setExploreStage = {setExploreStage} showEditChart={showEditChart} setShowEditChart={setShowEditChart}/>;
	}
	
	if(pageType === 'trash'){
		page = <Trash />;
	}
	if(pageType === 'about'){
		page = <About renderBackground={renderHomeBackground} width={dimensions.width} height={dimensions.height-10}/>;
	}
	if(pageType === 'dashboards'){
		page = <Dashboards
			dashboardStage = {dashboardStage} 
			setDashboardStage = {setDashboardStage} 
			dashboardName = {dashboardName}
			setDashboardName = {setDashboardName}
			handlePageType={handlePageType}
			dashboardIndex = {dashboardIndex}
			setDashboardIndex = {setDashboardIndex}
			isAddingDashboard = {isAddingDashboard}
			setIsAddingDashboard = {setIsAddingDashboard}
		/>;	
	}

	/**
  	  * drawer (Material UI)
    */
	const drawer = (
		<div>
			<div className={classes.toolbar} />
			
			<List className={classes.drawerList}>

			<MenuItem>
			</MenuItem>
			<MenuItem>
			</MenuItem>
			<MenuItem>
			</MenuItem>


				<MenuItem button onClick={() => handlePageType('home')} selected={pageType === 'home'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<HomeIcon size='25' style={(pageType === 'home' ? {color: '#434EE8'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</MenuItem>

				<MenuItem button onClick={() => handlePageType('explore')} selected={pageType === 'explore'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<ExploreOutlinedIcon style={(pageType === 'explore' ? {color: '#434EE8'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Explore" />
				</MenuItem>

				<MenuItem button onClick={() => handlePageType('dashboards')} selected={pageType === 'dashboards'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<DashboardIcon size='25' style={(pageType === 'dashboards' ? {color: '#434EE8'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Dashboards" />
				</MenuItem>

				{/* <MenuItem button onClick={handleOpenIcon} selected={pageType === 'connections'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon}>
						<Database size='25' style={(pageType === 'connections' ? {color: 'white'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Connections" />
					{openIcon ? <ExpandLess /> : <ExpandMore />}
				</MenuItem>

				<Collapse in={openIcon} timeout="auto" unmountOnExit>
					<List component="div" disablePadding className={classes.drawerListCollapse}>
						{['Northwind', 'SouthWind', 'Oracle', 'GoogleDataCentre'].map((text, index) => (
							<ListItem button key={text} >
								<ListItemText classes={{ primary: classes.listItemText }} primary={text} />
							</ListItem>
						))}
					</List>

					<ListItem button className={classes.nested}>
						<ListItemIcon className={classes.icon}>
							<AddIcon />
						</ListItemIcon>
					</ListItem>

				</Collapse> */}

				{/* <ListItem button >
					<ListItemIcon className={classes.icon}>
						<LockIcon />
					</ListItemIcon>
					<ListItemText primary="Lock" />
				</ListItem> */}


				<MenuItem button onClick={() => handlePageType('trash')} selected={pageType === 'trash'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<TrashIcon size='25' style={(pageType === 'trash' ? {color: '#434EE8'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Trash" />
				</MenuItem>

			</List>

			<List component="nav" className={classes.drawerList}>
				<MenuItem button onClick={() => handlePageType('about')} selected={pageType === 'about'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon}>
						<Info size='25' style={(pageType === 'about' ? {color: '#434EE8'} : {})} />
					</ListItemIcon>
					<ListItemText primary="About" />
				</MenuItem>
			</List>
		</div>
	);



	const container = window !== undefined ? () => window().document.body : undefined;
//APPLICATION_LOGO_H
	return (
		
		<GlobalStateProvider >
		<MuiThemeProvider theme={globalMaterialUITheme}>

		<div className={`box ${pageType === 'home' ? classes.home : exploreStage === 'suggestions' ? classes.root : classes.root}`}>
				<CssBaseline />
				
				<AppBar  position="fixed"style={{ background: '' }}  className={`box ${!request.user.isLoggedIn ? classes.appBarNotLoggedIn : classes.appBar}`} >
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`box ${request.user.isLoggedIn ? classes.menuButton : classes.menuButtonNotLoggedIn}`}
							style={{ color: 'white' }}

						>
							<MenuIcon />
						</IconButton>

						{
							backButton
						}
						
						<Typography variant="h2" id = 'locationTitle'className={classes.typographyLocationHeading} noWrap children={
							locationTitle
						} >
						</Typography>

						<Typography variant="h6" className={`box ${pageType === 'home' ? classes.typographyHeading_home :  pageType === 'about' ? classes.typographyHeading_black : classes.typographyHeading}`} onClick={() => {
						
								if(pageType === 'home'){
									handlePageType('about');
								}
							}

						} noWrap children={
							pageTitle
						} >
						</Typography>
						
						{/* <img id='logoOnHome' src={constant.APPLICATION_LOGO_H} alt='logo'/> */}

						<LoginDialog
                            isLoggedIn={loginButton}
							handlePageType ={handlePageType}
							setDashboardIndex = {setDashboardIndex}
							setDashboardStage = {setDashboardStage}
							setIsAddingDashboard = {setIsAddingDashboard}
							setExploreStage = {setExploreStage}
						/>
					</Toolbar>
				</AppBar> : 
				
				{request.user.isLoggedIn ? 
					
					<nav className={classes.drawer} aria-label="mailbox folders">
						{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
						<Hidden smUp implementation="css">
							<Drawer
								container={container}
								variant="temporary"
								anchor={theme.direction === 'rtl' ? 'right' : 'left'}
								open={mobileOpen}
								onClose={handleDrawerToggle}
								classes={{
									paper: classes.drawerPaper,
								}}
								ModalProps={{
									keepMounted: true, // Better open performance on mobile.
								}}
							>
								{drawer}
							</Drawer>
						</Hidden>
						<Hidden xsDown implementation="css">
							<Drawer
								classes={{
									paper: classes.drawerPaper,
								}}
								variant="permanent"
								open
							>
								{drawer}
								<div style={{height: '100vh', position: 'relative'}}>
									<img src={constant.APPLICATION_LOGO_GREY} style={{height: '120px', position: 'absolute', bottom: '80px', left: '24%'}} alt="logo" className={classes.logo} />
									<div style={{position: 'absolute', bottom: '20px', left: '18%', textAlign: 'center', color: '#535355'}}>
										Brought to you by <br/> Doofenshmirtz Evil, Inc.
									</div>
								</div>
							</Drawer>
						</Hidden>
					</nav>
					:
					null
        		}


				<main className={classes.content} style={(pageType === 'about' ? {overflow: 'hidden', padding: '0',  backgroundColor: 'white', height: '100vh' } : (pageType === 'home' ? {padding: '0', overflow: 'hidden'} : {}))} ref={targetRef}>

					<div className={classes.toolbar} />

					{page}
					{/*<EditChart options={{*/}
					{/*	// title: {*/}
					{/*	// 	text: 'Confidence Band',*/}
					{/*	// 	subtext: 'Example in MetricsGraphics.js',*/}
					{/*	// 	left: 'center'*/}
					{/*	// },*/}

					{/*	xAxis: {*/}
					{/*		type: 'category',*/}
					{/*		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']*/}
					{/*	},*/}
					{/*	yAxis: {*/}
					{/*		type: 'value'*/}
					{/*	},*/}
					{/*	series: [{*/}
					{/*		data: [820, 932, 901, 934, 1290, 1330, 1320],*/}
					{/*		type: 'line'*/}
					{/*	}]*/}
					{/*}} />*/}
					{/* <EditChart options={{
						xAxis: {},
						yAxis: {},
						series: [{
							symbolSize: 20,
							data: [
								[10.0, 8.04],
								[8.0, 6.95],
								[13.0, 7.58],
								[9.0, 8.81],
								[11.0, 8.33],
								[14.0, 9.96],
								[6.0, 7.24],
								[4.0, 4.26],
								[12.0, 10.84],
								[7.0, 4.82],
								[5.0, 5.68]
							],
							type: 'scatter'
						}]
					}} /> */}
				</main>

			</div>
		</MuiThemeProvider>
		</GlobalStateProvider >
	);
}

App.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};



export default App;

