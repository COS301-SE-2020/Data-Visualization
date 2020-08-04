/**
 *   @file LoginDialog.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   14/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/LoginDialog.test.js
 *
 *   Functional Description:
 *   Provides a modal that promtes the user to login in or sign up.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React from 'react';
import {useState} from 'react';
import {Button, Modal, Input, Tooltip, AutoComplete, Select} from 'antd';
import {Form, Checkbox, Spin} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import {useGlobalState} from '../../globals/Store';
import './LoginDialog.scss';
import { notification } from 'antd';



const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

/**
  * Constants 
*/
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};



/**
  * @param props passed from LoginDialog function.
  * @return React Component
*/
function SignUpDialog(props) {

  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
    * Notifications
  */
  const openNotification = placement => {
    notification.info({
      message: 'Invalid data',
      description:
        'The server rejected your infomation',
      placement,
    });
  };
  const signUpSuccessNotification = placement => {
    notification.info({
      message: 'Sign up success',
      description:
        'You are now successfully signed up with us',
      placement,
    });
  };


  const [form] = Form.useForm();


  /**
    * Send request to backend with form infomation.
  */
  const onFinish = values => {
    setConfirmLoading(true);
    request.user.register(values.name, values.surname, values.email, values.password, values.confirm, function(result) {
      console.log(result);
      if (result === constants.RESPONSE_CODES.SUCCESS) {
        /**
          * On Success
        */
        setConfirmLoading(false);
        setVisible(false);
        signUpSuccessNotification('bottomRight');
      }
      else{
        /**
          * On fail
        */
        setConfirmLoading(false);
        openNotification('bottomRight');
      }
    });
    
  };

  /**
    * Autocomplete
  */
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const websiteOptions = autoCompleteResult.map(website => ({
    label: website,
    value: website,
  }));

  const [visible, setVisible] = useState(true);

  /**
    * Actions for cancel
  */
  function handleCancel(e) {
      setVisible(false);
  };


  return (
    <div >
      <Modal
          title='Sign Up'
          visible={visible}
          onCancel={handleCancel}

          footer={[
            
            ]}
          >
        <Spin spinning={confirmLoading}></Spin>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={
              <span>
                Name&nbsp;
                <Tooltip title="What do you want others to call you?">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="surname"
            label='Surname'
            rules={[{ required: true, message: 'Please input your surname!', whitespace: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords that you entered do not match!');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={confirmLoading}></Spin>
      </Modal>
      
    </div>
  
  );
}




/**
  * @param props passed from App function.
  * @return React Component
*/
function LoginDialog(props) {

  
  const [visible, setVisible] = useState(false);
  const [signup, setSignUp] = React.useState('false');
  const [confirmLoading, setConfirmLoading] = useState(false);
 
  
  /**
    * Notifications
  */
  const openNotification = placement => {
    notification.info({
      message: 'Invalid credentials',
      description:
        'Either your email or password was incorrect. Try again',
      placement,
    });
  };
  const loginSuccessNotification = placement => {
    notification.info({
      message: 'Welcome',
      description:
        'Hope you have a great day',
      placement,
    });
  };
  const logoutSuccessNotification = placement => {
    notification.info({
      message: 'Bye',
      description:
        'Have a good day',
      placement,
    });
  };

  /**
    * Make modal visible or not
  */
  function showModal() {
    setVisible(true);
    setSignUp(false);
  };

  /**
    * Actions for cancel
  */
  function handleCancel() {
      setVisible(false);
  };

  /**
    * Function to change signUp state to 'true'
  */
  function handleSignUp(e) {
    setVisible(false);
    setSignUp('true');
  };


  /**
    * useGlobalState used and deglared from Store.js
  */
  const [state, dispatch] = useGlobalState();
 

  /**
    * Logs the user out.
    * Sends the request to backend.
    * After success: 
    * Resets the data sources list
    * Resets the page type back to home
    * Resets the explore stage
    * Resets the dashbaord stage
    * Changes global isLoggedIn variable to false
    * Displays notification 
  */
  function handleLogout(){
    /**
     * Send request to backend
    */
    request.user.logout(function(result) {
      console.log(result);
      if (result === constants.RESPONSE_CODES.SUCCESS) {
        /**
          * Reset on success
        */
        request.user.dataSources = [
          {
            'id': 6,
            'email': 'elna@gmail.com',
            'sourceurl': 'https://services.odata.org/V2/Northwind/Northwind.svc'
          }
        ];
        props.handlePageType('home');
        props.setDashboardIndex('');
        props.setDashboardStage('dashboardHome');
        props.setIsAddingDashboard(false);
        props.setExploreStage('dataConnection');
        dispatch({ isLoggedIn: false }); 
        logoutSuccessNotification('bottomRight');
      }
    });
 }


  /**
    * Sends request to backend with form infomation.
  */   
  const onFinish = values => {
    setConfirmLoading(true);
    request.user.login(values.email, values.password, values.remember, function(result) {
      console.log(result);
      if (result === constants.RESPONSE_CODES.SUCCESS) {
          /**
            * On success
          */
          setConfirmLoading(false);
          dispatch({ isLoggedIn: true });
          setVisible(false);
          props.handlePageType('home');
          props.setExploreStage('dataConnection');
          loginSuccessNotification('bottomRight');
      }
      else{
        /**
          * On fail
        */
        setConfirmLoading(false);
        openNotification('bottomRight');
      }
    });
 };

  /**
    * Handle finish error.
  */  
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id = 'loginDiv'>
    
        {
          state.isLoggedIn === false ?
            <Button ghost className='button__login' id = 'loginButton' type="dashed" onClick={showModal}>Login/Sign Up</Button>
            :
            <Button ghost className='button__login' id = 'logout' type="dashed" onClick={handleLogout}>Logout</Button>
        }
      <Modal
          title="Login"
          visible={visible}
          onOk={onFinish}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
          footer={[
         
          ]}
          >
          <Spin spinning={confirmLoading}>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish }
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
          

              <Button type="primary" htmlType="submit">
                Login
              </Button>

              <Button htmlType="button" style={{marginLeft: '10px'}} onClick = {handleSignUp}>
                Sign Up
              </Button>
              
            </Form.Item>

          </Form>
          </Spin>
      </Modal>
     
      
      <main>
        {
          signup === 'true' ?
            <SignUpDialog/>
            :
            null
        }
      </main>
    </div>
    
    
  );
}

export default LoginDialog;