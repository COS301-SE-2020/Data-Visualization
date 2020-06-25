import React, { useState } from 'react';
import './AddDashboard.css';
import {Form, Input, Button, Layout, Row, Col, Typography, Space} from 'antd';

function AddDashboard(props) {
  const [dashBoardName, setDashboardName] = useState('');
  const [dashBoardDescription, setDashboardDescription] = useState('');


  const mySubmitHandler = (event) => {
    props.add({ name: dashBoardName, description: dashBoardDescription });

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

      <Layout.Content className='content-colors' style={{overflow: 'hidden'}}>

        <Row gutter={[16, 16]}>
          <Col span={8} offset={8}>

            <div className='add-dashboard-box'>
              <Typography.Title level={4} style={{marginBottom: '30px'}}>Create New Dashboard</Typography.Title>

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
                    <Button type="primary" htmlType="submit">
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
