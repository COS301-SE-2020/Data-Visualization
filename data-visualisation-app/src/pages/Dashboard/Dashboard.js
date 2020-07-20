import React, { useState, useEffect, Fragment } from 'react';
import update from 'react-addons-update';
import './Dashboard.scss';
import request from '../../globals/requests';

import API from '../../helpers/apiRequests';

import * as Constants from '../../globals/constants';
import HomePage from '../../components/HomePage/HomePage';
import DisplayDashboard from '../../components/DisplayDashboard/DisplayDashboard';
import AddDashboard from '../../components/AddDashboard/AddDashboard';
import EditDashboard from '../../components/EditDashboard/EditDashboard';
import LoginPopup from '../../components/LoginPopup/LoginPopup';
import {Layout, Menu} from 'antd';



function Dashboard(props) {




	
	const [dashboardName, setDashboardName] = useState('');
	const [dashboardDescription, setDashboardDescription] = useState('');
	const [DashboardList, setDashboardList] = useState([]);
	//const [DashboardIndex, setDashboardIndex] = useState('');
	//const [IsAddingDashboard, setIsAddingDashboard] = useState(false);

	function setDashboardDetail(name, description) {
		setDashboardName(name);
		setDashboardDescription(description);
	}

	useEffect(() => {
		// reqDashboardList();
		// request.user.login('peter@neverland.com', 'Passwosdfrd1@');
	}, []);

	//Boolean Checks
	const isSelected = () => props.dashboardIndex !== '';

	//State Mutators
	const deleteDashboard = () => {
		DashboardList.splice(props.dashboardIndex, 1);
		setDashboardList(DashboardList);
		backToHome();
	};
	const AddNewDashboard = (newDash) => {
		setDashboardList(update(DashboardList, { $push: [newDash] }));
	};
	const setDashboard = (dash) => {
		setDashboardList(
			update(DashboardList, {
				[props.dashboardIndex]: dash,
			})
		);
	};
	const setGraphList = (list) => {
		console.log(list);
		setDashboardList(
			update(DashboardList, {
				[props.dashboardIndex]: {
					graphs: { $set: list },
				},
			})
		);
	};

	// const addGraphToDashboard = (newGraph) => {
	// 	setDashboardList(
	// 		update(DashboardList, {
	// 			[DashboardIndex]: {onAddButtonClick,
	// 				graphs: { $push: [newGraph] },
	// 			},
	// 		})
	// 	);
	// };

	// const removeGraphFromDashboard = (gID) => {
	// 	setDashboardList(
	// 		update(DashboardList, {
	// 			[DashboardIndex]: {
	// 				graphs: { $splice: [[gID, 1]] },
	// 			},
	// 		})
	// 	);
	// };

	//Network Reqeust procedures
	const reqDashboardList = () => {
		API.dashboard
			.list()
			.then((res) => {
				console.log(res);
				setDashboardList(res.data);
			})
			.catch((err) => console.error(err));
	};

	const reqDashboardAdd = (newDash) => {
		request.API.dashboard
			.add(newDash.name, newDash.description)
			.then((res) => {
				console.log(res);
				reqDashboardList();
				backToHome();
			})
			.catch((err) => console.error(err));
	};
	const reqDashboardDelete = () => {
		request.API.dashboard
			.delete(DashboardList[props.dashboardIndex].id)
			.then((res) => {
				console.log(res);
				reqDashboardList();
				backToHome();
			})
			.catch((err) => console.error(err));
	};
	const reqDashboardUpdate = () => {
		request.API.dashboard
			.update()
			.then((res) => {
				console.log(res);
				// setDashboardList(res.data);
			})
			.catch((err) => console.error(err));
	};

	const reqGraphList = () => {
		console.log(DashboardList[props.dashboardIndex].id);
		request.API.graph
			.list(DashboardList[props.dashboardIndex].id)
			.then((res) => {
				console.log(res);
				setGraphList(res.data);
			})
			.catch((err) => console.error(err));
	};
	const reqGraphAdd = (newGraph) => {
		request.API.graph
			.add(newGraph.dashboardID, newGraph.graphtypeid)
			.then((res) => {
				console.log(res);
				reqGraphList();
			})
			.catch((err) => console.error(err));
	};
	const reqGraphDelete = (gID) => {
		request.API.graph
			.delete(gID)
			.then((res) => {
				console.log(res);
				reqGraphList();
			})
			.catch((err) => console.error(err));
	};
	const reqGraphUpdate = () => {
		request.API.graph
			.update()
			.then((res) => {
				console.log(res);
				// setGraphList(res.data);
			})
			.catch((err) => console.error(err));
	};



	//Navigation procedures
	const backToHome = () => {
		props.setDashboardIndex('');
		props.setIsAddingDashboard(false);
	};

	


	function router() {
		if (isSelected()) {
			// if (IsAddingDashboard) {
			// 	return (
			// 		<EditDashboard
			// 			dashboard={DashboardList[DashboardIndex]}
			// 			Back={setIsAddingDashboard}
			// 			Delete={reqDashboardDelete}
			// 			Update={setDashboard}
			// 			addGraph={reqGraphAdd}
			// 			removeGraph={reqGraphDelete}
			// 		/>
			// 	);
			// } else {
				props.setDashboardStage('selected');
				props.setDashboardName(dashboardName);
			// }
		} else {
			if (props.isAddingDashboard) {
				props.setDashboardStage('adding');
			} else {
				props.setDashboardStage('dashboardHome');
			}
		}


		if(props.dashboardStage === 'dashboardHome'){
			return (
				<HomePage
					dashboardList={DashboardList}
					setDashboardIndex={props.setDashboardIndex}
					onAddButtonClick={props.setIsAddingDashboard}
					setDetails={setDashboardDetail}
				/>
			);
		}
		if(props.dashboardStage === 'selected'){
			return (
				<DisplayDashboard
					dashboardID={props.dashboardIndex}
					name={dashboardName}
					description={dashboardDescription}
					backFunc={backToHome}
					editDashboard={props.setIsAddingDashboard}
				/>
			);
		}
		if(props.dashboardStage === 'adding'){
			return <AddDashboard add={reqDashboardAdd} home={backToHome} setDetails={setDashboardDetail} />;
		}
	}

	if(request.user.isLoggedIn){
		return router();
	}
	else{
		return <LoginPopup handlePageType = {props.handlePageType}/>;
	}
	
					
		
}

export default Dashboard;
