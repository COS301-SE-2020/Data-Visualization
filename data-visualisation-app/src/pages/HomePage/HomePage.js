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
                colour={'#'+Math.floor(Math.random()*16777215).toString(16)}
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
          colour={'#'+Math.floor(Math.random()*16777215).toString(16)}
        isAddButton={true}
        action={() => props.onAddButtonClick(true)}
      />
    </div>
  );
}
export default HomePage;
