import React, { Fragment } from 'react';
import {useState} from 'react';
import {Button, Modal, Input, Tooltip, AutoComplete, Select, Space} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';

import './LoginDialog.scss';

function SignUpDialog(props) {

  const [visible, setVisible] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentOkText, setCurrentOkText] = useState('Sign up');

  function handleOk(e) {
    //send to back end

    setVisible(false);
  };
  function handleCancel(e) {
      setVisible(false);
  };


  return (
    <div >
      <Modal
          title="Sign Up"
          visible={visible}
          okText={currentOkText}
          onCancel={handleCancel}

          footer={[
              <Button onClick={handleCancel}>
                Cancel
              </Button>,
              <Button type="primary" confirmLoading={confirmLoading} onClick={handleOk}>
                Sign Up
              </Button>,
            ]}
          >
        <Input placeholder="Name" />
        <br />
        <br />
        <Input placeholder="Surname" />
        <br />
        <br />
        <Input
          placeholder="Email"
          suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
          }
        />
        <br />
        <br />
        <Input
          placeholder="Username"
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
          }
        />
        <br />
        <br />
        <Input.Password
          placeholder="Create a password"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
        <br />
        <br />
        <Input.Password
          placeholder="Confirm password"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
        
      </Modal>
    </div>
    
    //<SignUpDialog pType= {props.pType}  setpType= {props.setpType}/>
  );
}

function LoginDialog(props) {

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentOkText, setCurrentOkText] = useState('Login');

  //const [open, setOpen] = React.useState(true);
  const [signup, setSignUp] = React.useState('false');
 
  
  function showModal() {
    setVisible(true);
    setSignUp(false);
};

  function handleOk(e) {
    //send to back end

    setVisible(false);
  };
  function handleCancel(e) {
      console.log(e);
      setVisible(false);
  };
  function handleSignUp(e) {
    //send to back end
    setVisible(false);
    setSignUp('true');
  };
  

  return (
    <div id = 'loginDiv'>
      <Button id = 'loginButton' type="dashed" style={{ color: '#3C6A7F' }} onClick={showModal}>Login/Sign Up</Button>
      <Modal
          title="Login"
          visible={visible}
          okText={currentOkText}
          onCancel={handleCancel}

          footer={[
          <Button  type="dashed" ghost confirmLoading={confirmLoading} onClick = {handleSignUp}>
              Sign up
            </Button>,
            <Button onClick={handleCancel}>
              Cancel
            </Button>,
            <Button type="primary" confirmLoading={confirmLoading} onClick={handleOk}>
              Login
            </Button>,
          ]}
          >
        <Input
          placeholder="Enter your username"
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
          <Tooltip title="Extra information">
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
          }
        />
        <br />
        <br />
        <Input.Password
          placeholder="input password"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
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