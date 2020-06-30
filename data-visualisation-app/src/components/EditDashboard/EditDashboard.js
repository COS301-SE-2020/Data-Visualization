import React from 'react';
import GraphSuggestions from '../../components/GraphSuggestions';
import AddGraphs from '../../components/AddGraphs';
import DashboardPreview from '../../components/DashboardPreview';
import './EditDashboard.css';
import {Breadcrumb, Button, Col, Divider, Layout, Row, Tabs, Typography, Space} from 'antd';

const { TabPane } = Tabs;

function EditDashboard({ dashboard, Back, Delete, Update, addGraph, removeGraph }) {
	return (
		<Layout>
			<Layout.Sider width={300} theme='light' className='edit-dashboard-sider-styling edit-dashboard-sider-layout' >
				<div className='edit-dashboard-tabs-container' >
					<Tabs type='card'>
						<TabPane tab='Chart Suggestions' key='0' >
							<div style={{overflowY: 'scroll', overflowX: 'hidden', height: '83vh'}}>
								<GraphSuggestions add={addGraph} dashboardID={dashboard.id} />
							</div>
						</TabPane>
						<TabPane tab='Generic Charts' key='1'>
							<div style={{overflowY: 'scroll', overflowX: 'hidden', height: '83vh'}}>
								<AddGraphs add={addGraph} dashboardID={dashboard.id} />
							</div>
						</TabPane>
					</Tabs>
				</div>
			</Layout.Sider>
			<Layout>


				<Layout.Content className='content-padding content-colors' style={{marginLeft: '300px', overflowY: 'scroll'}} >

					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Breadcrumb>
								<Breadcrumb.Item>Dashboards</Breadcrumb.Item>
								<Breadcrumb.Item>{dashboard.name}</Breadcrumb.Item>
								<Breadcrumb.Item>Edit</Breadcrumb.Item>
							</Breadcrumb>
						</Col>
						<Col span={12} justify='end' style={{textAlign: 'right'}}>
							<Space size={4}  align='end'>
								<Button onClick={() => alert(noFuncYet)}>Add Connection</Button>
								<Button onClick={() => alert(noFuncYet)}>Filter</Button>
								<Button onClick={Delete}>Delete Dashboard</Button>
								<Button onClick={() => Back(false)}>Back</Button>
							</Space>
						</Col>
					</Row>
					<Typography.Title level={4} >Edit {dashboard.name} Dashboard</Typography.Title>
					<Divider />


					<div className='dashBoardWrapper'>
						<DashboardPreview dashboard={dashboard} remove={removeGraph} />
					</div>


				</Layout.Content>
			</Layout>
		</Layout>
	);
}

const noFuncYet = 'Functionality not ready yet';

export default EditDashboard;
