import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from '../../pages/HomePage';

function App() {
  const [DashboardIndex, setDashboardIndex] = useState(-1);
  const [DashboardList, setDashboardList] = useState([]);
  const [IsAddingDashboard, setIsAddingDashboard] = useState(false);

  useEffect(() => {
    //API get Dashboard list

    setDashboardList([
      { name: 'Bank', content: '', id: 0 },
      { name: 'Healthcare', content: '', id: 1 },
    ]);
  }, []);

  const isSelected = () => DashboardIndex >= 0;
  const backToHome = () => {
    setDashboardIndex(-1);
    setIsAddingDashboard(false);
  };
  const deleteDashboard = () => {
    DashboardList.splice(DashboardIndex, 1);
    setDashboardList(DashboardList);
  };
  const AddNewDashboard = (newDash) => {
    if ('name' in newDash && newDash.name !== '') {
      setDashboardList([...DashboardList, newDash]);
    }
  };

  function router() {
    if (isSelected()) {
      return (
        <MockDisplay
          dashboard={DashboardList[DashboardIndex]}
          backToHome={backToHome}
          deleteDash={deleteDashboard}
        />
      );
    } else {
      if (IsAddingDashboard) {
        return (
          <MockAddDashboard
            addListItem={AddNewDashboard}
            backToHome={backToHome}
          />
        );
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

  return <div className='App'>{router()}</div>;
}

// function MockSelection({ list, setActive, addClicked }) {
//   return (
//     <div>
//       <div>
//         {list.map((dash, i) => (
//           <div
//             key={i}
//             style={{
//               border: '1px solid black',
//               margin: '5px',
//               cursor: 'pointer',
//               userSelect: 'none',
//             }}
//             onClick={() => setActive(i)}>
//             {dash.name}
//           </div>
//         ))}
//       </div>
//       <div
//         style={{
//           border: '1px solid black',
//           margin: '5px',
//           cursor: 'pointer',
//           userSelect: 'none',
//         }}
//         onClick={() => addClicked(true)}>
//         +
//       </div>
//     </div>
//   );
// }

function MockDisplay({ dashboard, backToHome, deleteDash }) {
  const deleteMe = () => {
    deleteDash();
    backToHome();
  };

  return (
    <div>
      <h1>Dashboard: {dashboard.name}</h1>
      <article>{dashboard.content}</article>
      <div>
        <button onClick={backToHome}>View All Dashboards</button>
      </div>
      <div>
        <button onClick={deleteMe}>Delete Dashboard</button>
      </div>
    </div>
  );
}

function MockAddDashboard({ backToHome, addListItem }) {
  const [curDash, setCurDash] = useState('');

  function Add() {
    addListItem({ name: curDash, content: '', id: -1 });
    backToHome();
  }

  return (
    <div>
      <div>
        <input
          type='test'
          placeholder='Dashboard Name'
          value={curDash}
          onChange={(e) => setCurDash(e.target.value)}
        />
      </div>
      <div>
        <button onClick={Add}>Add</button>
        <button onClick={backToHome}>Cancel</button>
      </div>
    </div>
  );
}

export default App;
