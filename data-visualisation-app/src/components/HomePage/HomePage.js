import React, {useEffect, useState} from 'react';
import '../../globals/globals.scss';
import './HomePage.scss';
import PageTitle from '../../components/PageTitle';
import {Typography } from 'antd';
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
                    onClick={() => props.action(props.id)}>
                    <div>
                        <Title level={2} style={{...getContentPositionStyle(), color: 'white'}}>{props.panel.name}</Title>
                        <div style={getContentPositionStyle1()}>{props.panel.description}</div>
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
        API.dashboard
            .list()
            .then((res) => {
                console.log(res);
                setDashboardList(res.data);
                setIsReady(true);
            })
            .catch((err) => console.error(err));

        //      todo: remove code below once api is working

        // does login

        // request.user.login('peter@neverland.com', 'Passwosdfrd1@', function(result) {
        //     console.log(result);
        // });


        // logs in and requests dashboard list

        // request.user.login('peter@neverland.com', 'Passwosdfrd1@', function(result) {
        //     console.log(result);
        //     if (result === constants.RESPONSE_CODES.SUCCESS) {
        //         request.dashboard.list(request.user.email, function(result) {
        //             console.log(result);
        //         });
        //     }
        // });


        // localStorage.setItem('sid', JSON.stringify({
        //     email: 'peter@neverland.com',
        //     firstname: 'Peter',
        //     lastname: 'Pan'
        // }));
        // document.cookie = 'sid=s%3Ak7gLpTLthrWUUDcL35wX3fEcWZC-CNGk.T0UrE6XYtVoKaI1%2F8ya%2BeJ73zxuS9M4IzRTDu3ewWyA; Expires=Sun, 02 Aug 2020 18:22:37 GMT; Path=/; HttpOnly; Domain=localhost';
        //
        //
        // request.dashboard.list('peter@neverland.com', function(result) {
        //     console.log(result);
        // });



    //     fetch('http://localhost:8000/users/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         credentials: 'include',
    //         body: JSON.stringify({
    //             email: 'peter@neverland.com',
    //             password: 'Passwosdfrd1@',
    //         }),
    //     }).then(res => {
    //         console.log(res);
    //         console.log(res.headers.get('set-cookie')); // undefined
    //         console.log(document.cookie); // nope
    //         return res.json();
    //     }).then(json => {
    //         console.log('got the followign response');
    //         console.log(json);
    //         // if (json.success) {
    //         // this.setState({ error: '' });
    //         // this.context.router.push(json.redirect);
    //         // }
    //         fetch('http://localhost:8000/dashboards/list', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             credentials: 'include',
    //             body: JSON.stringify({
    //                 email: 'peter@neverland.com'
    //             }),
    //         }).then(res => {
    //             console.log(res);
    //             console.log(res.headers.get('set-cookie')); // undefined
    //             console.log(document.cookie); // nope
    //             return res.json();
    //         }).then(json => {
    //             console.log('got the followign response');
    //             console.log(json);
    //             // if (json.success) {
    //             // this.setState({ error: '' });
    //             // this.context.router.push(json.redirect);
    //             // }
    //
    //         });
    //     });

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
                            return dashboardList.map((dashboard, i, content) => {
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
