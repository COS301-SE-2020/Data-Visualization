import React, { useState, useEffect } from 'react';
import update from 'react-addons-update';
import './App.css';
import API from '../../helpers/apiRequests';
import * as Constants from '../../globals/constants';
import HomePage from '../../pages/HomePage';
import AboutPage from '../../pages/AboutPage';
import DisplayDashboard from '../../pages/DisplayDashboard';
import AddDashboard from '../../pages/AddDashboard';
import EditDashboard from '../../pages/EditDashboard';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

function App() {
	const [DashboardIndex, setDashboardIndex] = useState(-1);
	const [DashboardList, setDashboardList] = useState([]);
	const [IsAddingDashboard, setIsAddingDashboard] = useState(false);
	const [about, setAbout] = useState('ASFKSADNFKAS FKNDSAKNFKDSAN FKNSDAKFN SKDAN FKSADNFNSDAKNF KSADNF ANSD');
	const [IsAbout, setIsAbout] = useState(false);

	useEffect(() => {
		reqDashboardList();
	}, []);

	//Boolean Checks
	const isSelected = () => DashboardIndex >= 0;

	//State Mutators
	const deleteDashboard = () => {
		DashboardList.splice(DashboardIndex, 1);
		setDashboardList(DashboardList);
		backToHome();
	};
	const AddNewDashboard = (newDash) => {
		setDashboardList(update(DashboardList, { $push: [newDash] }));
	};
	const setDashboard = (dash) => {
		setDashboardList(
			update(DashboardList, {
				[DashboardIndex]: dash,
			})
		);
	};
	const setGraphList = (list) => {
		console.log(list);
		setDashboardList(
			update(DashboardList, {
				[DashboardIndex]: {
					graphs: { $set: list },

				},
			})
		);
	};

	const addGraphToDashboard = (newGraph) => {
		setDashboardList(
			update(DashboardList, {
				[DashboardIndex]: {
					graphs: { $push: [newGraph] },
				},
			})
		);
	};

	const removeGraphFromDashboard = (gID) => {
		setDashboardList(
			update(DashboardList, {
				[DashboardIndex]: {
					graphs: { $splice: [[gID, 1]] },
				},
			})
		);
	};

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
		API.dashboard
			.add(newDash.name, newDash.description)
			.then((res) => {
				console.log(res);
				reqDashboardList();
				backToHome();
			})
			.catch((err) => console.error(err));
	};
	const reqDashboardDelete = () => {
		API.dashboard
			.delete(DashboardList[DashboardIndex].id)
			.then((res) => {
				console.log(res);
				reqDashboardList();
				backToHome();
			})
			.catch((err) => console.error(err));
	};
	const reqDashboardUpdate = () => {
		API.dashboard
			.update()
			.then((res) => {
				console.log(res);
				// setDashboardList(res.data);
			})
			.catch((err) => console.error(err));
	};

	const reqGraphList = () => {
		console.log(DashboardList[DashboardIndex].id);
		API.graph
			.list(DashboardList[DashboardIndex].id)
			.then((res) => {
				console.log(res);
				setGraphList(res.data);
			})
			.catch((err) => console.error(err));
	};
	const reqGraphAdd = (newGraph) => {
		API.graph
			.add(newGraph.dashboardID, newGraph.graphtypeid)
			.then((res) => {
				console.log(res);
				reqGraphList();
			})
			.catch((err) => console.error(err));
	};
	const reqGraphDelete = (gID) => {
		API.graph
			.delete(gID)
			.then((res) => {
				console.log(res);
				reqGraphList();
			})
			.catch((err) => console.error(err));
	};
	const reqGraphUpdate = () => {
		API.graph
			.update()
			.then((res) => {
				console.log(res);
				// setGraphList(res.data);
			})
			.catch((err) => console.error(err));
	};

	//Navigation procedures
	const backToHome = () => {
		setDashboardIndex(-1);
		setIsAddingDashboard(false);
		setIsAbout(false);
	};
	const goToAbout = () => {
		setIsAbout(true);
	};

	function router() {
		if (IsAbout) {
			return <AboutPage about={about} />;
		} else if (isSelected()) {
			if (IsAddingDashboard) {
				return (
					<EditDashboard
						dashboard={DashboardList[DashboardIndex]}
						Back={setIsAddingDashboard}
						Delete={reqDashboardDelete}
						Update={setDashboard}
						addGraph={reqGraphAdd}
						removeGraph={reqGraphDelete}
					/>
				);
			} else {
				return (
					<DisplayDashboard
						dashboard={DashboardList[DashboardIndex]}
						reqGraphList={reqGraphList}
						backFunc={backToHome}
						editDashboard={setIsAddingDashboard}
					/>
				);
			}
		} else {
			if (IsAddingDashboard) {
				return <AddDashboard add={reqDashboardAdd} home={backToHome} />;
			} else {
				return (
					<HomePage
						dashboardList={DashboardList}
						setDashboardIndex={setDashboardIndex}
						onAddButtonClick={setIsAddingDashboard}
					/>
				);
			}
		}
	}


	return (

		<Layout style={{ height: '100vh' }} >

			<Header className='app-header' >
				<img src={Constants.APPLICATION_LOGO_H} alt='logo' />
				<Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} className='app-menu' >
					<Menu.Item key="1" >Home</Menu.Item>

					<Menu.Item key="2">Settings</Menu.Item>
				</Menu>
				<div>login stub</div>
			</Header>

			{router()}
		</Layout>

	);
}

export default App;
