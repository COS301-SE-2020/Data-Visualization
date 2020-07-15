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

import {useGlobalState} from './Store';

/**
 *   Static Variables
 */
let currentURL = (constants.PRODUCTION_MODE ? constants.URL.production : constants.URL.localhost);

// deprecated functions:
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

function canRequest() {
    return request.user.isLoggedIn && request.user.apikey !== '';
}

const API = {
    dashboard: {
        list: (apikey) => axios.post(constants.URL.DASHBOARD.LIST, {apikey}),
        add: (apikey, name, description) => axios.post(constants.URL.DASHBOARD.ADD, { apikey, name, description }),
        delete: (apikey, dashboardID) => axios.post(constants.URL.DASHBOARD.REMOVE, { apikey, dashboardID }),
        update: (apikey, dashboardID, fields, data) => axios.post(constants.URL.DASHBOARD.UPDATE, { apikey, dashboardID, fields, data }),
    },
    graph: {
        list: (apikey, dashboardID) => axios.post(constants.URL.GRAPH.LIST, {apikey, dashboardID}),
        add: (dashboardID, graphTypeID) => axios.post(getAPIurl() + 'graph', { dashboardID, graphTypeID }),
        delete: (apikey, dashboardID, graphID) => axios.post(constants.URL.GRAPH.REMOVE, { apikey, dashboardID, graphID }),
        update: (apikey, dashboardID, graphID, fields, data) => axios.post(constants.URL.GRAPH.UPDATE, { apikey, dashboardID, graphID, fields, data }),
    },
    user: {
        login: (email, password) => axios.post(getAPIurl() + 'users/login', {email, password}),
        register: (name, surname, email, password, confirmPassword) => axios.post(getAPIurl() + 'users/register', {name, surname, email, password, confirmPassword}),
        logout: () => axios.post(getAPIurl() + 'users/logout', {})
    },
    dataSources: {
        list: (apikey) => axios.post(getAPIurl() + 'datasource/list', {apikey}),
        add: (apikey, dataSourceID, dataSourceUrl) => axios.post(getAPIurl() + 'datasource/add', {apikey, dataSourceID, dataSourceUrl}),
        delete: (dataSourceID, apikey) => axios.post(getAPIurl() + 'datasource/remove', {dataSourceID, apikey}),
    }
};

const request = {
    API: API,
    dashboard: {
        list: (callback) => {
            if (canRequest()) {
                API.dashboard
                    .list(request.user.apikey)
                    .then((res) => {
                        if (callback !== undefined) {
                            request.cache.dashboard.list.data = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        add: (name, description, callback) => {
            if (canRequest) {
                API.dashboard
                    .add(request.user.apikey, name, description)
                    .then((res) => {
                        if (callback !== undefined) {
                            request.cache.dashboard.list.data = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        delete: (dashboardID, callback) => {
            if (canRequest) {
                API.dashboard
                    .delete(request.user.apikey, dashboardID)
                    .then((res) => {
                        if (callback !== undefined) {
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        update: (dashboardID, updateFields, fieldData, callback) => {
            if (canRequest) {
                API.dashboard
                    .update(request.user.apikey, dashboardID, updateFields, fieldData)
                    .then((res) => {
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
    graph: {
        list: (dashboardID, callback) => {
            if (canRequest()) {
                API.graph
                    .list(request.user.apikey, dashboardID)
                    .then((res) => {
                        if (callback !== undefined) {
                            request.cache.graph.list.data = res.data;
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        delete: (dashboardID, graphID, callback) => {
            if (canRequest()) {
                API.graph
                    .delete(request.user.apikey, dashboardID, graphID)
                    .then((res) => {
                        if (callback !== undefined) {

                            if (request.cache.graph.list.data !== null) {
                                for (let g = 0; g < request.cache.graph.list.data.length; g++) {
                                    if (request.cache.graph.list.data[g].id === graphID) {
                                        request.cache.graph.list.data.splice(g, 1);
                                    }
                                }
                            }
                            callback(constants.RESPONSE_CODES.SUCCESS);
                        }
                    })
                    .catch((err) => console.error(err));
            } else {
                callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
            }
        },
        update: (dashboardID, graphID, updateFields, fieldData, callback) => {
            if (canRequest()) {
                API.graph
                    .update(request.user.apikey, dashboardID, graphID, updateFields, fieldData)
                    .then((res) => {
                        if (callback !== undefined) {

                            if (request.cache.graph.list.data !== null) {
                                for (let g = 0; g < request.cache.graph.list.data.length; g++) {
                                    if (request.cache.graph.list.data[g].id === graphID) {
                                        // todo: assuming only chart title has changed!
                                        request.cache.graph.list.data[g].title = fieldData[0];
                                    }
                                }
                            }
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
            console.log('calling login with ' + email + ' ' + password);
            API.user.login(email, password)
            .then((res) => {
                console.log('got response from login');
                console.log(res);
                if (callback !== undefined) {
                    if (successfulResponse(res)) {
                        console.log(res.data.message);
                        //localStorage.setItem('apikey', res.data.apikey);
                        //localStorage.setItem('loggedInFlag', true);
                        request.user.apikey = res.data.apikey;
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
              
                if (callback !== undefined) {
                    if (successfulResponse(res)) {
                        console.log(res);
                        request.user.apikey = res.data.apikey;
                        request.user.email = email;
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
        }, logout: (callback) => {
            API.user.logout()
            .then((res) => {
                if (callback !== undefined) {
                    if (successfulResponse(res)) {
                        console.log(res);
                        request.user.isLoggedIn = false;
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
        },
        apikey: localStorage.getItem('apikey'),
        isLoggedIn: false,
                dataSources: [
			{
				'id': 6,
				'email': 'elna@gmail.com',
				'sourceurl': 'https://services.odata.org/V2/Northwind/Northwind.svc'
			}
		]
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
        add: (apikey, dataSourceID, dataSourceUrl, callback) => {
            if (request.user.isLoggedIn) {
                API.dataSources.add(apikey, dataSourceID, dataSourceUrl).then((res) => {
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
            console.log('deleting charts');
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
        dashboard: {
            list: {
                timestamp: null,
                data: null
            }
        },
        graph: {
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