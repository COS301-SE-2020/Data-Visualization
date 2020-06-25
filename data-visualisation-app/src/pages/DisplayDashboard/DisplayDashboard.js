import React, { useEffect } from 'react';
import { Breadcrumb, Layout, Button, Row, Col, Empty, Space} from 'antd';
import GraphPreview from '../../components/GraphPreview';
import PageTitle from '../../components/PageTitle';
import * as Constants from '../../globals/constants';


function DisplayDashboard({ backFunc, editDashboard, dashboard, reqGraphList }) {
	useEffect(() => {
		reqGraphList();
	}, []);

	return (

		<Layout.Content className='content-padding content-colors' >

			<Row gutter={[16, 16]}>
				<Col span={18}>
					<Breadcrumb>
						<Breadcrumb.Item>Dashboards</Breadcrumb.Item>
						<Breadcrumb.Item>{dashboard.name}</Breadcrumb.Item>
					</Breadcrumb>
				</Col>
				<Col span={6} style={{textAlign: 'right'}}>
					<Space size={Constants.SPACING_BUTTON}>
						<Button style={{ float: 'right' }} onClick={editDashboard}>
							Edit
						</Button>
						<Button type='Submit' style={{ float: 'right' }} onClick={backFunc}>
							Back
						</Button>
					</Space>
				</Col>
			</Row>

			<PageTitle>{dashboard.name}</PageTitle>

			<div>
				<article>

					{(() => {

						if (dashboard.graphs && dashboard.graphs.length > 0) {
							let cols;
							let output = [], d_i = 0, tmp;
							for (let r = 0; r < 3; r++) {
								cols = [];
								for (let c = 0; c < (r === 0 ? 2 : 3); c++) {
									if (d_i < dashboard.graphs.length) {
										tmp = dashboard.graphs[d_i].id;
										cols.push(<Col span={(r === 0 ? 12 : 8)}>
											<GraphPreview key={d_i} isPanel={true} data={dashboard.graphs[d_i]} />
										</Col>);
										d_i++;
									}
								}
								output.push(<Row gutter={[16, 16]}>
									{cols}
								</Row>);
							}

							return output;
						} else {
							NoGraphs();
						}

					})()}

					{/*{dashboard.graphs && dashboard.graphs.length > 0*/}
					{/*	? dashboard.graphs.map((graph, i) => <DisplayGraph key={i} data={graph} />)*/}
					{/*	: NoGraphs()}*/}

				</article>
			</div>

		</Layout.Content>
	);
}

function NoGraphs() {
	return <Empty description='Empty Dashboard' image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}

export default DisplayDashboard;
