import React from 'react';
import '../../globals/globals.scss';
import HomePanelButton from '../../components/HomePanelButton/HomePanelButton';
import './HomePage.css';
import {Layout} from 'antd';
import {FooterGlobal} from '../../globals/globals';
import PageTitle from '../../components/PageTitle';

function HomePage(props) {

    const backgrounds = [{
        background: 'linear-gradient(16deg, rgba(36,11,54,1) 0%, rgba(195,20,48,1) 79%)'
    }, {
        background: 'linear-gradient(16deg, rgba(245,175,25,1) 0%, rgba(241,39,17,1) 79%)'
    }, {
        background: 'linear-gradient(16deg, rgba(168,192,255,1) 0%, rgba(63,43,150,1) 79%)'
    }, {
        background: 'linear-gradient(16deg, rgba(225,0,255,1) 0%, rgba(127,0,255,1) 79%)'
    }, {
        background: 'linear-gradient(16deg, rgba(203,53,107,1) 0%, rgba(189,63,50,1) 79%)'
    }, {
        background: 'linear-gradient(16deg, rgba(68,160,141,1) 0%, rgba(189,63,50,1) 79%)'
    }];

  return (
      <React.Fragment>
          <Layout.Content className='content-padding content-colors' >

              <PageTitle>Dashboards</PageTitle>

              {(() => {
                  return props.dashboardList.map((dashboard, i, content) => {
                      return (
                          <HomePanelButton
                              colour={backgrounds[Math.floor(Math.random() * Math.floor(backgrounds.length))]}
                              panel={dashboard}
                              description={dashboard.description}
                              key={i}
                              id={i}
                              isAddButton={false}
                              action={(index) => props.setDashboardIndex(index)}
                          />
                      );
                  });
              })()}
              <HomePanelButton
                  colour={backgrounds[Math.floor(Math.random() * Math.floor(backgrounds.length))]}
                  isAddButton={true}
                  action={() => props.onAddButtonClick(true)}
              />

          </Layout.Content>
          {FooterGlobal()}
      </React.Fragment>
  );
}

export default HomePage;
