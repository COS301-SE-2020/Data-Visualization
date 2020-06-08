import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddDashboard.css';

function AddDashboard(props) {

    
    const [dashboardname, setDashboardname] = useState('');

      const mySubmitHandler = (event) => {
        //submit

        event.preventDefault();

        props.add({name:dashboardname});

        props.home();

      }
      

      const myChangeHandler = (event) => {
        setDashboardname(event.target.value);
      }


        return (
          <form onSubmit={mySubmitHandler}>
          <h1>Dashboard name:</h1>
          <input id = "adderField"
            type='text'
            onChange={myChangeHandler}
          />
          <input id = "submitButton"
            type='submit'
          />
          </form>
        );
      
    

  }

  export default AddDashboard;