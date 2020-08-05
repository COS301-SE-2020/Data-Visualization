/**
 * @file restController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author                             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze     Original
 * 12/07/2020   Elna Pistorius & Phillip Schulze     Add Graph Suggester Controller
 * 05/08/2020   Elna Pistorius  					 Added two new functions that returns a list of fields and a list of entities.
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a rest controller that handles any requests from the roots and
 * handles these requests appropriately by getting or setting the requested data from or to the models.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const Database = require('../database');
const DataSource = require('../dataSource');
const { graphsSuggesterController } = require('../graphSuggester');
/**
 * Purpose: This class is responsible for any requests from the roots and then
 * handles these requests appropriately by getting or setting the requested data from or to the models.
 * Usage Instructions: Use the corresponding getters and setters to update any sub-controllers.
 * @author Elna Pistorius & Phillip Schulze
 */
class RestController {
	/**
	 * This function gets a data source list.
	 * @param email the users email
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a data source list.
	 */
	static getDataSourceList(email, done, error) {
		Database.getDataSourceList(email)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**
	 * This function adds a data source.
	 * @param email the users email
	 * @param dataSourceID the data sources id
	 * @param dataSourceURL the data sources url
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static addDataSource(email, dataSourceURL, done, error) {
		Database.addDataSource(email, dataSourceURL)
			.then((data) => done(data))
			.catch((err) => error && error(err));
	}
	/**
	 * This function removes a data source.
	 * @param email the users email
	 * @param dataSourceID the data sources id
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static removeDataSource(email, dataSourceID, done, error) {
		Database.removeDataSource(email, dataSourceID)
			.then(() => done())
			.catch((err) => error && error(err));
	}
	/**
	 * This function gets a dashboard list.
	 * @param email the users email
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static getDashboardList(email, done, error) {
		Database.getDashboardList(email)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**
	 * This function adds a new dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param name the name of the dashboard
	 * @param description the description of the dashboard
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static addDashboard(email, name, description, done, error) {
		Database.addDashboard(email, name, description)
			.then((data) => done(data))
			.catch((err) => error && error(err));
	}
	/**
	 * This function updates a dashboard.
	 * @param email the users email
	 * @param id the dashboards id
	 * @param fields the fields that need to be updated
	 * @param data the data that is used to update the fields of the dashboard
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static updateDashboard(email, id, fields, data, done, error) {
		Database.updateDashboard(email, id, fields, data)
			.then(() => done())
			.catch((err) => error && error(err));
	}
	/**
	 * This function adds a new dashboard.
	 * @param email the users email
	 * @param id the dashboards id
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static removeDashboard(email, id, done, error) {
		Database.removeDashboard(email, id)
			.then(() => done())
			.catch((err) => error && error(err));
	}
	/**
	 * This function adds a new dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static getGraphList(email, dashboardID, done, error) {
		Database.getGraphList(email, dashboardID)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**
	 * This function adds a new dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the id of the graph
	 * @param fields the fields that need to be updated
	 * @param data the data that is used to update the fields of the dashboard
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static updateGraph(email, dashboardID, graphID, fields, data, done, error) {
		Database.updateGraph(email, dashboardID, graphID, fields, data)
			.then(() => done())
			.catch((err) => error && error(err));
	}
	/**
	 * This function is used to add a graph to a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @param title the title of the graph
	 * @param options the options is a JSON object that stores the options and data of the graph
	 * @param metadata the metadata is a JSON object that stores the presentation data of the graph
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static addGraph(email, dashboardID, title, options, metadata, done, error) {
		Database.addGraph(email, dashboardID, title, options, metadata)
			.then((data) => done(data))
			.catch((err) => error && error(err));
	}
	/**
	 * This function is used to remove a graph from a dashboard
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static removeGraph(email, dashboardID, graphID, done, error) {
		Database.removeGraph(email, dashboardID, graphID)
			.then(() => done())
			.catch((err) => error && error(err));
	}
	/**
	 * This function authenticates a user.
	 * @param userName the users email
	 * @param password the users password
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise
	 */
	static loginUser(userName, password, done, error) {
		Database.authenticate(userName, password)
			.then((user) => done(user))
			.catch((err) => error && error(err));
	}
	/**
	 * This function registers a user.
	 * @param userName the users first name
	 * @param userSurname the users last name
	 * @param userEmail the users email
	 * @param userPassword the users password
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise
	 */
	static registerUser(userName, userSurname, userEmail, userPassword, done, error) {
		Database.register(userName, userSurname, userEmail, userPassword)
			.then((user) => done(user))
			.catch((err) => error && error(err));
	}

	/**
	 * This function deregisters a user.
	 * @param userEmail the users email
	 * @param userPassword the users password
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise
	 */
	static deregisterUser(userEmail, userPassword, done, error) {
		Database.deregister(userEmail, userPassword)
			.then((user) => done())
			.catch((err) => error && error(err));
	}

	/**
	 * This function gets Odata.
	 * @param src the source where this Odata must be retrieved from
	 * @param type the type of data that is requested
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise of Odata
	 */
	static getMetaData(src, type, done, error) {
		DataSource.getMetaData()
			.then((user) => done(user))
			.catch((err) => error && error(err));
	}
	/**
	 * This function gets a list of entities.
	 * @param src the source url where the entities must be retrieved from.
	 * @param done a promise that is returned if the request was successful.
	 * @param error a promise that is returned if the request was unsuccessful.
	 * @returns a promise of the entity list.
	 */
	static getEntityList(src, done, error) {
		DataSource.getEntityList(src)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @param type the type of data that is requested
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, type, entity, done, error) {
		DataSource.getEntityData()
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**
	 * This function gets suggestions based off of the source provided
	 * @param src the source that is requested to be used to generate a suggestion
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 */
	static getSuggestions(src, done, error) {
		DataSource.getMetaData(src)
			.then((XMLString) => {
				const Meta = graphsSuggesterController.parseODataMetadata(XMLString);

				let randKey = Math.floor(Math.random() * Meta.sets.length); //generate a random index in the keyset
				const itemsKeys = Object.keys(Meta.items); //this is a list of the items keys
				let chosen = Meta.items[itemsKeys[randKey]]; //select the item at this index

				while (chosen !== null && chosen.length === 0) {
					//check if the item with the selected key has data
					randKey = Math.floor(Math.random() * Meta.sets.length); //generate a new index to check in the key set
				}
				const randEntity = Meta.sets[randKey]; //select this entity for data source querying
				console.log(randEntity);
				DataSource.getEntityData(src, randEntity)
					.then((Odata) => {
						const options = graphsSuggesterController.getSuggestions(Odata);
						if (options === null) RestController.getSuggestions(src, done, error);
						else done(options);
					})
					.catch((err) => error && error(err));
			})
			.catch((err) => error && error(err));
	}


	static getListOfFields(src, entity, done, error) {
		DataSource.getEntityData(src, entity)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
}

module.exports = RestController;
