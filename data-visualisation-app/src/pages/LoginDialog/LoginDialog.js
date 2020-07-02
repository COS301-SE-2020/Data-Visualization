import React, { Fragment } from 'react';
import {useState} from 'react';
import {Button, Modal, Input, Tooltip, AutoComplete, Select, Space} from 'antd';
import {Form, Checkbox} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import './LoginDialog.scss';


//sign up constants
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

//login constants
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};



//sign up function
function SignUpDialog(props) {

  const [form] = Form.useForm();

  const onFinish = values => {
    //send to backend



    console.log('Received values of form: ', values);
  };


  const [autoCompleteResult, setAutoCompleteResult] = useState([]);


  const websiteOptions = autoCompleteResult.map(website => ({
    label: website,
    value: website,
  }));


  const [visible, setVisible] = useState(true);

  //const [confirmLoading, setConfirmLoading] = useState(false);
  //const [finished, setFinished] = useState(false);

 
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
        
      </Modal>
    </div>
  
  );
}


//login function
function LoginDialog(props) {

  const [visible, setVisible] = useState(false);
  //const [confirmLoading, setConfirmLoading] = useState(false);
  //const [finished, setFinished] = useState(false);
  //const [currentOkText, setCurrentOkText] = useState('Login');

  //const [open, setOpen] = React.useState(true);
  const [signup, setSignUp] = React.useState('false');
 
  
  function showModal() {
    setVisible(true);
    setSignUp(false);
  };

  function handleCancel() {
      setVisible(false);
  };
  function handleSignUp(e) {
    setVisible(false);
    setSignUp('true');
  };
  
  const onFinish = values => {
    //send to backend


    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id = 'loginDiv'>
      <Button id = 'loginButton' type="dashed" style={{ color: '#3C6A7F' }} onClick={showModal}>Login/Sign Up</Button>
      <Modal
          title="Login"
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
              label="Password"
              name="password"
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