import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LockIcon from '@material-ui/icons/Lock';
import InputIcon from '@material-ui/icons/Input';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';

import Dashboard from '../../pages/Dashboard';
import About from '../../pages/About';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
      background: '#4BC8D0',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nestedNoIcon: {
    paddingLeft: theme.spacing(9),
  },
  listItemText: {
	fontSize:'0.9em',
	paddingLeft: theme.spacing(9),
  },
  
}));



function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };


  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
       <ListItem button onClick={() => setComponent('dashboards')}>
          <ListItemIcon className={classes.icon} >
            <DashboardIcon/>
          </ListItemIcon>
          <ListItemText primary="My Dashboards" />
        </ListItem>
        <ListItem button onClick= {handleClick}>
          <ListItemIcon className={classes.icon}>
            <InputIcon/>
          </ListItemIcon>
          <ListItemText primary="Connections" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
         <Collapse in={open} timeout="auto" unmountOnExit>


          <List component="div" disablePadding>
            {['Northwind', 'SouthWind', 'Oracle', 'GoogleDataCentre'].map((text, index) => (
              <ListItem button key={text} >
                <ListItemText classes={{primary:classes.listItemText}} primary={text}/>
              </ListItem>
            ))}
          </List>


          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Connection" />
          </ListItem>

         </Collapse>
        <ListItem button>
          <ListItemIcon classes={classes.icon}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Lock" />
        </ListItem>
        <ListItem button>
          <ListItemIcon className={classes.icon}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItem>
        
      </List>
      <Divider />
      <List component="nav">
        <ListItem button onClick={() => setComponent('about')}>
          <ListItemIcon className={classes.icon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  const [component, setComponent] = React.useState('dashboard')

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Data viualization
          </Typography>
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
	  <main className={classes.content}>
        <div className={classes.toolbar} />
		{
			
			component === 'dashboard' ?
			<Dashboard />
			:
			component === 'about' ?
			<About />
			:
			<Dashboard />
          
        }	
		 

        
      </main>

    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;

