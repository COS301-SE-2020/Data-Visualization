import React, { useState } from 'react';
import './AddEntities.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Button} from 'antd';

function AddEntities(props) {

  const back = () => {
    props.setStage('dataConnection');
  };

  return (
    
    <div>
      <Button icon={<ArrowBackIosIcon />} onClick={back}>
                
      </Button>
      <p>
        Entities
      </p>
    </div>
    
  );
}

export default AddEntities;
