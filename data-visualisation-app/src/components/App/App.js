import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [DashboardIndex, setDashboardIndex] = useState(-1);
  const [DashboardList, setDashboardList] = useState([]);

  useEffect(() => {
    //API get Dashboard list

    setDashboardList(['Bank', 'Healthcare']);
  }, []);

  return (
    <div className='App'>
      <MockComp />
    </div>
  );
}

function MockComp() {
  return <div>Some body stuff...</div>;
}

export default App;
