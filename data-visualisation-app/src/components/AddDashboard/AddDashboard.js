/**
 *   @file App.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys      Original
 *
 *   Functional Description:
 *   Enables user to add a new dashboard.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, { useState } from 'react';
import './AddDashboard.css';
import { Form, Input, Button, Layout, Row, Col, Typography, Space, message } from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';


/**
 *   @class AddDashboard
 *   @brief Component for form input from user to create a new dashboard.
 */
function AddDashboard(props) {
	const [dashBoardName, setDashboardName] = useState('');
	const [dashBoardDescription, setDashboardDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);


	const mySubmitHandler = (event) => {
		// props.add({ name: dashBoardName, description: dashBoardDescription });

		setIsLoading(true);
		request.dashboard.add(dashBoardName, dashBoardDescription, function (result) {
			setIsLoading(false);
			if (result === constants.RESPONSE_CODES.SUCCESS) {
				message.success('Dashboards was successfully created.');
				props.setDetails(dashBoardName, dashBoardDescription);
				props.home();
			} else {
				message.error('There was a problem creating a new dashboard.');
			}
		});

	};

	const myChangeHandler = (event) => {
		setDashboardName(event.target.value);
	};
	const myChangeHandler2 = (event) => {
		setDashboardDescription(event.target.value);
	};

	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};

	return (

		<Layout.Content style={{ overflow: 'hidden' }}>

			<Row gutter={[16, 16]}>
				<Col span={8} offset={8}>

					<div className='add-dashboard-box'>
						<Typography.Title level={4} style={{ marginBottom: '30px' }}>Create New Dashboard</Typography.Title>

						<Form
							{...layout}
							name="basic"
							initialValues={{ remember: false }}
							onFinish={mySubmitHandler}
						>

							<Form.Item
								label="Name:"
								name="adderField"
								placeholder='Consumer'
								onChange={myChangeHandler}
								rules={[{ required: true, message: 'Provide a dashboard name.' }]}
							>
								<Input />
							</Form.Item>

							<Form.Item
								label="Description:"
								name="adderField1"
								placeholder='Short Description'
								onChange={myChangeHandler2}
								rules={[{ required: true, message: 'Some information about dashboard.' }]}
							>
								<Input.TextArea />
							</Form.Item>

							<Form.Item wrapperCol={{ offset: 8, span: 32 }}>
								<Space size={10}>
									<Button type="primary" htmlType="submit" loading={isLoading}>
										Create
                    				</Button>
									<Button htmlType='button' onClick={props.home}>
										Cancel
                    				</Button>
								</Space>
							</Form.Item>
						</Form>

					</div>

				</Col>
			</Row>
		</Layout.Content>
	);
}

export default AddDashboard;
