/**
 *   @file EditConnectionDialog.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   8/10/2020    Byron Tomkinson      Original
 *
 *   Functional Description:
 *   
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, { useState } from 'react';
import './EditConnectionDialog.scss';
import { Form, Input, Button, Layout, Row, Col, Typography, Space, message } from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import { Modal} from 'antd';


/**
 *   @class EditConnectionDialog
 *   @brief Component for editing a data connection.
 */
function EditConnectionDialog(props) {


	const [visible, setVisible] = useState(true);



    const onFinish = values => {
    
	  props.editItem(props.selectedItem, values);

	  setVisible(false);
	  props.changeState();
	};
	
	const handleCancel = () => {

		setVisible(false);
		props.changeState();
	};




	return (

			<Modal
					title= 'Edit Connection'
					centered
					visible={visible}
					onCancel={handleCancel}
					
					footer={[
						
					]}
				>
					<div className='edit-box'>

						<Form
							
							name='basic'
							onFinish={onFinish}
						>

							<Form.Item
								name='nameField'
								label = 'Name:'
							>
								<Input defaultValue= {props.selectedItem.name} />
							</Form.Item>


							<Form.Item>
								<Space size={10}>
									<Button type='primary' htmlType='submit'>
										Change
                  			</Button>
									<Button htmlType='button' onClick={handleCancel}>
										Cancel
                  			</Button>
								</Space>
							</Form.Item>
						</Form>

					</div>
					


			</Modal>


	);
}

export default EditConnectionDialog;
