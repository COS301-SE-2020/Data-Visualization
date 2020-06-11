import React from 'react';
import HomePanelButton from '../../components/HomePanelButton/HomePanelButton';
import './HomePage.css';
function HomePage(props) {
  return (
    <div>
      {(() => {
        return props.dashboardList.map((dashboard, i) => {
          return (
            <HomePanelButton
              panel={dashboard}
              key={i}
              id={i}
              isAddButton={false}
              action={(index) => props.setDashboardIndex(index)}
            />
          );
        });
      })()}
      <HomePanelButton
        isAddButton={true}
        action={() => props.onAddButtonClick(true)}
      />
    </div>
  );
}

export default HomePage;
