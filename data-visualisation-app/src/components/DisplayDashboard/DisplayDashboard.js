import React, {useEffect, useState} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import ReactEcharts from 'echarts-for-react';
import {Typography, Button, Popconfirm, message, Space} from 'antd';
import './DisplayDashboard.scss';
import { Empty, Input } from 'antd';
import Grid from '@material-ui/core/Grid';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

import useUndo from 'use-undo';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


function DisplayDashboard(props) {

	const [editMode, setEditMode] = useState(false);
	const [dashboardName, setDashboardName] = useState('dashboardname');
	const [dashboardDescription, setDashboardDescription] = useState('dashboarddescription');
	const [hasCharts, setHasCharts] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [visibleCharts, setVisibleCharts] = useState([]);
	const [layoutGrid, setLayoutGrid] = useState({});
	const [searchString, setSearchString] = useState('');

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
	] = useUndo({name: 'dashboardname', description: 'dashboarddesciption', chartNames: []}); //{name: 'dashboardname', description: 'dashboarddesciption'}
	const { present: presentDashboard } = dashboardState;

	useEffect(() => {

		request.graph.list(props.dashboardID, function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				if (request.cache.graph.list.data !== null && request.cache.graph.list.data.length > 0) {
					constructLayout(request.cache.graph.list.data.length);
					showAllCharts();

					setHasCharts(true);
					setIsLoading(false);

				} else {
					setIsLoading(false);
					setHasCharts(false);
				}
			}
		});

	}, []);

	const HEIGHT_DEFAULT = 14;
	let currentCharts = ['apple dashboard', 'oranges dashboard', 'banana dashboard', 'peanut dashboard'];

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
			for (let n = 0; n < totalItems; n++) {
				layoutParameters.lg.push({w: 4, h: HEIGHT_DEFAULT, x: (n % 3)*4, y: HEIGHT_DEFAULT * Math.floor(n / 3), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				layoutParameters.md.push({w: 6, h: HEIGHT_DEFAULT, x: (n % 2)*6, y: HEIGHT_DEFAULT * Math.floor(n / 2), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				layoutParameters.sm.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				layoutParameters.xs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
				layoutParameters.xxs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
			}
			setLayoutGrid({...layoutParameters});
		}

		setLayoutGrid({...layoutParameters});
	}

	function showAllCharts() {
		let newvisiblecharts = [];
		currentCharts = [];
		request.cache.graph.list.data.forEach((chart, index) => {
			newvisiblecharts.push(index);
			currentCharts.push(chart.title);
		});

		setVisibleCharts(newvisiblecharts);
		setDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: currentCharts});
	}

	function onEditDashboardClick() {
		setEditMode(!editMode);
	}

	function onDeleteDashboardClick() {
		request.dashboard.delete(props.dashboardID, function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				message.success('Dashboard was successfully deleted!');
				props.backFunc();
			}
		});
	}

	function onEditNameChange(name) {
		request.dashboard.update(props.dashboardID, ['name'], [name], function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				setDashboardState({name: name, description: presentDashboard.description, chartNames: currentCharts});
			} else {
				// todo:
			}
		});
	}

	function onEditDescriptionChange(description) {
		request.dashboard.update(props.dashboardID, ['description'], [description], function(result) {
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				setDashboardState({name: presentDashboard.name, description: description, chartNames: currentCharts});
			} else {
				// todo:
			}
		});
	}

	function onSearchPressEnter(e) {
		if (e.target.value === '' && searchString !== '') {
			showAllCharts();
			constructLayout(request.cache.graph.list.data.length);
		} else {
			let newvisiblecharts = [];
			request.cache.graph.list.data.forEach((chart, index) => {
				if (chart.title.match(new RegExp(e.target.value, 'i'))) {

					newvisiblecharts.push(index);
				}
			});

			setVisibleCharts(newvisiblecharts);

			constructLayout(newvisiblecharts.length);
		}
		setSearchString(e.target.value);
	}

	function onChartDelete(chartid) {
		message.loading('Deleting Chart...', 0);
		request.graph.delete(props.dashboardID, chartid, function(result) {
			message.destroy();
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				message.success('Chart was successfully deleted.', 2.5);

				showAllCharts();

				resetDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: presentDashboard.chartNames});

				constructLayout(request.cache.graph.list.data.length);

			} else {
				message.error('Failed to remove chart!', 2.5);
			}
		});
	}

	function onChartTitleEdit(e, chartid, chartindex) {
		// todo: remove hared coded values below
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
				resetDashboardState({name: presentDashboard.name, description: presentDashboard.description, chartNames: currentnames});

				setVisibleCharts(visibleCharts);
			} else {
				// todo:
			}
		});
	}

	return (
		<div className='content--padding'>
			<div style={{marginBottom: '20px'}}>

				<Grid container spacing={3}>
					<Grid item xs={8}>
						<Typography.Title level={3} editable={editMode && {onChange: onEditNameChange}}>
							{presentDashboard.name}
						</Typography.Title>
						<Typography.Paragraph editable={editMode && {onChange: onEditDescriptionChange}}>{presentDashboard.description}</Typography.Paragraph>
					</Grid>
					<Grid item xs={4} style={{textAlign: 'right'}}>

						<Space size={9}>
						{hasCharts &&
						<Button ghost={!editMode} onClick={onEditDashboardClick}>
							 {(editMode ? 'Save Dashboard' : 'Edit Dashboard')}
						</Button>}
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
							<Grid item xs={8}>
								{searchString !== '' && <span>Showing all charts named <span style={{fontWeight: 'bold'}}>"{searchString}"</span></span>}
							</Grid>
							<Grid item xs={4} style={{textAlign: 'right'}}>
								<div style={{marginBottom: '20px', textAlign: 'right'}}>
									<Input.Search
										placeholder="Search Charts"
										style={{ width: 200 }}
										onPressEnter={onSearchPressEnter}
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
						>

							{(() => {
								let layoutkey = -1;
								let booba = constants.ICONS.CLOSE;
								return visibleCharts.map(v => {
									layoutkey++;
									return <div key={layoutkey} className='panel__shadow panel'>
										<div>

											<div>whathat {v}</div>
											<Grid container spacing={3}>
												<Grid item xs={11}>
													<Typography.Title level={4} editable={editMode && {onChange: ev => {onChartTitleEdit(ev, request.cache.graph.list.data[v].id, v);}}} >{presentDashboard.chartNames[v]}</Typography.Title>
												</Grid>
												<Grid item xs={1} style={{textAlign: 'right', fontSize: '1.2em'}}>
													{editMode &&
															<Popconfirm
																title="Are you sure you would like to delete this chart?"
																onConfirm={() => onChartDelete(request.cache.graph.list.data[v].id)}
																okText="Yes"
																cancelText="No"
															>
																{constants.ICONS.CLOSE}
															</Popconfirm>
													}
												</Grid>
											</Grid>
										</div>
										<div>v</div>
										<ReactEcharts option={request.cache.graph.list.data[v].options} style={{height: '300px', width: '100%'}} />
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

export default DisplayDashboard;











// const demotempoptions = [
//
// 	{
// 		title: {
// 			text: "CategorySales"
// 		},
// 		dataset: {
// 			source: [
// 				[
// 					"Category_Sales_for_1997: CategoryName",
// 					"value"
// 				],
// 				[
// 					"Beverages",
// 					"102074.3100"
// 				],
// 				[
// 					"Condiments",
// 					"55277.6000"
// 				],
// 				[
// 					"Confections",
// 					"80894.1400"
// 				],
// 				[
// 					"Dairy Products",
// 					"114749.7800"
// 				],
// 				[
// 					"Grains/Cereals",
// 					"55948.8200"
// 				],
// 				[
// 					"Meat/Poultry",
// 					"81338.0600"
// 				],
// 				[
// 					"Produce",
// 					"53019.9800"
// 				],
// 				[
// 					"Seafood",
// 					"65544.1800"
// 				]
// 			]
// 		},
// 		xAxis: {
// 			"type": "category"
// 		},
// 		yAxis: {"type": "category"},
// 		series: [
// 			{
// 				type: "bar",
// 				encode: {
// 					x: "Category_Sales_for_1997: CategoryName",
// 					y: "value"
// 				}
// 			}
// 		]
// 	},
//
//
// 	{
// 	legend: {
// 		data: ['Something'],
// 		fontFamily: "Tahoma"
// 	},
// 	tooltip: {
// 		trigger: 'axis',
// 		formatter: 'Temperature : <br/>{b}km : {c}°C'
// 	},
// 	grid: {
// 		left: '3%',
// 		right: '4%',
// 		bottom: '3%',
// 		containLabel: true
// 	},
// 	xAxis: {
// 		type: 'value',
// 		axisLabel: {
// 			formatter: '{value} °C'
// 		}
// 	},
// 	yAxis: {
// 		type: 'category',
// 		axisLine: {onZero: false},
// 		axisLabel: {
// 			formatter: '{value} km'
// 		},
// 		boundaryGap: false,
// 		data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
// 	},
// 	series: [
// 		{
// 			name: 'Something',
// 			type: 'line',
// 			smooth: true,
// 			lineStyle: {
// 				width: 2,
// 				shadowColor: 'rgba(0, 0, 0, 0.3)',
// 				shadowBlur: 6,
// 				shadowOffsetY: 4,
// 				color: {
// 					type: 'linear',
// 					x: 0.5,
// 					y: 0.5,
// 					r: 0.5,
// 					colorStops: [{
// 						offset: 0, color: '#159957' // color at 0% position
// 					}, {
// 						offset: 1, color: '#155799' // color at 100% position
// 					}],
// 					global: false // false by default
// 				}
// 			},
// 			data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
// 		}
// 	]
// },
//
//
// 	{
// 		title: {
// 			text: 'Something',
// 			subtext: 'Something',
// 			left: 'center'
// 		},
// 		tooltip: {
// 			trigger: 'item',
// 			formatter: '{a} <br/>{b} : {c} ({d}%)'
// 		},
// 		legend: {
// 			orient: 'vertical',
// 			left: 'left',
// 			data: ['Something1', 'Something2', 'Something3', 'Something4', 'Something5']
// 		},
// 		series: [
// 			{
// 				name: 'Something22',
// 				type: 'pie',
// 				radius: '55%',
// 				center: ['50%', '60%'],
// 				data: [
// 					{value: 335, name: 'Apples'},
// 					{value: 310, name: 'Oranges'},
// 					{value: 234, name: 'Bananas'},
// 					{value: 135, name: 'Pineapples'},
// 					{value: 1548, name: 'Lemons'}
// 				],
// 				emphasis: {
// 					itemStyle: {
// 						shadowBlur: 10,
// 						shadowOffsetX: 0,
// 						shadowColor: 'rgba(0, 0, 0, 0.5)'
// 					}
// 				}
// 			}
// 		]
// 	},
//
// 	{
// 		title: {
// 			text: '浏览器占比变化',
// 			subtext: '纯属虚构',
// 			top: 10,
// 			left: 10
// 		},
// 		tooltip: {
// 			trigger: 'item',
// 			backgroundColor: 'rgba(0,0,250,0.2)'
// 		},
// 		legend: {
// 			type: 'scroll',
// 			bottom: 10,
// 			data: (function (){
// 				var list = [];
// 				for (var i = 1; i <=28; i++) {
// 					list.push(i + 2000 + '');
// 				}
// 				return list;
// 			})()
// 		},
// 		visualMap: {
// 			top: 'middle',
// 			right: 10,
// 			color: ['red', 'yellow'],
// 			calculable: true
// 		},
// 		radar: {
// 			indicator: [
// 				{ text: 'IE8-', max: 400},
// 				{ text: 'IE9+', max: 400},
// 				{ text: 'Safari', max: 400},
// 				{ text: 'Firefox', max: 400},
// 				{ text: 'Chrome', max: 400}
// 			]
// 		},
// 		series: (function (){
// 			var series = [];
// 			for (var i = 1; i <= 28; i++) {
// 				series.push({
// 					name: '浏览器（数据纯属虚构）',
// 					type: 'radar',
// 					symbol: 'none',
// 					lineStyle: {
// 						width: 1
// 					},
// 					emphasis: {
// 						areaStyle: {
// 							color: 'rgba(0,250,0,0.3)'
// 						}
// 					},
// 					data: [{
// 						value: [
// 							(40 - i) * 10,
// 							(38 - i) * 4 + 60,
// 							i * 5 + 10,
// 							i * 9,
// 							i * i /2
// 						],
// 						name: i + 2000 + ''
// 					}]
// 				});
// 			}
// 			return series;
// 		})()
// 	},
//
// 	{
// 		color: [
// 			'#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'
// 		],
// 		tooltip: {
// 			trigger: 'item',
// 			triggerOn: 'mousemove'
// 		},
// 		animation: false,
// 		series: [
// 			{
// 				type: 'sankey',
// 				bottom: '10%',
// 				focusNodeAdjacency: 'allEdges',
// 				data: [
// 					{name: 'a'},
// 					{name: 'b'},
// 					{name: 'a1'},
// 					{name: 'b1'},
// 					{name: 'c'},
// 					{name: 'e'}
// 				],
// 				links: [
// 					{source: 'a', target: 'a1', value: 5},
// 					{source: 'e', target: 'b', value: 3},
// 					{source: 'a', target: 'b1', value: 3},
// 					{source: 'b1', target: 'a1', value: 1},
// 					{source: 'b1', target: 'c', value: 2},
// 					{source: 'b', target: 'c', value: 1}
// 				],
// 				orient: 'vertical',
// 				label: {
// 					position: 'top'
// 				},
// 				lineStyle: {
// 					color: 'source',
// 					curveness: 0.5
// 				}
// 			}
// 		]
// 	}
// ];