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
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';


// import CssBaseline from '@material-ui/core/CssBaseline';
// import Divider from '@material-ui/core/Divider';
// import Drawer from '@material-ui/core/Drawer';
// import Hidden from '@material-ui/core/Hidden';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
 import { createMuiTheme, useTheme } from '@material-ui/core/styles';
// //import DashboardIcon from '@material-ui/icons/Dashboard';
// import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
 import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
 import { Button } from 'antd';
// import {Home as HomeIcon} from '@styled-icons/feather';
// import InfoIcon from '@material-ui/icons/Info';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// import './App.scss';
// import { WindowsOutlined } from '@ant-design/icons';
// import EditChart from '../../components/EditChart';
// import {PlusSquare} from '@styled-icons/feather';
// import {Trash as TrashIcon} from '@styled-icons/octicons';
// import {Dashboard as DashboardIcon} from '@styled-icons/remix-line';
// import {Info} from '@styled-icons/feather';
import Anime, {anime} from 'react-anime';

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


// let w = window.innerWidth;
// let h = window.innerHeight;
 const drawerWidth = 240;

const globalMaterialUITheme = createMuiTheme({
	typography: {
		'fontFamily': 'Segoe UI'
	},
	palette: {

		primary: {
			main: '#161748',
			mainGradient: 'linear-gradient(to right, tomato, cyan)',
		}
	}
});


const useStyles = makeStyles((theme) => ({
	root: {
		background: 'linear-gradient(45deg, #ffafbd 12%, #ffc3a0 79%)',
		position: 'absolute',
		height: '100%',
		width: '100%',
	},
	dataConnectionRoot: {
		background: 'linear-gradient(45deg, #ffafbd 12%, #ffc3a0 79%)',
		position: 'absolute',
		height: '100%',
		width: '100%',
	},
	homeRoot : {
		background: 'linear-gradient(45deg, #ffafbd 12%, #ffc3a0 79%)', //linear-gradient(45deg, #ffafbd 12%, #ffc3a0 79%)
		flexGrow: 1,
	},
	selected: {
		color: 'white'
	},


	typographyHeading: {
		color: 'white',
		fontSize: '1.5em',
	},
	typographyLocationHeading: {
		color: 'white',
		fontSize: '1.1em',
		paddingRight: '7px'
	},
	icon: {
		color: '#969698',
	},
	drawerListCollapse: {
		color: '#969698',
	},
	grow: {
		flexGrow: 1,
		background: 'linear-gradient(45deg, #ffafbd 12%, #ffc3a0 79%)',
	  },
	  menuButton: {
		marginRight: theme.spacing(2),
	  },
	  title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
		  display: 'block',
		},
	  },
	  search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
		  backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
		  marginLeft: theme.spacing(3),
		  width: 'auto',
		},
	  },
	  searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	  inputRoot: {
		color: 'inherit',
	  },
	  inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
		  width: '20ch',
		},
	  },
	  sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
		  display: 'flex',
		},
	  },
	  sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
		  display: 'none',
		},
	  },

}));

/**
  * @param props
  * Core component 
*/
function App(props) {

	// const { window } = props;
	// const classes = useStyles();
	// const theme = useTheme();
	// const [mobileOpen, setMobileOpen] = useState(false);
	// const [renderHomeBackground, setRenderHomeBackground] = React.useState(false);

	// const targetRef = useRef();
	// const [dimensions, setDimensions] = useState({ width:0, height: 0 });
	// const [loginButton, setLoginButton] = useState(false);
	
	// const [anchorEl, setAnchorEl] = React.useState(null);
	// const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	// const isMenuOpen = Boolean(anchorEl);
	// const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	// const handleProfileMenuOpen = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleMobileMenuClose = () => {
	// 	setMobileMoreAnchorEl(null);
	// };

	// const handleMenuClose = () => {
	// 	setAnchorEl(null);
	// 	handleMobileMenuClose();
	// };

	// const handleMobileMenuOpen = (event) => {
	// 	setMobileMoreAnchorEl(event.currentTarget);
	// };

	// const menuId = 'primary-search-account-menu';
	// const renderMenu = (
	// 	<Menu
	// 	anchorEl={anchorEl}
	// 	anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 	id={menuId}
	// 	keepMounted
	// 	transformOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 	open={isMenuOpen}
	// 	onClose={handleMenuClose}
	// 	>
	// 	<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
	// 	<MenuItem onClick={handleMenuClose}>My account</MenuItem>
	// 	</Menu>
	// );

	// const mobileMenuId = 'primary-search-account-menu-mobile';
	// const renderMobileMenu = (
	// 	<Menu
	// 	anchorEl={mobileMoreAnchorEl}
	// 	anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 	id={mobileMenuId}
	// 	keepMounted
	// 	transformOrigin={{ vertical: 'top', horizontal: 'right' }}
	// 	open={isMobileMenuOpen}
	// 	onClose={handleMobileMenuClose}
	// 	>
	// 	<MenuItem>
	// 		<IconButton aria-label="show 4 new mails" color="inherit">
	// 		<Badge badgeContent={4} color="secondary">
	// 			<MailIcon />
	// 		</Badge>
	// 		</IconButton>
	// 		<p>Messages</p>
	// 	</MenuItem>
	// 	<MenuItem>
	// 		<IconButton aria-label="show 11 new notifications" color="inherit">
	// 		<Badge badgeContent={11} color="secondary">
	// 			<NotificationsIcon />
	// 		</Badge>
	// 		</IconButton>
	// 		<p>Notifications</p>
	// 	</MenuItem>
	// 	<MenuItem onClick={handleProfileMenuOpen}>
	// 		<IconButton
	// 		aria-label="account of current user"
	// 		aria-controls="primary-search-account-menu"
	// 		aria-haspopup="true"
	// 		color="inherit"
	// 		>
	// 		<AccountCircle />
	// 		</IconButton>
	// 		<p>Profile</p>
	// 	</MenuItem>
	// 	</Menu>
	// );

	// useLayoutEffect(() => {
	// 	if (targetRef.current) {
	// 		setDimensions({
	// 			width: targetRef.current.offsetWidth,
	// 			height: targetRef.current.offsetHeight
	// 		});
	// 		setRenderHomeBackground(true);
	// 	}
	// }, []);

	// useEffect(() => {
	// 	setLoginButton(request.user.rememberLogin(setLoginButton));
	// }, []);


	// const [loginNameState, setLoginNameState] = React.useState('Login/Sign up');

	 const [pageType, setPageType] = React.useState('home');
	const [exploreStage, setExploreStage] = React.useState('dataConnection');
	const [dashboardStage, setDashboardStage] = React.useState('dashboardHome');
	const [dashboardName, setDashboardName] = React.useState('Dashboard1');
	const [isAddingDashboard, setIsAddingDashboard] = useState(false);
	const [dashboardIndex, setDashboardIndex] = useState('');

	const handlePageType = (t) => {
		if (pageType !== 'dashboards' && t === 'dashboards') {
			//setDashboardIndex('');
		}
		setPageType(t);
		
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
		if(pageType === 'explore' && exploreStage === 'suggestions'){
			setExploreStage('entities');
		}
		if(pageType === 'dashboards' && dashboardStage === 'dashboardHome'){
			setPageType('home');
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
	if(pageType === 'dashboards'){
		backButton = <Button id = 'backButton'  type="primary" icon={<ArrowBackIosIcon />} onClick = {handleBack}></Button>;
	}
	else if(pageType === 'explore'){
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
		pageTitle = 'Home';
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
		page = <Home pType={pageType} handlePageType={handlePageType} />;
	}
	if(pageType === 'explore'){
		page = <Explore exploreStage = {exploreStage} setExploreStage = {setExploreStage} />;
	}
	
	if(pageType === 'trash'){
		page = <Trash />;
	}
	if(pageType === 'about'){
		page = <About/>;
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
	// const drawer = (
	// 	<div>
	// 		<div className={classes.toolbar} />
	// 		<Divider />
	// 		<List className={classes.drawerList}>


	// 			<MenuItem button onClick={() => handlePageType('home')} selected={pageType === 'home'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon} >
	// 					<HomeIcon size='25' style={(pageType === 'home' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Home" />
	// 			</MenuItem>

	// 			<MenuItem button onClick={() => handlePageType('explore')} selected={pageType === 'explore'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon} >
	// 					<ExploreOutlinedIcon style={(pageType === 'explore' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Explore" />
	// 			</MenuItem>

	// 			<MenuItem button onClick={() => handlePageType('dashboards')} selected={pageType === 'dashboards'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon} >
	// 					<DashboardIcon size='25' style={(pageType === 'dashboards' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Dashboards" />
	// 			</MenuItem>

	// 			<MenuItem button onClick={() => handlePageType('about')} selected={pageType === 'about'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon} >
	// 					<PlusSquare size='25' style={(pageType === 'about' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Create chart" />
	// 			</MenuItem>



	// 			{/* <MenuItem button onClick={handleOpenIcon} selected={pageType === 'connections'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon}>
	// 					<Database size='25' style={(pageType === 'connections' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Connections" />
	// 				{openIcon ? <ExpandLess /> : <ExpandMore />}
	// 			</MenuItem>

	// 			<Collapse in={openIcon} timeout="auto" unmountOnExit>
	// 				<List component="div" disablePadding className={classes.drawerListCollapse}>
	// 					{['Northwind', 'SouthWind', 'Oracle', 'GoogleDataCentre'].map((text, index) => (
	// 						<ListItem button key={text} >
	// 							<ListItemText classes={{ primary: classes.listItemText }} primary={text} />
	// 						</ListItem>
	// 					))}
	// 				</List>

	// 				<ListItem button className={classes.nested}>
	// 					<ListItemIcon className={classes.icon}>
	// 						<AddIcon />
	// 					</ListItemIcon>
	// 				</ListItem>

	// 			</Collapse> */}

	// 			{/* <ListItem button >
	// 				<ListItemIcon className={classes.icon}>
	// 					<LockIcon />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Lock" />
	// 			</ListItem> */}


	// 			<MenuItem button onClick={() => handlePageType('trash')} selected={pageType === 'trash'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon} >
	// 					<TrashIcon size='25' style={(pageType === 'trash' ? {color: 'white'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="Trash" />
	// 			</MenuItem>



	// 		</List>
	// 		<Divider />
	// 		<List component="nav" className={classes.drawerList}>
	// 			<MenuItem button onClick={() => handlePageType('about')} selected={pageType === 'about'} classes={{selected: classes.selected}}>
	// 				<ListItemIcon className={classes.icon}>
	// 					<Info size='25' style={(pageType === 'about' ? {color: 'about'} : {})} />
	// 				</ListItemIcon>
	// 				<ListItemText primary="About" />
	// 			</MenuItem>
	// 		</List>
	// 	</div>
	// );

	const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

	//const container = window !== undefined ? () => window().document.body : undefined;


	return (
	
		<GlobalStateProvider >
		<MuiThemeProvider theme={globalMaterialUITheme}>
		<div className={`box ${pageType === 'home' || exploreStage === 'entities' ? classes.homeRoot : exploreStage === 'dataConnection' ? classes.dataConnectionRoot : classes.root}`}>
			<AppBar position="sticky" style = {{backgroundColor: '#161748', opacity: '0.95'}}>
				<Toolbar>
				
				{/* <Typography className={classes.title} variant="h6" noWrap>
					Material-UI
				</Typography> */}
						{
							backButton
						}
						
						
						<Typography variant="h2" className={classes.typographyLocationHeading} noWrap children={
							locationTitle
						} >
						</Typography>

						<Anime delay={anime.stagger(100)} scale={[.7, 1]}>
						<Typography variant="h6" className={classes.typographyHeading} noWrap children={
							pageTitle
						} >
						</Typography>
						</Anime>
				<div className={classes.grow} />
				<div className={classes.sectionDesktop}>
					<IconButton aria-label="show 4 new mails" color="inherit">
					<Badge badgeContent={4} color="secondary">
						<MailIcon />
					</Badge>
					</IconButton>
					<IconButton aria-label="show 17 new notifications" color="inherit">
					<Badge badgeContent={17} color="secondary">
						<NotificationsIcon />
					</Badge>
					</IconButton>
					<IconButton
					edge="end"
					aria-label="account of current user"
					aria-controls={menuId}
					aria-haspopup="true"
					onClick={handleProfileMenuOpen}
					color="inherit"
					>
					<AccountCircle />
					</IconButton>
				</div>
				<div className={classes.sectionMobile}>
					<IconButton
					aria-label="show more"
					aria-controls={mobileMenuId}
					aria-haspopup="true"
					onClick={handleMobileMenuOpen}
					color="inherit"
					>
					<MoreIcon />
					</IconButton>
				</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
			<div id = 'main__content'>
				{page}
			</div>
    	</div>
		
		</MuiThemeProvider>
		</GlobalStateProvider >
	);
}





export default App;

