/**
 *   @file Dashboards.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys      Original
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, {useEffect, useState} from 'react';
import '../../globals/globals.scss';
import './DashboardsList.scss';
import {Typography} from 'antd';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

const { Title, Paragraph } = Typography;

/**
 *   @class HomePanelButton
 *   @brief Component to display the dashboard name and description.
 */
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
                    style={{paddingTop: '100px', paddingLeft: '100px'}}
                    onClick={() => props.action()}>
                    <div className='panelLayout home-panel-add' id='button__addDashboards'>+</div>
                </div>
            );
        } else {
            return (
                <div
                    className='panelLayout panelStyling'
                    style={{...getSizeStyle(),  ...props.colour}}
                    onClick={() => props.action()}>
                        <Title ellipsis level={(props.data.name.length < 14 ? 2 : (props.data.name.length > 20 ? 4 : 3))} style={{...getContentPositionStyle(), color: 'white'}}>{props.data.name}</Title>
                        <Paragraph ellipsis={{rows: 7}} style={ {...getContentPositionStyle1(), color: 'white'}} >{props.data.description}</Paragraph>
                </div>
            );
        }
    }

    return <div>{comp()}</div>;
}

/**
 *   @class DashboardsList
 *   @brief Component to display the the list of dashboards.
 *   @details Displays every dashboard name and description in a block grid.
 */
function DashboardsList(props) {

    const [isReady, setIsReady] = useState(false);
    const [dashboardList, setDashboardList] = useState([]);

    useEffect(() => {


        if (request.user.isLoggedIn) {
            request.dashboard.list(function(result) {
                setDashboardList(request.cache.dashboard.list.data);
                setIsReady(true);
            });
        } else {
            // todo: handle when user is not logged in
        }


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

    let colorStack = [];
    for (let c = 0; c < backgrounds.length; c++) {
        colorStack.push(c);
    }

    return (
        <div className='content--padding'>

            {isReady ?
                <React.Fragment>
                    {(() => {
                            return dashboardList.map((dashboard) => {
                                return (
                                    <HomePanelButton
                                        colour={backgrounds[(colorStack.length > 0 ? colorStack.pop() : Math.floor(Math.random() * Math.floor(backgrounds.length)))]}
                                        data={dashboard}
                                        key={dashboard.id}
                                        isAddButton={false}
                                        action={() => {props.setDetails(dashboard.name, dashboard.description); props.setDashboardIndex(dashboard.id);}}
                                    />
                                );
                            });
                        }
                    )()}
                    <HomePanelButton
                        colour={backgrounds[(colorStack.length > 0 ? colorStack.pop() : Math.floor(Math.random() * Math.floor(backgrounds.length)))]}
                        isAddButton={true}
                        action={() => props.onAddButtonClick(true)}
                    />
                </React.Fragment>
            :
                <div style={{textAlign: 'center'}}>
                    {constants.LOADER}
                </div>
            }

        </div>
    );
}

export default DashboardsList;
