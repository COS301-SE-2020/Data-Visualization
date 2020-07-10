/**
 *   @file requests.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   3/7/2929   Gian Uys            Original
 *
 *   Test Cases: data-visualisation-app/tests/App/App.js
 *
 *   Functional Description:
 *   This file implements wrapper functions for all API requests to and from the server.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import axios from 'axios';
import * as constants from './constants.js';

/**
 *   Static Variables
 */
let currentURL = (constants.PRODUCTION ? constants.URL.production : constants.URL.localhost);



const inPROD = false;
const inDEV_PORT = 8000;

function getAPIurl() {
    let rest = window.location.href;
    if (!inPROD) rest = rest.substring(0, rest.lastIndexOf(':') + 1) + inDEV_PORT + '/';
    console.log(rest);
    return rest;
}

function successfulResponse(res) {
    return res.status >= 200 && res.status < 300;
}

const API = {
    dashboard: {
        list: (email) => axios.post(getAPIurl() + 'dashboards/list', {'email' : 'pieterpieterpieter@gmail.com'}),
        add: (name, description) => axios.post(getAPIurl() + 'dashboard', { name, description }),
        delete: (dashboardID) => axios.delete(getAPIurl() + 'dashboard', { data: { dashboardID } }),
        update: (dashboardID, fields, data) => axios.put(getAPIurl() + 'dashboard', { dashboardID, fields, data }),
    },
    graph: {
        list: (dashboardID) =>
            axios.get(getAPIurl() + 'graph', {
                params: {
                    dashboardID: dashboardID,
                },
            }),
        add: (dashboardID, graphTypeID) => axios.post(getAPIurl() + 'graph', { dashboardID, graphTypeID }),
        delete: (graphID) => axios.delete(getAPIurl() + 'graph', { data: { graphID } }),
        update: (graphID, fields, data) => axios.put(getAPIurl() + 'graph', { graphID, fields, data }),
    },
    user: {
        login: (email, password) => axios.post(getAPIurl() + 'users/login', {email, password}),
        register: (name, surname, email, password, confirmPassword) => axios.post(getAPIurl() + 'users/register', {name, surname, email, password, confirmPassword}),
        logout: () => axios.post(getAPIurl() + 'users/logout', {})
    },
    dataSources: {
        list: (apikey) => axios.post(getAPIurl() + 'datasource/list', {apikey}),
        add: (apikey, dataSourceUrl) => axios.post(getAPIurl() + 'datasource/add', {apikey, dataSourceUrl}),
        delete: (dataSourceID, apikey) => axios.post(getAPIurl() + 'datasource/remove', {dataSourceID, apikey}),
    }
};

const request = {
    API: API,
    dashboard: {
        list: (email, callback) => {
            if (request.user.isLoggedIn) {
                API.dashboard
                    .list(email)
                    .then((res) => {
                        console.log(res);
                        if (callback !== undefined) {
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        }
    },
    user: {
        login: (email, password, callback) => {
            API.user.login(email, password)
            .then((res) => {
                if (callback !== undefined) {
                    if (successfulResponse(res)) {
                        console.log(res.data.message);
                        request.user.apikey = res.data.apikey;
                        request.user.email = email;
                        request.user.isLoggedIn = true;
                        callback(constants.RESPONSE_CODES.SUCCESS);
                    } else {
                        callback(constants.RESPONSE_CODES.BAD_REQUEST_NETWORK_ERROR);
                    }
                }
            })
            .catch((err) => {
                if (callback !== undefined) {
                    callback(constants.RESPONSE_CODES.NETWORK_ERROR);
                }
            });
        }, register: (name, surname, email, password, confirmPassword, callback) => {
            API.user.register(name, surname, email, password, confirmPassword)
                .then((res) => {
                    console.log(res);
                    request.user.apikey = res.data.apikey;
                    request.user.email = email;

                })
                .catch((err) => console.error(err));
        }, logout: (callback) => {
            API.user.logout()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => console.error(err));
        },
        apikey: localStorage.getItem(''),
        isLoggedIn: localStorage.getItem(''),
        dataSources: [],
    },


    dataSources: {
        list: (apikey, callback) => {
            if (request.user.isLoggedIn) {
                API.dataSources.list(apikey).then((res) => {
                    console.log(res);
                    if (callback !== undefined) {
                        if (successfulResponse(res)) {
                            console.log(res);
                            request.user.dataSources = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        } else {
                            callback(constants.RESPONSE_CODES.BAD_REQUEST_NETWORK_ERROR);
                        }
                    }
                })
                .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        add: (apikey, dataSourceUrl, callback) => {
            if (request.user.isLoggedIn) {
                API.dataSources.add(apikey, dataSourceUrl).then((res) => {
                    console.log(res);
                    if (callback !== undefined) {
                        if (successfulResponse(res)) {
                            console.log(res);

                            //add to request.user.dataSources array
                            //request.user.dataSources = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        } else {
                            callback(constants.RESPONSE_CODES.BAD_REQUEST_NETWORK_ERROR);
                        }
                    }
                })
                .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        delete: (dataSourceID, apikey, callback) => {
            if (request.user.isLoggedIn) {
                API.dataSources.delete(dataSourceID, apikey).then((res) => {
                    console.log(res);
                    if (callback !== undefined) {
                        if (successfulResponse(res)) {
                            console.log(res);

                            //delete from request.user.dataSources array
                            //request.user.dataSources = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        } else {
                            callback(constants.RESPONSE_CODES.BAD_REQUEST_NETWORK_ERROR);
                        }
                    }
                })
                .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        }
    },
    cache: {
        dashbaord: {
            list: {
                timestamp: null,
                data: null
            }
        },
        user: {
            email: '',
            apikey: ''
        }
    }
};


// Todo: incorporate the code below into requests
//
// const reqDashboardList = () => {
//     API.dashboard
//         .list()
//         .then((res) => {
//             console.log(res);
//             setDashboardList(res.data);
//         })
//         .catch((err) => console.error(err));
// };
//
// const reqDashboardAdd = (newDash) => {
//     API.dashboard
//         .add(newDash.name, newDash.description)
//         .then((res) => {
//             console.log(res);
//             reqDashboardList();
//             backToHome();
//         })
//         .catch((err) => console.error(err));
// };
// const reqDashboardDelete = () => {
//     API.dashboard
//         .delete(DashboardList[DashboardIndex].id)
//         .then((res) => {
//             console.log(res);
//             reqDashboardList();
//             backToHome();
//         })
//         .catch((err) => console.error(err));
// };
// const reqDashboardUpdate = () => {
//     API.dashboard
//         .update()
//         .then((res) => {
//             console.log(res);
//             // setDashboardList(res.data);
//         })
//         .catch((err) => console.error(err));
// };
//
// const reqGraphList = () => {
//     console.log(DashboardList[DashboardIndex].id);
//     API.graph
//         .list(DashboardList[DashboardIndex].id)
//         .then((res) => {
//             console.log(res);
//             setGraphList(res.data);
//         })
//         .catch((err) => console.error(err));
// };
// const reqGraphAdd = (newGraph) => {
//     API.graph
//         .add(newGraph.dashboardID, newGraph.graphtypeid)
//         .then((res) => {
//             console.log(res);
//             reqGraphList();
//         })
//         .catch((err) => console.error(err));
// };
// const reqGraphDelete = (gID) => {
//     API.graph
//         .delete(gID)
//         .then((res) => {
//             console.log(res);
//             reqGraphList();
//         })
//         .catch((err) => console.error(err));
// };
// const reqGraphUpdate = () => {
//     API.graph
//         .update()
//         .then((res) => {
//             console.log(res);
//             // setGraphList(res.data);
//         })
//         .catch((err) => console.error(err));
// };

export default request;