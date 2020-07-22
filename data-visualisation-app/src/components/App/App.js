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
import React, { Fragment, useEffect, useRef, useState, useLayoutEffect } from 'react';
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
import DeleteIcon from '@material-ui/icons/Delete';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from 'antd';
import {Home as HomeIcon} from '@styled-icons/feather';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import LockIcon from '@material-ui/icons/Lock';
import InputIcon from '@material-ui/icons/Input';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { Database } from '@styled-icons/feather';
import Suggestions from '../Suggestions';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './App.scss';

/**
 *   globals import
*/
import request from '../../globals/requests';

/**
 *   pages import
*/
import Dashboard from '../../pages/Dashboard';
import About from '../../pages/About';
import Trash from '../../pages/Trash';
import LoginDialog from '../../pages/LoginDialog/LoginDialog';
import LoginPopup from '../LoginPopup';
import Home from '../../pages/Home';
import Explore from '../../pages/Explore';
import { MuiThemeProvider } from '@material-ui/core';

/**
 *   State Variables import
*/
import GlobalStateProvider  from '../../globals/Store';
import {useGlobalState} from '../../globals/Store';



const drawerWidth = 240;

const globalMaterialUITheme = createMuiTheme({
	typography: {
		'fontFamily': 'Segoe UI'
	}, palette: {

		primary: {
			main: '#ff4400',
			mainGradient: 'linear-gradient(to right, tomato, cyan)',
		}
	}
});


const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	selected: {
		color: 'white'
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
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
		width: drawerWidth,
		background: '#242424',
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
		color: 'white',
		fontSize: '1.5em',
	},
	drawerList: {
		color: '#969698',
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

	useLayoutEffect(() => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight
			});
			setRenderHomeBackground(true);
		}
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

	const handlePageType = (t) => {
		setPageType(t);
		return (
			mobileOpen === true ? handleDrawerToggle() : null
		);
	};
	

	/**
  	  * back function 
    */
	const handleBack = () => {
		if(pageType === 'explore' && exploreStage === 'entities'){
			setExploreStage('dataConnection');
		}
		if(pageType === 'explore' && exploreStage === 'suggestions'){
			setExploreStage('entities');
		}
		if(pageType === 'dashboards' && dashboardStage === 'selected'){
			setDashboardStage('dashboardHome');
			setDashboardIndex('');
			setIsAddingDashboard(false);
		}		
	};

	/**
  	  * back button variable
    */
	var backButton;
	if(pageType === 'dashboards' && dashboardStage === 'selected'){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else if(pageType === 'explore' && (exploreStage === 'entities' || exploreStage === 'suggestions')){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else{
		backButton = <Button id = 'backButton'  type="primary" disabled = 'true' icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}


	/**
  	  * hanlde page title
    */
	var pageTitle = 'Home';
	if(pageType === 'home'){
		pageTitle = 'Home';
	}
	if(pageType === 'explore'){
		pageTitle = 'Expore';
		if(exploreStage === 'dataConnection'){
			pageTitle = 'Connections';
		}
		if(exploreStage === 'entities'){
			pageTitle = 'Entities';
		}
		if(exploreStage === 'suggestions'){
			pageTitle = 'Suggestions';
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
			pageTitle = dashboardName;
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
		//setDashboardStage('dashboadHome');
		//setDashboardIndex('');
		//setIsAddingDashboard(false);
		page = <Home pType={pageType} handlePageType={handlePageType} renderBackground={renderHomeBackground} width={dimensions.width-4} height={dimensions.height-10} />;
	}
	if(pageType === 'explore'){
		page = <Explore exploreStage = {exploreStage} setExploreStage = {setExploreStage} />;
	}
	
	if(pageType === 'trash'){
		page = <Trash />;
	}
	if(pageType === 'about'){
		page = <About />;
	}
	if(pageType === 'dashboards'){
		page = <Dashboard 
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
			<Divider />
			<List className={classes.drawerList}>


				<MenuItem button onClick={() => handlePageType('home')} selected={pageType === 'home'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<HomeIcon size='25' style={(pageType === 'home' ? {color: 'white'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</MenuItem>

				<MenuItem button onClick={() => handlePageType('explore')} selected={pageType === 'explore'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<ExploreOutlinedIcon style={(pageType === 'explore' ? {color: 'white'} : {})} />
					</ListItemIcon>
					<ListItemText primary="Explore" />
				</MenuItem>

				<MenuItem button onClick={() => handlePageType('dashboards')} selected={pageType === 'dashboards'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon} >
						<DashboardIcon style={(pageType === 'dashboards' ? {color: 'white'} : {})} />
					</ListItemIcon>
					<ListItemText primary="My Dashboards" />
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

				<ListItem button onClick={() => handlePageType('trash')}>
					<ListItemIcon className={classes.icon}>
						<DeleteIcon />
					</ListItemIcon>
					<ListItemText primary="Trash" />
				</ListItem>

			</List>
			<Divider />
			<List component="nav" className={classes.drawerList}>
				<MenuItem button onClick={() => handlePageType('about')} selected={pageType === 'about'} classes={{selected: classes.selected}}>
					<ListItemIcon className={classes.icon}>
						<InfoIcon style={(pageType === 'connections' ? {color: 'about'} : {})} />
					</ListItemIcon>
					<ListItemText primary="About" />
				</MenuItem>
			</List>
		</div>
	);



	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<GlobalStateProvider >
		<MuiThemeProvider theme={globalMaterialUITheme}>

			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar} style={{ background: '#242424' }}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}
							style={{ color: 'red' }}

						>
							<MenuIcon />
						</IconButton>

						{
							backButton
						}
						

						<Typography variant="h6" className={classes.typographyHeading} noWrap children={

							pageTitle
							
						} >

						</Typography>
						<LoginDialog 
							handlePageType ={handlePageType}
							setDashboardIndex = {setDashboardIndex}
							setDashboardStage = {setDashboardStage}
							setIsAddingDashboard = {setIsAddingDashboard}
							setExploreStage = {setExploreStage}
						/>
					</Toolbar>
				</AppBar>

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
						</Drawer>
					</Hidden>
				</nav>

				<main className={classes.content} style={(pageType === 'home' ? {overflow: 'hidden', padding: '0',  backgroundColor: 'white', height: '100vh' } : {})} ref={targetRef}>

					<div className={classes.toolbar} />
					{
						
						page
												
					}


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

