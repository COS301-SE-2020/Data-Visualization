/**
 *   @file AddConnectionDialog.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   14/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/AddConnectionDialog.test.js
 *
 *   Functional Description:
 *   Modal for adding a connection
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */


/**
  * Imports
*/
import React, {useState} from 'react';
import {Button, Modal, Input, Select} from 'antd';
import { Form } from 'antd';

/**
  * @param props passed from DataConnection class.
  * @return React Component
*/

const AddConnectionDialog = (props) => {

    const [visible, setVisible] = useState(true);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
      };
    const tailLayout = {
        wrapperCol: { offset: 10, span: 16 },
    };

    /**
      * Update props value.
    */ 
    const onFinish = values => {
        //send url to database
        props.addItem(values);
        props.changeState();
        setVisible(false);
    };
    
    /**
      * Handle finish error.
    */  
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    /**
      * Actions for cancel
    */
    function handleCancel() {
        props.changeState();
        setVisible(false);
    };

    const selectBefore = (
        <Select defaultValue="http://" className="select-before">
            <Select.Option value="http://">http://</Select.Option>
            <Select.Option value="https://">https://</Select.Option>
        </Select>
    );

    return (
        <div >
            <Modal
                title="Enter URI"
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    
                  ]}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="uri"
                        rules={[{ required: true, message: 'Please input your a data source URI' }]}
                    >
                        <Input addonBefore={selectBefore} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary"  htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                    </Form>
            
            </Modal>
        </div>
    );
};

export default AddConnectionDialog;
