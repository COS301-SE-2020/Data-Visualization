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
            <div>
              <h1>Dashboard name:</h1>
              <br></br>
              <input id = "adderField"
                type='text'
                onChange={myChangeHandler}
              />
              <br></br>
              <input id = "submitButton"
                type='submit'
              />
              </div>
          </form>
        );
      
    

  }

  export default AddDashboard;