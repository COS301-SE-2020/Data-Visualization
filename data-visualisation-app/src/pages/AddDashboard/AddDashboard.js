import React, { useState } from 'react';
import './AddDashboard.css';

function AddDashboard(props) {
    const [dashBoardName, setDashboardName] = useState('');
    const [dashBoardDescription, setDashboardDescription] = useState('');
    const mySubmitHandler = (event) => {
        //submit
        event.preventDefault();
        props.add({name:dashBoardName, description:dashBoardDescription});
        props.home();
      };
      const myChangeHandler = (event) => {
          setDashboardName(event.target.value);
      };
      const myChangeHandler2 = (event) =>{
          setDashboardDescription(event.target.value);
      };
        return (
          <form onSubmit={mySubmitHandler}>
            <div>
              <h1>Dashboard name:</h1>
              <br/>
              <input
                id = "adderField"
                data-testid = "add-field"
                type='text'
                placeholder = "Consumer"
                value= {dashBoardName}
                onChange={myChangeHandler}
              /><br/>
              <h1>Description:</h1>
              <input
                  id = "adderField1"
                  data-testid = "add-field1"
                  type='text'
                  placeholder = "Some information about dashboard"
                  value= {dashBoardDescription}
                  onChange={myChangeHandler2}
              /><br/>
              <br/>
              <input
                id = "submitButton" 
                data-testid = "add-button"
                type='submit'
              />
              </div>
          </form>
        );
      
    

  }

  export default AddDashboard;