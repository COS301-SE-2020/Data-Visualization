import React, { useState, useEffect } from 'react';
import update from 'react-addons-update';
import './App.css';

import Header from '../Header/Header';
import HomePage from '../../pages/HomePage';
import DisplayDashboard from '../../pages/DisplayDashboard';
import AddDashboard from '../../pages/AddDashboard';
import EditDashboard from '../../pages/EditDashboard';

import graph1 from '../../assets/img/Graphs/Barchart.png';
import graph2 from '../../assets/img/Graphs/PieChart.jpg';

function App() {
  const [DashboardIndex, setDashboardIndex] = useState(-1);
  const [DashboardList, setDashboardList] = useState([]);
  const [IsAddingDashboard, setIsAddingDashboard] = useState(false);

  useEffect(() => {
    //API get Dashboard list

    setDashboardList([
      {
        name: 'Banking',
        description:
          'This is a banking business intelligence dashboard that analytically displays different banking data sets across multiple systems. ',
        id: 0,
        graphs: [graph1, graph2, graph1],
      },
      {
        name: 'Health Care',
        description:
          'This is a health care dashboard that is a modern analytics tool to monitor health care KPIs in a dynamic and interactive way.',
        id: 1,
      },
    ]);
    setDashboardIndex(1);
    setIsAddingDashboard(false);
  }, []);

  const isSelected = () => DashboardIndex >= 0;
  const backToHome = () => {
    setDashboardIndex(-1);
    setIsAddingDashboard(false);
  };
  const deleteDashboard = () => {
    DashboardList.splice(DashboardIndex, 1);
    setDashboardList(DashboardList);
    backToHome();
  };
  const AddNewDashboard = (newDash) => {
    if ('name' in newDash && newDash.name !== '') {
      setDashboardList([...DashboardList, newDash]);
    }
  };
  const setDashboard = (dash) => {
    setDashboardList(
      update(DashboardList, {
        [DashboardIndex]: dash,
      })
    );
  };

  const addGraphToDashboard = (newGraph) => {
    setDashboardList(
      update(DashboardList, {
        [DashboardIndex]: {
          graphs: { $push: [newGraph] },
        },
      })
    );
  };

  const removeGraphFromDashboard = (index) => {
    setDashboardList(
      update(DashboardList, {
        [DashboardIndex]: {
          graphs: { $splice: [[index, 1]] },
        },
      })
    );
  };

  function router() {
    if (isSelected()) {
      if (IsAddingDashboard) {
        return (
          <EditDashboard
            dashboard={DashboardList[DashboardIndex]}
            Back={setIsAddingDashboard}
            Delete={deleteDashboard}
            Update={setDashboard}
            addGraph={addGraphToDashboard}
            removeGraph={removeGraphFromDashboard}
          />
        );
      } else {
        return (
          <DisplayDashboard
            dashboard={DashboardList[DashboardIndex]}
            backFunc={backToHome}
            editDashboard={setIsAddingDashboard}
          />
        );
      }
    } else {
      if (IsAddingDashboard) {
        return <AddDashboard add={AddNewDashboard} home={backToHome} />;
      } else {
        return (
          <HomePage
            dashboardList={DashboardList}
            setDashboardIndex={setDashboardIndex}
            onAddButtonClick={setIsAddingDashboard}
          />
        );
      }
    }
  }
  return (
    <div className='App'>
      <Header />
      {router()}
    </div>
  );
}

export default App;
