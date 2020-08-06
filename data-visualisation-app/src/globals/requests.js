/**
 *   @file requests.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   3/7/2020   Gian Uys            Original
 *   5/7/2020   Byron Tominson      Data Sources object added
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
import LoginDialog from '../pages/LoginDialog';

/**
 *   Static Variables
 */
function successfulResponse(res) {
	return res.status >= 200 && res.status < 300;
}

function canRequest() {
	return request.user.isLoggedIn && request.user.apikey !== '';
}

function generateID() {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < 10; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const API = {
	dashboard: {
		list: (apikey) => axios.post(constants.URL.DASHBOARD.LIST, { apikey }),
		add: (apikey, dashboardID, name, description) => axios.post(constants.URL.DASHBOARD.ADD, { apikey, dashboardID, name, description }),
		delete: (apikey, dashboardID) => axios.post(constants.URL.DASHBOARD.REMOVE, { apikey, dashboardID }),
		update: (apikey, dashboardID, fields, data) => axios.post(constants.URL.DASHBOARD.UPDATE, { apikey, dashboardID, fields, data }),
	},
	graph: {
		list: (apikey, dashboardID) => axios.post(constants.URL.GRAPH.LIST, { apikey, dashboardID }),
		add: (apikey, dashboardID, title, graphID, options, metadata) => axios.post(constants.URL.GRAPH.ADD, { apikey, dashboardID, title, graphID, options, metadata }),
		delete: (apikey, dashboardID, graphID) => axios.post(constants.URL.GRAPH.REMOVE, { apikey, dashboardID, graphID }),
		update: (apikey, dashboardID, graphID, fields, data) => axios.post(constants.URL.GRAPH.UPDATE, { apikey, dashboardID, graphID, fields, data }),
	},
	user: {
		login: (email, password) => axios.post(constants.URL.USER.LOGIN, { email, password }),
		register: (name, surname, email, password, confirmPassword) => axios.post(constants.URL.USER.REGISTER, { name, surname, email, password, confirmPassword }),
		logout: () => axios.post(constants.URL.USER.LOGOUT, {}),
	},
	dataSources: {
		list: (apikey) => axios.post(constants.URL.DATASOURCE.LIST, { apikey }),
		add: (apikey, dataSourceID, dataSourceUrl) => axios.post(constants.URL.DATASOURCE.ADD, { apikey, dataSourceID, dataSourceUrl }),
		delete: (dataSourceID, apikey) => axios.post(constants.URL.DATASOURCE.REMOVE, { dataSourceID, apikey }),
	},
	entities: {
		list: (sourceurl) => axios.post(constants.URL.DATASOURCE.ENTITIES, { sourceurl }),
	},
	suggestion: {
		graph: (sourceurl) => axios.post(constants.URL.SUGGESTIONS.GRAPHS, { sourceurl }),
	},
};

/**
 *  @class request
 *  @brief Manages all requests to the API and stores the retrieved data locally.
 *
 *  All functions defined within request object implicitly manipulates the database and will always populate the
 *  request.cache object with the retrieved results. Each function should have a callback function provided as the
 *  last parameter passed. This function will be called at the end of request function and will always be passed
 *  any of the defined RESPONSE_CODE's within the constants.js file.
 */
const request = {
	API: API,
	dashboard: {
		/**
		 *  Requests the list of dashboards.
		 *
		 *  @param callback Function called at end of execution.
		 */
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
		/**
		 *  Adds a new dashboard.
		 *
		 *  @param name Name of the new dashboard.
		 *  @param description Description of the new dashboard.
		 *  @param callback Function called at end of execution.
		 */
		add: (name, description, callback) => {
			if (canRequest) {
				API.dashboard
					.add(request.user.apikey, generateID(), name, description)
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
		/**
		 *  Deletes an existing dashboard.
		 *
		 *  @param dashboardID Unique dashboard id string value.
		 *  @param callback Function called at end of execution.
		 */
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
		/**
		 *  Generic update of an existing dashboard.
		 *
		 *  @param dashboardID Unique dashboard id string value.
		 *  @param updateFields Database fields to be updated.
		 *  @param fieldData Data of the fields that are to be updated. The ordering of the data is parallel to the
		 *                  parameter updateFields.
		 *  @param callback Function called at end of execution.
		 */
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
		},
	},
	graph: {
		/**
		 *  Adds a new graph.
		 *
		 *  @param dashboardID Unique dashboard id string value of the dashboard in which the graph resides.
		 *  @param title Title of the newly added graph.
		 *  @param options JSON object that stores all possible data concerning the graph. Such as the type and data
		 *                 points.
		 *  @param metadata JSON object that stores data concerning the graph in the context of the application. Such
		 *                  as data specifying the representation of the graph on the dashboard.
		 *  @param callback Function called at end of execution.
		 */
		add: (dashboardID, title, options, metadata, callback) => {
			console.debug('Requesting graph.add with:', dashboardID, title, options, metadata);
			if (canRequest()) {
				API.graph
					.add(request.user.apikey, dashboardID, title, generateID(), options, metadata)
					.then((res) => {
						if (callback !== undefined) {
							console.debug('Response from graph.add:', res);
							callback(constants.RESPONSE_CODES.SUCCESS);
						}
					})
					.catch((err) => console.error(err));
			} else {
				callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
			}
		},
		/**
		 *  Requests the list of graphs.
		 *
		 *  @param dashboardID Unique dashboard id string value of the dashboard in which the graph resides.
		 *  @param callback Function called at end of execution.
		 */
		list: (dashboardID, callback) => {
			if (canRequest()) {
				API.graph
					.list(request.user.apikey, dashboardID)
					.then((res) => {
						if (callback !== undefined) {
							request.cache.graph.list = res.data;
							callback(constants.RESPONSE_CODES.SUCCESS);
						}
					})
					.catch((err) => console.error(err));
			} else {
				callback(constants.RESPONSE_CODES.LOGGED_OUT_ERROR);
			}
		},
		/**
		 *  Deletes an existing graph.
		 *
		 *  @param dashboardID Unique dashboard id string value of the dashboard in which the graph resides.
		 *  @param graphID Unique graph id string value.
		 *  @param callback Function called at end of execution.
		 */
		delete: (dashboardID, graphID, callback) => {
			console.debug('Requesting graph.delete with:', dashboardID, graphID);
			if (canRequest()) {
				API.graph
					.delete(request.user.apikey, dashboardID, graphID)
					.then((res) => {
						if (callback !== undefined) {
							if (request.cache.graph.list !== null) {
								for (let g = 0; g < request.cache.graph.list.length; g++) {
									if (request.cache.graph.list[g].id === graphID) {
										request.cache.graph.list.splice(g, 1);
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
		/**
		 *  Generic update of an existing graph.
		 *
		 *  @param dashboardID Unique dashboard id string value.
		 *  @param graphID Unique graph id string value.
		 *  @param updateFields Database fields to be updated.
		 *  @param fieldData Data of the fields that are to be updated. The ordering of the data is parallel to the
		 *                  parameter updateFields.
		 *  @param callback Function called at end of execution.
		 */
		update: (dashboardID, graphID, updateFields, fieldData, callback) => {
			console.debug('Requesting graph.update with:', dashboardID, graphID, updateFields, fieldData);
			if (canRequest()) {
				API.graph
					.update(request.user.apikey, dashboardID, graphID, updateFields, fieldData)
					.then((res) => {
						if (callback !== undefined) {
							console.debug('Response from graph.update:', res);

							if (request.cache.graph.list !== null) {
								for (let g = 0; g < request.cache.graph.list.length; g++) {
									if (request.cache.graph.list[g].id === graphID) {
										// todo: assuming only chart title has changed!
										request.cache.graph.list[g].title = fieldData[0];
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
	},
	user: {
		/** Log user back in if they specified to remember them.
		 */
		rememberLogin: (isLoggedInMutator) => {
			request.user.setIsLoggedIn = isLoggedInMutator;
			if (localStorage.getItem('apikey') !== 'null') {
				request.user.apikey = localStorage.getItem('apikey');
				request.user.isLoggedIn = true;
			}
			return request.user.isLoggedIn;
		},
		/**
		 *  Requests an existing user to be logged in.
		 *
		 *  @param email Email of the existing user account.
		 *  @param password Password of the existing user account.
		 *  @param callback Function called at end of execution.
		 */
		login: (email, password, remember, callback) => {
			API.user
				.login(email, password)
				.then((res) => {
					if (callback !== undefined) {
						if (successfulResponse(res)) {
							if (remember)
								localStorage.setItem('apikey', res.data.apikey);
							request.user.apikey = res.data.apikey;
							request.user.isLoggedIn = true;
							request.user.setIsLoggedIn(true);
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
		/**
		 *  Registers a new user account.
		 *
		 *  @param name First name of the new user.
		 *  @param surname Surname of the new user.
		 *  @param email Email of the existing user account.
		 *  @param password Password of the existing user account.
		 *  @param confirmPassword Password entered again for confirmation.
		 *  @param callback Function called at end of execution.
		 */
		register: (name, surname, email, password, confirmPassword, callback) => {
			API.user
				.register(name, surname, email, password, confirmPassword)
				.then((res) => {
					if (callback !== undefined) {
						if (successfulResponse(res)) {
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
		},
		/**
		 *  Logs out an existing user account.
		 *
		 *  @param callback Function called at end of execution.
		 */
		logout: (callback) => {
			API.user
				.logout()
				.then((res) => {
					if (callback !== undefined) {
						if (successfulResponse(res)) {
							localStorage.setItem('apikey', null);
							request.user.isLoggedIn = false;
							request.user.setIsLoggedIn(false);
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
		setIsLoggedIn: null,
		dataSources: [
			{
				id: 6,
				email: 'elna@gmail.com',
				sourceurl: 'https://services.odata.org/V2/Northwind/Northwind.svc',
			},
		],
		entities : [],
	},

	dataSources: {
		/**
		 *  Request a list of data sources.
		 *
		 *  @param callback Function called at end of execution.
		 */
		list: (apikey, callback) => {
			if (request.user.isLoggedIn) {
				API.dataSources
					.list(apikey)
					.then((res) => {
						console.debug(res);
						if (callback !== undefined) {
							if (successfulResponse(res)) {
								console.debug(res);

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
		/**
		 *  Adds a new data source.
		 *
		 *  @param dataSourceID Unique data source id string value.
		 *  @param dataSourceUrl Fully qualified url of the new data source.
		 *  @param callback Function called at end of execution.
		 */
		add: (apikey, dataSourceID, dataSourceUrl, callback) => {
			if (request.user.isLoggedIn) {
				API.dataSources
					.add(apikey, dataSourceID, dataSourceUrl)
					.then((res) => {
						console.debug(res);
						if (callback !== undefined) {
							if (successfulResponse(res)) {
								console.debug(res);

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
		/**
		 *  Deletes an existing data source.
		 *
		 *  @param dataSourceID Unique data source id string value.
		 *  @param callback Function called at end of execution.
		 */
		delete: (dataSourceID, apikey, callback) => {
			console.debug('Requesting dataSources.delete');
			if (request.user.isLoggedIn) {
				API.dataSources
					.delete(dataSourceID, apikey)
					.then((res) => {
						console.debug(res);
						if (callback !== undefined) {
							if (successfulResponse(res)) {
								console.debug(res);

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
		},
	},

	entities:{
		/**
		 *  Request a list of entites.
		 *
		 *  @param callback Function called at end of execution.
		 */
		list: (sourceurl, callback) => {
			API.entities
				.list(sourceurl)
					.then((res) => {
						console.debug(res);
						if (callback !== undefined) {
							if (successfulResponse(res)) {
								
								request.user.entities = res.data;

								callback(constants.RESPONSE_CODES.SUCCESS);
							} else {
								callback(constants.RESPONSE_CODES.BAD_REQUEST_NETWORK_ERROR);
							}
						}
					})
					.catch((err) => console.error(err));
		},
	},

	suggestions: {
		/**
		 *  Requests a single graph suggestion.
		 *
		 *  request.cache.suggestions.graph.current will be populated with the retrieved suggestion.
		 *
		 *  @param sourceurl Source from which the suggestions be made of.
		 *  @param callback Function called at end of execution.
		 */
		graph: (sourceurl, callback) => {
			console.debug('Requesting suggestion.graph with:', sourceurl);
			API.suggestion
				.graph(sourceurl)
				.then((res) => {
					if (callback !== undefined) {
						console.debug('Response from suggestion.graph:', res);
						request.cache.suggestions.graph.current = res.data;

						callback(constants.RESPONSE_CODES.SUCCESS);
					}
				})
				.catch((err) => console.error(err));
		},
		/**
		 *  Requests an amount of graph suggestions.
		 *
		 *  @param sourceurl Source from which the suggestions be made of.
		 *  @param amount Amount of graph suggestions.
		 *  @param callback Function called at end of execution.
		 */
		graphs: (sourceurl, amount, callback) => {
			console.debug('Requesting suggestion.graphs with:', sourceurl, amount);
			let shouldContinue = true;
			(async function () {
				for (let r = 0; shouldContinue && r < amount; r++) {
					await new Promise(function (resolve) {
						request.suggestions.graph(sourceurl, function (result) {
							if (result === constants.RESPONSE_CODES.SUCCESS) {
								resolve(request.cache.suggestions.graph.current);
							} else {
								shouldContinue = false;
							}
						});
					}).then(function (fetchedGraph) {
						request.cache.suggestions.graph.list.push(fetchedGraph);
					});
				}
			})().then(function () {
				callback(shouldContinue ? constants.RESPONSE_CODES.SUCCESS : constants.RESPONSE_CODES.ERROR);
			});
		},
	},

	cache: {
		dashboard: {
			list: {
				timestamp: null,
				data: null
			},
		},
		graph: {
			list: null,
		},
		user: {
			email: '',
			apikey: '',
		},
		suggestions: {
			graph: {
				current: null,
				list: [],
			},
		},
	},
};

export default request;
