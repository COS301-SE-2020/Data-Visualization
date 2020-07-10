import React, {useState} from 'react';
import {Button, Modal, Input, Select} from 'antd';
import { Form } from 'antd';

import request from '../../globals/requests';
import * as constants from '../../globals/constants';

const AddConnectionDialog = (props) => {
    const [visible, setVisible] = useState(true);
 

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
      };
      const tailLayout = {
        wrapperCol: { offset: 10, span: 16 },
      };

      const onFinish = values => {

        //send url to database
        request.dataSources.add(request.user.apikey, values, function(result) {
            console.log(result);
            
            if (result === constants.RESPONSE_CODES.SUCCESS) {
              //reload??
            }
        });


      };
    
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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
}

export default AddConnectionDialog;
