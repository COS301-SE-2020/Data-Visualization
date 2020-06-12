import React from 'react';
import './HomePanelButton.css';

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
          className='panelLayout panelStyling'
          style={{...getSizeStyle(),  backgroundColor : props.colour}}
          onClick={() => props.action()}>
          <div onClick={() => props.action()}>
            <div style={getContentPositionStyle()}>+</div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className='panelLayout panelStyling'
          style={{...getSizeStyle(),  backgroundColor : props.colour}}
          onClick={() => props.action(props.id)}>
          <div>
            <div style={getContentPositionStyle()}>{props.panel.name}</div>
            <div style={getContentPositionStyle1()}>{props.panel.description}</div>
          </div>
        </div>
      );
    }
  }

  return <div>{comp()}</div>;
}

export default HomePanelButton;
