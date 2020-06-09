import React from 'react';
import './HomePanelButton.css';
import CloseIcon from '../../assets/img/close.png';

function HomePanelButton(props) {
    const sizeStyles = {
        width: 300,
        height: 300
    };

    function getContentPositionStyle() {
        return {
            marginTop: sizeStyles.height/2-10
        };
    }

    function getSizeStyle() {
        return {
            width: sizeStyles.width + 'px',
            height: sizeStyles.height + 'px'
        };
    }

    return (
        <div className='panelLayout panelStyling' style={getSizeStyle()}>
            {props.isAddButton ?
                <div onClick={() => props.action()}>
                    <div style={getContentPositionStyle()}>+</div>
                </div> :
                <React.Fragment>
                    <div className='closeButton' onClick={() => props.action(props.panel.id)}><img src={CloseIcon} className='closeSize' alt='' /></div>
                    <div style={getContentPositionStyle()}>{props.panel.name}</div>
                </React.Fragment>
            }
        </div>
    );
}


export default HomePanelButton;