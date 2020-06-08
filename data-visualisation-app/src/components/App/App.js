import React, { useState, useEffect } from 'react';
import './App.css';
import AddDashboard from "../AddDashboard";

function App() {
  const [DashboardIndex, setDashboardIndex] = useState(-1);
  const [DashboardList, setDashboardList] = useState([]);

  useEffect(() => {
    //API get Dashboard list

    setDashboardList([{name: "Bank"}, {name: "Healthcare"}]);
  }, []);


  const GoToHome = () => {
    setDashboardIndex(-1);
  }

  const AddNewDashboard = (NewDash) => {
    setDashboardList([...DashboardList, NewDash])
  }


  return (
    <div className='App'>
      <AddDashboard list={DashboardList}  add={AddNewDashboard} home={GoToHome}/>
    </div>
  );
}


export default App;
