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
 * 05/08/2020   Phillip Schulze  					 Updated the id's and added new deregister function.
 * 05/08/2020   Elna Pistorius  					 Added two new functions that returns a list of fields and a list of entities.
 * 06/08/2020	Elna Pistorius 						 Added a function that deregisters users.
 * 11/08/2020   Elna Pistorius                       Updated the updateGraphTypes function
 * 11/08/2020	Marco Lombaard						 Added the stringsToGraphData function
 * 14/08/2020	Marco Lombaard						 Modified getSuggestion to only need metadata for suggestion generation
 * 18/08/2020	Marco Lombaard						 Modified stringsToGraphData to return a 2D array object
 * 18/08/2020	Marco Lombaard						 Added boolsToGraphData and make1DArray functions
 * 02/09/2020   Elna Pistorius    					 Added new exports controller
 * 03/08/2020   Elna Pistorius      				 Updated JSON exporting function
 * 04/08/2020   Elna Pistorius                       Updated CSV exporting function
 * 14/09/2020	Marco Lombaard						 Added mergeSort and dateConversion functions
 * 15/09/2020	Marco Lombaard						 added removeDuplicateKeys function
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
const ExportsController = require('../exports');
const { GraphSuggesterController } = require('../graphSuggester');
const { addSeriesData } = require('../graphSuggester/graphSuggesterController/graphSuggesterController');
/**
 * Purpose: This class is responsible for any requests from the roots and then
 * handles these requests appropriately by getting or setting the requested data from or to the models.
 * Usage Instructions: Use the corresponding getters and setters to update any sub-controllers.
 * @author Elna Pistorius & Phillip Schulze
 */
class RestController {
	/**************** USER ****************/

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
			.then(() => done())
			.catch((err) => error && error(err));
	}

	/**************** DATA SOURCE ****************/

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
	 * @param dataSourceURL the data sources url
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static addDataSource(email, dataSourceURL, dataSourceType, done, error) {
		Database.addDataSource(email, dataSourceURL, dataSourceType)
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
	 * This function gets Odata.
	 * @param src the source where this Odata must be retrieved from
	 * @param type the type of data that is requested
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise of Odata
	 */
	static getMetaData(src, type, done, error) {
		DataSource.getMetaData(src, type)
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
	static getEntityList(src, type, done, error) {
		DataSource.getEntityList(src, type)
			.then((data) => done(data))
			.catch((err) => error && error(err));
	}
	// /**
	//  * This function gets entity data.
	//  * @param src the source where the entity data must be retrieved from
	//  * @param entity the entity that we want data from
	//  * @param field
	//  * @param done a promise that is returned if the request was successful
	//  * @param error a promise that is returned if the request was unsuccessful
	//  * @returns a promise of the entities data
	//  */
	// static getEntityData(src, type, entity, field, done, error) {
	// 	DataSource.getEntityData(src, entity, field)
	// 		.then((list) => done(list))
	// 		.catch((err) => error && error(err));
	// }

	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @returns a promise of the entities data
	 */
	static getData(src, type, entity, done, error) {
		DataSource.getEntityDataAll(src, type, entity)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}
	/**************** Suggestions ****************/

	/**
	 * This function set suggestion parameters that are used when requesting suggestions
	 * @param graph the graph that is to be set as the fittest graph
	 * @param entities the list of entities that should be used for suggestion generation
	 * @param fields the list of fields that should be used for suggestion generation
	 */
	static setSuggestionParams(graph, entities, fields, graphTypes, done, error) {
		try {
			GraphSuggesterController.clearMetadata();
			GraphSuggesterController.setFittestEChart(graph);
			GraphSuggesterController.limitEntities(entities);
			GraphSuggesterController.limitFields(fields);
			GraphSuggesterController.setGraphTypes(graphTypes);

			//construct array of sources from entities with no duplicates
			let index = 0;
			let datasourceTypes = [];
			const datasources = entities.map((entity) => {
				datasourceTypes[index++] = entity.datasourcetype;
				return entity.datasource;
			});

			console.log(datasourceTypes, datasources);

			Promise.all(datasources.map((src, i) => DataSource.getMetaData(src, datasourceTypes[i])))
				.then((metaDataList) => {
					metaDataList.forEach((Meta, i) => GraphSuggesterController.setMetadata(datasources[i], datasourceTypes[i], Meta));
					console.log('Meta Data retrieved for sources:');
					console.log(datasources);

					done();
				})
				.catch((err) => {
					error && error(err);
				});
		} catch (err) {
			error && error({ error: err, status: 500 });
		}
	}

	/**
	 * This function gets suggestions based off of the source provided
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 */
	static getSuggestions(done, error) {
		if (GraphSuggesterController.isInitialised()) {
			let randEntity;
			let suggestion;

			const maxTime = 1; //10;
			let timer = 0;
			let timedout = false;

			do {
				if (timer < maxTime) {
					timer++;
					randEntity = GraphSuggesterController.selectEntity();

					// console.log('RandEntity:', randEntity);

					suggestion = GraphSuggesterController.getSuggestions(randEntity.entityName, randEntity.datasource);
				} else timedout = true;
			} while (!suggestion && !timedout); // eslint-disable-line eqeqeq

			if (timedout) {
				done({});
				console.log('error: Request Timed out, could not generate chart, try selecting different entities');
			} else if (!suggestion) {
				done({});
			} else {
				let fieldType = suggestion.fieldType;
				let field = suggestion.field;
				let primaryKey = suggestion.primaryKey;
				let option = suggestion.option;
				// console.log('randEntity.datasource = >', randEntity.datasource);
				// console.log('randEntity.datasourcetype = >', randEntity.datasourcetype);
				// console.log('randEntity.entityName = >', randEntity.entityName);
				// console.log('randEntity.entitySet = >', randEntity.entitySet);
				// console.log('field = >', field);
				// console.log('fieldtype = >', fieldType);
				DataSource.getEntityData(randEntity.datasource, randEntity.datasourcetype, randEntity.entitySet, field, primaryKey)
					.then(async (data) => {
						let isForecasting = false;
						let forecast = null;
						let trimmedSet = null;

						if (fieldType.toLowerCase().includes('string')) {
							//string data requires additional processing
							data = this.stringsToGraphData(data); //process the data
						} else if (fieldType.toLowerCase().includes('bool')) {
							data = this.boolsToGraphData(data);
						} else if (primaryKey.toLowerCase().includes('date')) {
							data = this.dateConversion(data);

							const count = Math.ceil(data.length * 0.2);
							isForecasting = true;

							let forecastResults = await DataSource.predictTimeSeries(data.data, count).catch((err) => {
								isForecasting = false;
								console.log('Time Series Forecast failed...', err.data.error);
							});

							// console.log(forecastResults);
							if (forecastResults && isForecasting) {
								forecast = forecastResults.forecast;
								trimmedSet = forecastResults.trimmedSet;

								if (data) {
									forecast.unshift(data.data[data.data.length - 1]);
								}
							} else isForecasting = false;
						} else {
							//get rid of duplicate keys(previous checks did that automatically, it should do it for others too)
							data = this.removeDuplicateKeys(data);
						}

						let charttype = null;
						if (suggestion && suggestion.option && suggestion.option.series && suggestion.option.series[0] && suggestion.option.series[0].type) {
							charttype = suggestion.option.series[0].type;
						}

						outputSuggestionMeta(randEntity.datasource, randEntity.datasourcetype, randEntity.entityName, randEntity.entitySet, field, fieldType, charttype);
						// eslint-disable-next-line eqeqeq
						if (data == null) {
							console.log('No data for entity:', randEntity.entityName, 'and field:', field);
							done({});
						} else {
							let chart = GraphSuggesterController.assembleGraph(option, data);

							// console.log('BEFORE:', chart);

							if (isForecasting && forecast && trimmedSet) {
								// console.log('Forecast:', forecast);
								chart = GraphSuggesterController.addSeriesData(chart, { forecast, trimmedSet });
							}

							GraphSuggesterController.suggestionsMade++;

							done(chart);
						}
					})
					.catch((err) => error & error(err));
			}
		} else {
			error && error({ error: 'Suggestion Parameters have not been set!', hint: 'make a request to [domain]/suggestions/params first', status: 500 });
		}
	}

	/**************** DASHBOARD ****************/

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
	 * @param name the name of the dashboard
	 * @param description the description of the dashboard
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 * @return a promise
	 */
	static addDashboard(email, name, description, metadata, done, error) {
		Database.addDashboard(email, name, description, metadata)
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
			.then((data) => done(data))
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
	/**************** EXPORTS ****************/
	/**
	 * This function generates exportable json of a chart
	 * @param fileName the name of the file that needs to be exported to JSON
	 * @param config the config of the whole chart
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 */
	static exportToJson(fileName, config, done, error) {
		try {
			let data = ExportsController.json(fileName, config);
			done(data);
		} catch (err) {
			error && error(err);
		}
	}

	/**
	 * This function generates exportable csv of a chart
	 * @param config the types of graphs that needs to be updated
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 */
	static exportToCSV(config, done, error) {
		try {
			let data = ExportsController.csv(config);
			done(data);
		} catch (err) {
			error && error(err);
		}
	}

	/**************** GRAPHS ****************/

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
			.then((data) => done(data))
			.catch((err) => error && error(err));
	}
	/**
	 * This function is used to add a graph to a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
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
	 * This function updates the graph types of the suggestions.
	 * @param graphTypes the types of graphs that needs to be updated
	 * @param done a promise that is returned if the request was successful
	 * @param error a promise that is returned if the request was unsuccessful
	 */
	static updateGraphTypes(graphTypes, done, error) {
		GraphSuggesterController.setGraphTypes(graphTypes);
		done();
	}

	/**
	 * This function transforms string data into data we can represent as graphs. Right now it's just a "count" of
	 * how many times each category occurs.
	 * @param stringDataArray an object containing a value 'data' which is an array containing the string data
	 * @return {data} an object containing a 2D array of label-value pairs
	 */
	static stringsToGraphData(stringDataArray) {
		// eslint-disable-next-line eqeqeq
		if (!stringDataArray) {
			console.log('No data received');
			return null;
		}
		//TODO could move this to IGA for generation on best way to represent strings
		let list = {}; //The basic structure will be key-value pairs, where keys are unique string values
		//values will be how many times each key has occurred
		let dataArray = stringDataArray.data;

		if (!dataArray) {
			console.log('No data received for this entity and field');
			return null;
		}

		for (let i = 0; i < dataArray.length; i++) {
			// eslint-disable-next-line eqeqeq
			if (list[dataArray[i][1]] != null) {
				//eslint-disable-line
				list[dataArray[i][1]]++; //if this category was already created, increment how often it has occurred
			} else {
				list[dataArray[i][1]] = 1; //else create the category
			}
		}

		let data = [];
		let keys = Object.keys(list); //get the keys
		for (let i = 0; i < keys.length; i++) {
			data.push([keys[i], list[keys[i]]]); //push a label-value pair, label is the key and value is that 'list' item
		}

		return { data };
	}

	/**
	 * This function transforms string data into data we can represent as graphs. Right now it's just a "count" of
	 * how many times each category occurs.
	 * @param boolDataArray an object containing a value 'data' which is an array containing the boolean data
	 * @return {data} an object containing a 2D array of label-value pairs
	 */
	static boolsToGraphData(boolDataArray) {
		//TODO could move this to IGA for generation on best way to represent strings

		if (!boolDataArray) {
			console.log('No data received');
			return null;
		}
		let list = {}; //The basic structure will be key-value pairs, where keys are unique string values
		//values will be how many times each key has occurred
		let dataArray = boolDataArray.data;

		// eslint-disable-next-line eqeqeq
		if (dataArray == null) {
			console.log('No data received for this entity and field');
			return null;
		}

		dataArray = this.make1DArray(dataArray);

		let boolVal;
		for (let i = 0; i < dataArray.length; i++) {
			if (dataArray[i].includes('false')) {
				boolVal = false;
			} else {
				boolVal = true;
			}

			// eslint-disable-next-line eqeqeq
			if (list[boolVal] != null) {
				//eslint-disable-line
				list[boolVal]++; //if this category was already created, increment how often it has occurred
			} else {
				list[boolVal] = 1; //else create the category
			}
		}

		let data = [];
		let keys = Object.keys(list); //get the keys
		for (let i = 0; i < keys.length; i++) {
			data.push([keys[i], list[keys[i]]]); //push a label-value pair, label is the key and value is that 'list' item
		}

		return { data };
	}

	/**
	 * This function is meant to convert unix dates into string dates
	 * @param dataArray contains the 2D data array as an attribute
	 * @returns {*} the object containing the converted data
	 */
	static dateConversion(dataArray) {
		if (!dataArray) {
			console.log('No data received');
			return null;
		}

		let data = dataArray.data;

		if (!data) {
			console.log('No data received for this entity and field');
			return null;
		}

		let rawDate;

		let temp = [];

		for (let i = 0; i < data.length; i++) {
			rawDate = data[i][0]; //the key is a date
			let index = rawDate.indexOf('(') + 1; //trim all up until the first integer
			rawDate = rawDate.substr(index, rawDate.indexOf(')') - index); //trim everything after the last integer
			rawDate = parseInt(rawDate); //convert from string to int
			temp[i] = rawDate;
			// console.log(date.toDateString());
		}

		temp = mergeSort(temp, 0, temp.length - 1);
		let tempMap = [];

		for (let i = 0; i < temp.length; i++) {
			if (!tempMap[temp[i]]) {
				tempMap[temp[i]] = parseFloat(data[i][1]);
			} else {
				tempMap[temp[i]] += parseFloat(data[i][1]);
			}
		}

		data = [];
		let keys = Object.keys(tempMap);

		for (let i = 0; i < keys.length; i++) {
			data[i] = [];
			data[i][0] = new Date(parseInt(keys[i])).toDateString();
			data[i][1] = tempMap[keys[i]];
		}

		dataArray.data = data;
		return dataArray;
	}

	/**
	 * This function gets rid of duplicate keys. Important to note the string, bools and dates parsing functions
	 * automatically do this, this is for all other data.
	 * @param dataArray the object containing the 2D data array as an attribute.
	 * @returns {*} the object containing the new data array.
	 */
	static removeDuplicateKeys(dataArray) {
		if (!dataArray) {
			console.log('No data received');
			return null;
		}
		let uniques = [];
		let data = dataArray.data;
		if (!data) {
			console.log('No data received for this entity and field');
			return null;
		}
		for (let i = 0; i < data.length; i++) {
			if (!uniques[data[i][0]]) {
				uniques[data[i][0]] = parseFloat(data[i][1]);
			} else {
				uniques[data[i][0]] += parseFloat(data[i][1]);
			}
		}

		data = [];
		let keys = Object.keys(uniques);

		for (let i = 0; i < keys.length; i++) {
			data[i] = [keys[i], uniques[keys[i]]]; //store the key-value pair in array format for echarts
		}

		dataArray.data = data;
		return dataArray;
	}

	static make1DArray(dataArray) {
		if (!dataArray) {
			console.log('No data received');
			return null;
		}
		if (dataArray.constructor !== Array) {
			//if it's just one value
			return [dataArray];
		} else if (dataArray[0].constructor !== Array) {
			//if it's a 1D array
			return dataArray;
		} else if (dataArray[0].constructor === Array) {
			//if it's a 2D array
			let oneDArray = [];
			for (let i = 0; i < dataArray.length; i++) {
				oneDArray[i] = '';
				for (let j = 0; j < dataArray[i].length; j++) {
					oneDArray[i] += dataArray[i][j];
				}
			}
			return oneDArray;
		} else {
			console.log('Arrays with dimensions larger than 2 are not supported');
		}
	}
}

function mergeSort(dataArray, first, last) {
	if (first > last) {
		return [];
	} else if (first === last) {
		return dataArray.slice(first, last + 1);
	} else {
		let middle = Math.trunc((last + first) / 2);
		let left = mergeSort(dataArray, first, middle);
		let right = mergeSort(dataArray, middle + 1, last);
		let combined = [];

		let i = 0;
		let j = 0;
		let k = 0;

		while (i < left.length && j < right.length) {
			if (left[i] <= right[j]) {
				combined[k] = left[i];
				k++;
				i++;
			} else {
				combined[k] = right[j];
				k++;
				j++;
			}
		}

		while (i < left.length) {
			combined[k] = left[i];
			k++;
			i++;
		}

		while (j < right.length) {
			combined[k] = right[j];
			k++;
			j++;
		}
		return combined;
	}
}

function extractTitleData(title) {
	if (typeof title === 'string') {
		let index = title.indexOf(':');

		let entity = '';
		let field = '';

		if (index < 0) entity = title;
		else {
			entity = title.substr(0, index);
			field = title.substr(index + 2);
		}
		return { entity, field };
	} else return title;
}

function outputSuggestionMeta(src, srctype, item, set, field, fieldtype, charttype) {
	console.log('=====================================');
	console.log('GENERATED SUGGESTION');
	console.log('SRC:        ', src);
	console.log('SRC-type:   ', srctype, '(' + DataSource.sourceTypeName(srctype) + ')');
	console.log('item:       ', item);
	console.log('set:        ', set);
	console.log('field:      ', field);
	console.log('field type: ', fieldtype);
	console.log('Chart type: ', charttype);
	console.log('Suggstion nr: ', GraphSuggesterController.suggestionsMade);
	console.log('=====================================');
}

module.exports = RestController;
