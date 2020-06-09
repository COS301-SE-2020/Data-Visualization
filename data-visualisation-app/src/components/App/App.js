import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from '../../pages/HomePage';

function App() {
  const [DashboardIndex, setDashboardIndex] = useState(-1);
  const [DashboardList, setDashboardList] = useState([]);

  useEffect(() => {
    //API get Dashboard list

    setDashboardList(['Bank', 'Healthcare']);
  }, []);

  return (
    <div className='App'>
      <HomePage dashboardList={DashboardList} />
    </div>
  );
}

export default App;
