import React from 'react';
import './HomePanelButton.css';
import {Typography } from 'antd';

const { Title } = Typography;

function HomePanelButton(props) {
  const sizeStyles = {
    width: 300,
    height: 300,
  };

  function getContentPositionStyle() {
    return {
      marginTop: sizeStyles.height / 5 - 10,
    };
  }
  function getContentPositionStyle1() {
    return {
      marginTop: sizeStyles.height / 16,
    };
  }

  function getSizeStyle() {
    return {
      width: sizeStyles.width + 'px',
      height: sizeStyles.height + 'px',
    };
  }
  function comp() {
    if (props.isAddButton) {
      return (
        <div
          className='panelLayout home-panel-add'
          style={{...getSizeStyle()}}
          onClick={() => props.action()}>
          <div onClick={() => props.action()}>
            <div style={{marginTop: '35px'}}>+</div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className='panelLayout panelStyling'
          style={{...getSizeStyle(),  ...props.colour}}
          onClick={() => props.action(props.id)}>
          <div>
            <Title level={2} style={{...getContentPositionStyle(), color: 'white'}}>{props.panel.name}</Title>
            <div style={getContentPositionStyle1()}>{props.panel.description}</div>
          </div>
        </div>
      );
    }
  }

  return <div>{comp()}</div>;
}

export default HomePanelButton;
