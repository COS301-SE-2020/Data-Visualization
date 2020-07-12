import React, {useEffect, useState} from 'react';
import '../../globals/globals.scss';
import './HomePage.scss';
import PageTitle from '../../components/PageTitle';
import {Typography, message} from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import API from '../../helpers/apiRequests';


// import Cookies from 'universal-cookie';


const { Title } = Typography;

function HomePanelButton(props) {
    const sizeStyles = {
        width: 300,
        height: 300,
    };

    function getContentPositionStyle() {
        return {
            marginTop: sizeStyles.height / 5 - 10,
        };
    }
    function getContentPositionStyle1() {
        return {
            marginTop: sizeStyles.height / 16,
        };
    }

    function getSizeStyle() {
        return {
            width: sizeStyles.width + 'px',
            height: sizeStyles.height + 'px',
        };
    }
    function comp() {
        if (props.isAddButton) {
            return (
                <div
                    className='panelLayout home-panel-add'
                    style={{...getSizeStyle()}}
                    onClick={() => props.action()}>
                    <div onClick={() => props.action()}>
                        <div style={{marginTop: '35px'}}>+</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className='panelLayout panelStyling'
                    style={{...getSizeStyle(),  ...props.colour}}
                    onClick={() => props.action()}>
                    <div>
                        <Title level={2} style={{...getContentPositionStyle(), color: 'white'}}>{props.data.name}</Title>
                        <div style={getContentPositionStyle1()}>{props.data.description}</div>
                    </div>
                </div>
            );
        }
    }

    return <div>{comp()}</div>;
}

function HomePage(props) {

    const [isReady, setIsReady] = useState(false);
    const [dashboardList, setDashboardList] = useState([]);

    useEffect(() => {

        request.user.login('peter@neverland.com', 'Password@301', function(result) {
            if (result === constants.RESPONSE_CODES.SUCCESS) {
                request.dashboard.list(function(result) {
                    console.log('this is called');
                    setDashboardList(request.cache.dashboard.list.data);
                    setIsReady(true);
                });
            } else {
                // todo: handle when user is not logged in
            }
        });

    }, []);


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
        <div className='content--padding'>

              <PageTitle>Dashboards</PageTitle>

            {isReady ?
                <React.Fragment>
                    {(() => {
                            return dashboardList.map((dashboard) => {
                                return (
                                    <HomePanelButton
                                        colour={backgrounds[Math.floor(Math.random() * Math.floor(backgrounds.length))]}
                                        data={dashboard}
                                        key={dashboard.id}
                                        isAddButton={false}
                                        action={() => props.setDashboardIndex(dashboard.id)}
                                    />
                                );
                            });
                        }
                    )()}
                    <HomePanelButton
                        colour={backgrounds[Math.floor(Math.random() * Math.floor(backgrounds.length))]}
                        isAddButton={true}
                        action={() => props.onAddButtonClick(true)}
                    />
                </React.Fragment>
            :
                constants.LOADER
            }

        </div>
    );
}

export default HomePage;
