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
    const { Option } = Select;
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
        var ulteredURI;

        if(values.dataSourceItem === 'OData'){
            ulteredURI = values.uri;
            props.addItem(ulteredURI, 0);
        }
        else if(values.dataSourceItem === 'GraphQL'){
            ulteredURI = values.uri;
            props.addItem(ulteredURI, 1);
        }
     
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


    return (
        <div >
            <Modal
                title='Add data source'
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    
                  ]}
            >
                <Form
                    {...layout}
                    name='basic'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name='dataSourceItem'
                        rules={[{ required: true, message: 'Please select your data source type' }]}
                    >
                        <Select 
                            name='dataSourceType'
                            placeholder='Please select a data source type'>
                            <Option value='OData'>OData</Option>
                            <Option value='GraphQL'>GraphQL</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='uri'
                        rules={[{ required: true, message: 'Please input your a data source URI' }]}
                    >
                        <Input placeholder='Please insert data source uri'/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type='primary'  htmlType='submit'>
                            Add
                        </Button>
                    </Form.Item>
                    </Form>
            
            </Modal>
        </div>
    );
};

export default AddConnectionDialog;
