import React, {useEffect, useState} from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import ReactEcharts from 'echarts-for-react';
import {Typography, Button} from 'antd';
import './DisplayDashboard.scss';
import { Empty, Input } from 'antd';
import Grid from '@material-ui/core/Grid';

import useUndo from 'use-undo';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const demotempoptions = [{
	legend: {
		data: ['Something'],
		fontFamily: "Tahoma"
	},
	tooltip: {
		trigger: 'axis',
		formatter: 'Temperature : <br/>{b}km : {c}°C'
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
		type: 'value',
		axisLabel: {
			formatter: '{value} °C'
		}
	},
	yAxis: {
		type: 'category',
		axisLine: {onZero: false},
		axisLabel: {
			formatter: '{value} km'
		},
		boundaryGap: false,
		data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
	},
	series: [
		{
			name: 'Something',
			type: 'line',
			smooth: true,
			lineStyle: {
				width: 2,
				shadowColor: 'rgba(0, 0, 0, 0.3)',
				shadowBlur: 6,
				shadowOffsetY: 4,
				color: {
					type: 'linear',
					x: 0.5,
					y: 0.5,
					r: 0.5,
					colorStops: [{
						offset: 0, color: '#159957' // color at 0% position
					}, {
						offset: 1, color: '#155799' // color at 100% position
					}],
					global: false // false by default
				}
			},
			data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
		}
	]
},


	{
		title: {
			text: 'Something',
			subtext: 'Something',
			left: 'center'
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['Something1', 'Something2', 'Something3', 'Something4', 'Something5']
		},
		series: [
			{
				name: 'Something22',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [
					{value: 335, name: 'Apples'},
					{value: 310, name: 'Oranges'},
					{value: 234, name: 'Bananas'},
					{value: 135, name: 'Pineapples'},
					{value: 1548, name: 'Lemons'}
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	},

	{
		title: {
			text: '浏览器占比变化',
			subtext: '纯属虚构',
			top: 10,
			left: 10
		},
		tooltip: {
			trigger: 'item',
			backgroundColor: 'rgba(0,0,250,0.2)'
		},
		legend: {
			type: 'scroll',
			bottom: 10,
			data: (function (){
				var list = [];
				for (var i = 1; i <=28; i++) {
					list.push(i + 2000 + '');
				}
				return list;
			})()
		},
		visualMap: {
			top: 'middle',
			right: 10,
			color: ['red', 'yellow'],
			calculable: true
		},
		radar: {
			indicator: [
				{ text: 'IE8-', max: 400},
				{ text: 'IE9+', max: 400},
				{ text: 'Safari', max: 400},
				{ text: 'Firefox', max: 400},
				{ text: 'Chrome', max: 400}
			]
		},
		series: (function (){
			var series = [];
			for (var i = 1; i <= 28; i++) {
				series.push({
					name: '浏览器（数据纯属虚构）',
					type: 'radar',
					symbol: 'none',
					lineStyle: {
						width: 1
					},
					emphasis: {
						areaStyle: {
							color: 'rgba(0,250,0,0.3)'
						}
					},
					data: [{
						value: [
							(40 - i) * 10,
							(38 - i) * 4 + 60,
							i * 5 + 10,
							i * 9,
							i * i /2
						],
						name: i + 2000 + ''
					}]
				});
			}
			return series;
		})()
	},

	{
		color: [
			'#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'
		],
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove'
		},
		animation: false,
		series: [
			{
				type: 'sankey',
				bottom: '10%',
				focusNodeAdjacency: 'allEdges',
				data: [
					{name: 'a'},
					{name: 'b'},
					{name: 'a1'},
					{name: 'b1'},
					{name: 'c'},
					{name: 'e'}
				],
				links: [
					{source: 'a', target: 'a1', value: 5},
					{source: 'e', target: 'b', value: 3},
					{source: 'a', target: 'b1', value: 3},
					{source: 'b1', target: 'a1', value: 1},
					{source: 'b1', target: 'c', value: 2},
					{source: 'b', target: 'c', value: 1}
				],
				orient: 'vertical',
				label: {
					position: 'top'
				},
				lineStyle: {
					color: 'source',
					curveness: 0.5
				}
			}
		]
	}
];



function DisplayDashboard(props) {

	const [editMode, setEditMode] = useState(false);
	const [dashboardName, setDashboardName] = useState('dashboardname');
	const [dashboardDescription, setDashboardDescription] = useState('dashboarddescription');

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
	] = useUndo({name: 'dashboardname', description: 'dashboarddesciption'}); //{name: 'dashboardname', description: 'dashboarddesciption'}
	const { present: presentDashboard } = dashboardState;

	useEffect(() => {
		// props.reqGraphList();
	}, []);


	const HEIGHT_DEFAULT = 14;
	let currentDashboards = ['apple dashboard', 'oranges dashboard', 'banana dashboard', 'peanut dashboard'];

	if (demotempoptions.length === 0) {
		return <Empty description='Empty Dashboard' image={Empty.PRESENTED_IMAGE_SIMPLE} />;
	}

	let thelayout = {
		lg: [],
		md: [],
		sm: [],
		xs: [],
		xxs: []
	};
	let panels = [];

	if (demotempoptions.length === 1) {
		thelayout.lg.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.md.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.sm.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.xs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.xxs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
	} else if (demotempoptions.length === 2) {
		thelayout.lg.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.lg.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

		thelayout.md.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.md.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

		thelayout.sm.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.sm.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

		thelayout.xs.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.xs.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

		thelayout.xxs.push({w: 6, h: HEIGHT_DEFAULT, x: 0, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '0'});
		thelayout.xxs.push({w: 6, h: HEIGHT_DEFAULT, x: 6, y: 0, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: '1'});

	} else {
		for (let n = 0; n < demotempoptions.length; n++) {
			thelayout.lg.push({w: 4, h: HEIGHT_DEFAULT, x: (n % 3)*4, y: HEIGHT_DEFAULT * Math.floor(n / 3), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
			thelayout.md.push({w: 6, h: HEIGHT_DEFAULT, x: (n % 2)*6, y: HEIGHT_DEFAULT * Math.floor(n / 2), minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
			thelayout.sm.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
			thelayout.xs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
			thelayout.xxs.push({w: 12, h: HEIGHT_DEFAULT, x: 0, y: HEIGHT_DEFAULT*n, minH: HEIGHT_DEFAULT, minW: 2, moved: false, static: false, i: n.toString()});
		}
	}

	for (let n = 0; n < demotempoptions.length; n++) {
		panels.push(
			<div key={n} className='panel__shadow panel'>
				<div>

					<Grid container spacing={3}>
						<Grid item xs={11}>
							<Typography.Title level={4}>Chart title</Typography.Title>
						</Grid>
						<Grid item xs={1} style={{textAlign: 'right', fontSize: '1.2em'}}>
							{/*{editMode && <AiOutlineClose/>}*/}

						</Grid>
					</Grid>
				</div>
				<ReactEcharts option={demotempoptions[n]} style={{height: '300px', width: '100%'}} />
			</div>
		);
	}

	function onEditDashboardClick() {
		setEditMode(!editMode);
	}

	function onEditNameChange(name) {
		setDashboardName(name);
		setDashboardState({name: name, description: presentDashboard.description});
	}

	function onEditDescriptionChange(description) {
		console.log('new name;' + description);
		setDashboardState({name: presentDashboard.name, description: description});
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
						<Button ghost onClick={onEditDashboardClick}>
							{(editMode ? 'Save Dashboard' : 'Edit Dashboard')}
						</Button>
						{editMode &&
							<React.Fragment>
								<Button onClick={undoDashboardState} disabled={!canUndo}>
									Undo
								</Button>
								<Button onClick={redoDashboardState} disabled={!canRedo}>
									Redo
								</Button>
							</React.Fragment>
						}
					</Grid>
				</Grid>

				<div style={{borderBottom: '1px solid black'}}></div>
			</div>
			<div style={{marginBottom: '20px', textAlign: 'right'}}>
				<Input.Search
					placeholder="input search text"
					onSearch={value => console.log(value)}
					style={{ width: 200 }}
				/>
			</div>
			<ResponsiveReactGridLayout
				className="layout"
				breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
				cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
				rowHeight={12}
				layouts={thelayout}
				margin={[20, 20]}
				isDraggable={editMode}
				isResizable={editMode}
			>
				{panels}
			</ResponsiveReactGridLayout>
		</div>
	);
}

export default DisplayDashboard;
