/**
 *   @file Dashboards.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Byron Tominson      Original
 *   19/7/2020   Gian Uys            Added edit dashboard functionality.
 *   1/8/2020	 Gian Uys			 Added undo/redo dashboard functionality.
 *   1/8/2020	 Gian Uys			 Added save dashboard functionality.
 *
 *   Functional Description:
 *   Displays all charts within the dashboard along with the dashboard name and description. This component
 *   also allows the user to edit the dashboard.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

/**
 *   Imports
 */
import React, {useEffect, useState, useRef} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import ReactEcharts from 'echarts-for-react';
import {Typography, Button, Popconfirm, message, Space} from 'antd';
import './Dashboard.scss';
import { Empty, Input } from 'antd';
import Grid from '@material-ui/core/Grid';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import useUndo from 'use-undo';
import Trash from '../../pages/Trash';
import EditChart from '../EditChart';
import {EDITCHART_MODES} from '../../globals/constants';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


/**
 *   @class Dashboard
 *   @brief Component to display the selected dashboard.
 *   @details Displays all charts within the dashboard along with the dashboard name and description. This component
 *   		  also allows the user to edit the dashboard.
 */
function Dashboard(props) {

	const [editMode, setEditMode] = useState(false);
	const [hasCharts, setHasCharts] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [visibleCharts, setVisibleCharts] = useState([]);
	const [layoutGrid, setLayoutGrid] = useState({});
	const [searchString, setSearchString] = useState('');
	const [createChartMode, setCreateChartMode] = useState(false);
	const defaultLayout = useRef(true);
	const currentLayout = useRef(null);

	const [
		dashboardState,
		{
			set: setDashboardState,
			reset: resetDashboardState,
			undo: undoDashboardState,
			redo: redoDashboardState,
			canUndo,
			canRedo
		}
	] = useUndo({name: props.name, description: props.description, chartNames: []});

	const { present: presentDashboard } = dashboardState;
	const HEIGHT_DEFAULT = 14;
	let currentCharts = [];

	function synchronizeChanges() {

		console.debug('request.cache.graph.list', request.cache.graph.list);

		setHasCharts(false);
		setIsLoading(true);
		setVisibleCharts([]);
		setLayoutGrid({});
		setSearchString('');


		setCreateChartMode(false);

		initialize();

		// setTimeout(initialize, 3000);

	}

	function initialize() {

		request.graph.list(props.dashboardID, function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				if (request.cache.graph.list !== null && request.cache.graph.list.length > 0) {

					let newChartIndex = -1, nonemptycount = 0;
					let bestX = Number.MAX_VALUE, bestY = Number.MIN_VALUE;
					for (let c = 0; c < request.cache.graph.list.length; c++) {
						if (Object.keys(request.cache.graph.list[c].metadata).length === 0 && request.cache.graph.list[c].metadata.constructor === Object) {
							if (newChartIndex === -1) {
								newChartIndex = c;
								defaultLayout.current = false;
							} else {
								defaultLayout.current = true;
								break;
							}
						} else {
							nonemptycount++;
							if (request.cache.graph.list[c].metadata.x < bestX)
								bestX = request.cache.graph.list[c].metadata.x;
							if (request.cache.graph.list[c].metadata.y + request.cache.graph.list[c].metadata.h > bestY)
								bestY = request.cache.graph.list[c].metadata.y + request.cache.graph.list[c].metadata.h;
						}
					}

					defaultLayout.current = defaultLayout.current && nonemptycount !== request.cache.graph.list.length;

					if (!defaultLayout && newChartIndex > -1) {
						request.cache.graph.list[newChartIndex].metadata.x = bestX;
						request.cache.graph.list[newChartIndex].metadata.y = bestY;
						request.cache.graph.list[newChartIndex].metadata.w = 4;
						request.cache.graph.list[newChartIndex].metadata.h = HEIGHT_DEFAULT;

						// todo: update graph metadata
					}
					constructLayout(request.cache.graph.list.length);

					showAllCharts(true);

					setHasCharts(true);
					setIsLoading(false);

				} else {
					setIsLoading(false);
					setHasCharts(false);
				}
			}
		});
	}


	useEffect(() => {
		request.graph.list(props.dashboardID, function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				if (request.cache.graph.list !== null && request.cache.graph.list.length > 0) {

					let newChartIndex = -1, nonemptycount = 0;
					let bestX = Number.MAX_VALUE, bestY = Number.MIN_VALUE;
					for (let c = 0; c < request.cache.graph.list.length; c++) {
						if (Object.keys(request.cache.graph.list[c].metadata).length === 0 && request.cache.graph.list[c].metadata.constructor === Object) {
							if (newChartIndex === -1) {
								newChartIndex = c;
								defaultLayout.current = false;
							} else {
								defaultLayout.current = true;
								break;
							}
						} else {
							nonemptycount++;
							if (request.cache.graph.list[c].metadata.x < bestX)
								bestX = request.cache.graph.list[c].metadata.x;
							if (request.cache.graph.list[c].metadata.y + request.cache.graph.list[c].metadata.h > bestY)
								bestY = request.cache.graph.list[c].metadata.y + request.cache.graph.list[c].metadata.h;
						}
					}

					defaultLayout.current = defaultLayout.current && nonemptycount !== request.cache.graph.list.length;

					if (!defaultLayout && newChartIndex > -1) {
						request.cache.graph.list[newChartIndex].metadata.x = bestX;
						request.cache.graph.list[newChartIndex].metadata.y = bestY;
						request.cache.graph.list[newChartIndex].metadata.w = 4;
						request.cache.graph.list[newChartIndex].metadata.h = HEIGHT_DEFAULT;

						// todo: update graph metadata
					}
					constructLayout(request.cache.graph.list.length);

					showAllCharts(true);

					setHasCharts(true);
					setIsLoading(false);

				} else {
					setIsLoading(false);
					setHasCharts(false);
				}
			}
		});
	}, []);

	function constructLayout(totalItems) {
		 let layoutParameters = {
			lg: [],
			md: [],
			sm: [],
			xs: [],
			xxs: []
		};
		if (totalItems === 1) {
			layoutParameters.lg.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.md.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.sm.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.xs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.xxs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		} else if (totalItems === 2) {
			layoutParameters.lg.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.lg.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

			layoutParameters.md.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.md.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

			layoutParameters.sm.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.sm.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

			layoutParameters.xs.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.xs.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

			layoutParameters.xxs.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
			layoutParameters.xxs.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});
		} else {
			if (defaultLayout) {
				for (let n = 0; n < totalItems; n++) {
					layoutParameters.lg.push({w: 4, h: HEIGHT_DEFAULT, x: (n % 3)*4, y: HEIGHT_DEFAULT * Math.floor(n / 3), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.md.push({w: 6, h: HEIGHT_DEFAULT, x: (n % 2)*6, y: HEIGHT_DEFAULT * Math.floor(n / 2), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.sm.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.xs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.xxs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				}
			} else {
				for (let n = 0; n < totalItems; n++) {
					layoutParameters.lg.push({w: request.cache.graph.list[n].metadata.w, h: request.cache.graph.list[n].metadata.h, x: request.cache.graph.list[n].metadata.x, y: request.cache.graph.list[n].metadata.y, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.md.push({w: request.cache.graph.list[n].metadata.w, h: request.cache.graph.list[n].metadata.h, x: request.cache.graph.list[n].metadata.x, y: request.cache.graph.list[n].metadata.y, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.sm.push({w: request.cache.graph.list[n].metadata.w, h: request.cache.graph.list[n].metadata.h, x: request.cache.graph.list[n].metadata.x, y: request.cache.graph.list[n].metadata.y, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.xs.push({w: request.cache.graph.list[n].metadata.w, h: request.cache.graph.list[n].metadata.h, x: request.cache.graph.list[n].metadata.x, y: request.cache.graph.list[n].metadata.y, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
					layoutParameters.xxs.push({w: request.cache.graph.list[n].metadata.w, h: request.cache.graph.list[n].metadata.h, x: request.cache.graph.list[n].metadata.x, y: request.cache.graph.list[n].metadata.y, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				}
			}
			// setLayoutGrid({...layoutParameters});
		}

		setLayoutGrid({...layoutParameters});
	}

	function showAllCharts(doReset) {
		let newvisiblecharts = [];
		currentCharts = [];
		request.cache.graph.list.forEach((chart, index) => {
			newvisiblecharts.push(index);
			currentCharts.push(chart.title);

		});

		setVisibleCharts(newvisiblecharts);
		if (doReset) {
			resetDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: currentCharts});
		} else {
			setDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: currentCharts});
		}

	}

	function onEditDashboardClick() {
		setEditMode(!editMode);
	}

	function onDeleteDashboardClick() {
		request.dashboard.delete(props.dashboardID, function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				message.success('Dashboards was successfully deleted!');
				props.backFunc();
			}
		});
	}

	function onEditNameChange(name) {
		request.dashboard.update(props.dashboardID, ['name'], [name], function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				// setDashboardState({name: name, description: presentDashboard.description, chartNames: currentCharts});
				setDashboardState({name: name, description: presentDashboard.description, chartNames: presentDashboard.chartNames});
			} else {
				// todo:
			}
		});
	}

	function onEditDescriptionChange(description) {
		request.dashboard.update(props.dashboardID, ['description'], [description], function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				// setDashboardState({name: presentDashboard.name, description: description, chartNames: currentCharts});
				setDashboardState({name: presentDashboard.name, description: description, chartNames: presentDashboard.chartNames});
			} else {
				// todo:
			}
		});
	}

	function onSaveDashboardClick() {
		message.loading('Saving dashboard...');

		(async function() {
			for (let r = 0; r < presentDashboard.chartNames.length; r++) {
				await new Promise(function(resolve){
					let fields = [];
					let fielddata = [];
					fielddata.push(presentDashboard.chartNames[r]);
					fields.push('title');
					if (currentLayout.current != null && typeof currentLayout.current !== 'undefined') {
						fields.push('metadata');
						fielddata.push({
							// lg: {
							w: currentLayout.current[r].w,
							h: currentLayout.current[r].h,
							x: currentLayout.current[r].x,
							y: currentLayout.current[r].y
							// },
							// md: [],
							// sm: [],
							// xs: [],
							// xxs: []
						});
					}
					request.graph.update(props.dashboardID, request.cache.graph.list[r].id, fields, fielddata, function(result) {
						// todo: handle error
						resolve(true);
					});
				} );
			}
		})().then(function() {
			message.success('Changes saved!');

			setEditMode(!editMode);
		});
	}

	function onSearchPressEnter(e) {
		onSearchClick(e.target.value);
	}

	function onSearchClick(value) {
		if (value === '' && searchString !== '') {
			showAllCharts(false);
			constructLayout(request.cache.graph.list.length);
		} else {
			let newvisiblecharts = [];
			request.cache.graph.list.forEach((chart, index) => {
				if (chart.title.match(new RegExp(value, 'i'))) {

					newvisiblecharts.push(index);
				}
			});

			setVisibleCharts(newvisiblecharts);

			constructLayout(newvisiblecharts.length);
		}
		setSearchString(value);
	}

	function onChartDelete(chartIndex) {
		message.loading('Deleting Chart...', 0);
		// todo: if request is unsuccessful the chart should not be shown on the trash page
		Trash.addChart(presentDashboard.name, request.cache.graph.list[chartIndex], props.dashboardID);
		let chartID = request.cache.graph.list[chartIndex].id;

		request.graph.delete(props.dashboardID, request.cache.graph.list[chartIndex].id, function(result) {
			message.destroy();
			if (result === constants.RESPONSE_CODES.SUCCESS) {

				message.success('Chart was successfully deleted.', 2.5);

				showAllCharts(false);
				let newChartName = [];
				for (let a = 0; a < presentDashboard.chartNames.length; a++) {
					if (a !== chartIndex)
						newChartName.push(presentDashboard.chartNames[a]);
				}
				// resetDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: presentDashboard.chartNames});
				resetDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: newChartName});

				constructLayout(request.cache.graph.list.length);

			} else {
				Trash.removeChart(presentDashboard.name, chartID);
				message.error('Failed to remove chart!', 2.5);
			}
		});
	}

	function onChartTitleEdit(e, chartid, chartindex) {
		// todo: remove hard coded values below
		request.graph.update(props.dashboardID, chartid, ['title'], [e], function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				let currentnames = [];
				presentDashboard.chartNames.forEach((name, index) => {
					if (index === chartindex) {
						currentnames.push(e);
					} else {
						currentnames.push(name);
					}
				});

				setDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: currentnames});
				// setDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: presentDashboard.chartNames});

				setVisibleCharts(visibleCharts);
			} else {
				// todo:
			}
		});
	}

	function onLayoutChange(layout) {
		currentLayout.current = layout;
	}

	return (
		createChartMode ?
		<EditChart mode={EDITCHART_MODES.CREATE} synchronizeChanges={synchronizeChanges} dashboardID={props.dashboardID}/> :
		<div className='content--padding'>
			<div style={{marginBottom: '20px'}}>

				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<Typography.Title level={3} editable={editMode && {onChange: onEditNameChange}}>
							{presentDashboard.name}
						</Typography.Title>
						<Typography.Paragraph editable={editMode && {onChange: onEditDescriptionChange}}>{presentDashboard.description}</Typography.Paragraph>
					</Grid>
					<Grid item xs={12} md={4} style={{textAlign: 'right', marginBottom: '25px'}}>

						<Space size={9}>
						<Button ghost={!editMode} onClick={() => {setCreateChartMode(true);}}>
							Create Chart
						</Button>
						{/*{hasCharts &&*/}
						<Button ghost={!editMode} onClick={(editMode ? onSaveDashboardClick : onEditDashboardClick)}>
							 {(editMode ? 'Save Dashboard' : 'Edit Dashboard')}
						</Button>
							{/*}*/}
						{editMode &&
							<React.Fragment>
								{request.user.isLoggedIn &&
									<Popconfirm
										placement="bottomRight"
										title="Are you sure you would like delete the entire dashboard?"
										okText="Yes"
										cancelText="No"
										onConfirm={onDeleteDashboardClick}
									>
										<Button>
												Delete Dashboard
										</Button>
									</Popconfirm>
								}
								<Button onClick={undoDashboardState} disabled={!canUndo}>
									Undo
								</Button>
								<Button onClick={redoDashboardState} disabled={!canRedo}>
									Redo
								</Button>
							</React.Fragment>
						}
						</Space>
					</Grid>
				</Grid>
				<div style={{borderBottom: '1px solid black'}}></div>
			</div>

			{isLoading ?
				<div style={{textAlign: 'center'}}>
					{constants.LOADER}
				</div>
				:
				(hasCharts ?
					<React.Fragment>

						<Grid container spacing={3}>
							<Grid item xs={6} md={8}>
								{searchString !== '' && <span>Showing all charts named <span style={{fontWeight: 'bold'}}>"{searchString}"</span></span>}
							</Grid>
							<Grid item xs={6} md={4} style={{textAlign: 'right'}}>
								<div style={{marginBottom: '20px', textAlign: 'right'}}>
									<Input.Search
										placeholder="Search Charts"
										style={{ width: 200 }}
										onPressEnter={onSearchPressEnter}
										onSearch={value => onSearchClick(value)}
									/>
								</div>
							</Grid>
						</Grid>

						<ResponsiveReactGridLayout
							className="layout"
							breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
							cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
							rowHeight={12}
							layouts={layoutGrid}
							margin={[20, 20]}
							isDraggable={editMode}
							isResizable={editMode}
							onLayoutChange={onLayoutChange}
						>

							{(() => {
								let layoutkey = -1;
								return visibleCharts.map(v => {
									layoutkey++;
									return <div key={layoutkey} className='panel__shadow panel'>
										<div>
											<Grid container spacing={3}>
												<Grid item xs={11}>
													<Typography.Title level={4} style = {{fontSize: '12pt', fontWeight: '300'}} editable={editMode && {onChange: ev => {onChartTitleEdit(ev, request.cache.graph.list[v].id, v);}}} >{presentDashboard.chartNames[v]}</Typography.Title>
												</Grid>
												<Grid item xs={1} style={{textAlign: 'right', fontSize: '1.2em'}}>
													{editMode &&
															<Popconfirm
																title="Are you sure you would like to delete this chart?"
																onConfirm={() => onChartDelete(v)}
																okText="Yes"
																cancelText="No"
															>
																{constants.ICONS.CLOSE}
															</Popconfirm>
													}
												</Grid>
											</Grid>
										</div>
										<ReactEcharts option={request.cache.graph.list[v].options} style={{height: '300px', width: '100%'}} />
									</div>;
								});
							})()}

						</ResponsiveReactGridLayout>


					</React.Fragment>
					:
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Empty Dashboard'/>
				)
			}
		</div>
	);
}

export default Dashboard;
