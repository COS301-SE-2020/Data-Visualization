/**
 * @file GraphSuggesterController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              				Changes
 * -------------------------------------------------------------------------------------------------
 * 30/06/2020    Marco Lombaard     				Original
 * 01/07/2020    Marco Lombaard     				Added parseODataMetadata function
 * 09/07/2020    Marco Lombaard     				Fixed parseODataMetaData function
 * 05/08/2020	 Marco Lombaard						Changed class from singleton to normal class w/ static functions
 * 05/08/2020	 Marco Lombaard						Added limitFields and setFittestEChart functions
 * 07/08/2020	 Marco Lombaard						Added data-types array to return in parseODataMetaData function
 * 07/08/2020	 Marco Lombaard						Fixed setFittestEChart function, added setGraphTypes
 * 07/08/2020	 Phillip Schulze					Moved parseODataMetadata function to Odata.js
 * 11/08/2020	 Marco Lombaard						Removed deprecated changeFittestGraph function
 * 14/08/2020	 Marco Lombaard						Converted getSuggestions to use entity name and not sample data
 * 14/08/2020	 Marco Lombaard						Moved chart construction here, added isInitialised function, modified setMetadata
 * 14/08/2020	 Marco Lombaard + Phillip Schulze	Added selectEntity function
 * 17/08/2020	 Marco Lombaard						Added assembleGraph function, selectEntity now returns an object
 * 02/09/2020	 Marco Lombaard						Modified constructOption and assembleGraph to display better graphs
 *
 * Test Cases: none
 *
 * Functional Description: This file creates the graph suggester controller for the graph suggester
 * contained in graphSuggesterAI.js.
 * This controller handles all suggestion requests and queries the suggester as required.
 *
 * Error Messages: "Error"
 * Assumptions: Input values are assumed to be in JSON format when requesting suggestions.
 * Constraints: Input values must be passed to the suggester in JSON format when requesting suggestions.
 */
const graphSuggesterAI = require('../graphSuggesterAI/graphSuggesterAI').getInstance();

/**
 * This class handles all requests for graph suggestion generation.
 * Usage Instructions: This class requires a JSON object containing the data that suggestions
 * must be generated for so it can pass it to the graph suggester.
 * @author Marco Lombaard
 */
class GraphSuggesterController {
	/**
	 * This function sets the metadata used in graph suggestion generation
	 * @param source the source of the metadata - used to track entity origin
	 * @param items	the entities('tables') and their related attributes/fields
	 * @param associations the other entities associated with this entity(containing related data)
	 * @param types the data types of each field, organised by entity
	 * @param sets the names of the entities in a way that can be requested from the datasource(not necessarily the same as in items)
	 */
	static setMetadata(source, type, { items, associations, types, sets }) {
		if (!this.metadata) {
			this.metadata = [];
			graphSuggesterAI.setMetadata(items, associations, types); //not yet initialised, initialise it
		}
		console.log(type);
		this.metadata[source] = { type, items, associations, types, sets };
	}

	/**
	 * This function clears the metadata and resets it to an empty array
	 */
	static clearMetadata() {
		this.metadata = [];
	}

	/**
	 * This function passes the data that suggestions need to be generated for, to the graph
	 * suggester in graphSuggesterAI.js.
	 * @returns the suggestions that were generated, in JSON format.
	 * @param entity the entity to select suggestions from
	 * @param source the data source that the entity belongs to
	 */
	static getSuggestions(entity, source) {
		// console.log(entity, this.metadata[source]);

		if (!this.isInitialised()) {
			console.log("Metadata isn't initialised, returning null...");
			return null;
		}
		if (!this.metadata[source]) {
			console.log('No metadata for ' + source + ', returning...');
			return null;
		}

		// eslint-disable-next-line eqeqeq
		if (entity == null) {
			console.log('no entity received for suggestion generation');
			return null;
		}

		const { items, associations, types } = this.metadata[source];
		graphSuggesterAI.setMetadata(items, associations, types);

		let isAccepted = false;
		let entities;

		if (!this.acceptedEntities || this.acceptedEntities.length === 0) {
			isAccepted = true;
		} else {
			entities = this.acceptedEntities[source];
			if (!entities || entities.length === 0) {
				isAccepted = true;
			} else {
				for (let i = 0; i < entities.length; i++) {
					if (entity === entities[i]) {
						isAccepted = true;
						break;
					}
				}
			}
		}

		if (isAccepted) {
			let suggestion = graphSuggesterAI.getSuggestions(entity);
			//console.log('Suggestion: ', suggestion);
			// eslint-disable-next-line eqeqeq
			if (suggestion == null) {
				console.log('Received null suggestion');
				return null;
			}
			//graph, params, xEntries, yEntries, graphName
			let graphType = suggestion[1];
			let primaryKey = suggestion[3];
			let dependentVariable = 'value';
			let field = suggestion[0];
			let fieldType = suggestion[2];
			let option;
			if (fieldType.toLowerCase().includes('string')) {
				//primaryKey = field;
			}
			option = this.constructOption(graphType, [primaryKey, dependentVariable], primaryKey, dependentVariable, entity + ': ' + field);
			//console.log(option);
			let chartSuggestion = {
				fieldType: fieldType,
				option: option,
			};
			//console.log('Chart: ', chartSuggestion);
			return chartSuggestion;
		}

		console.log(entity + ' is not among ', entities); //if we reach this point then we have an invalid suggestion
		return null;
	}

	/**
	 * * This function checks if the necessary parameters for suggestion generation has been set
	 * @return {boolean} true if it is initialised, false otherwise
	 */
	static isInitialised() {
		if (this.metadata && Object.keys(this.metadata).length > 0) {
			return true;
		}
		return false;
	}

	/**
	 * This function passes the fields that should not be selected in graph generation.
	 * @param fields the fields to be excluded in graph suggestion generation
	 */
	static limitFields(fields) {
		graphSuggesterAI.setFields(fields);
	}

	/**
	 * This function sets the entities that can be used in suggestion generation
	 * @param entities the entities that can be used in suggestion generation
	 */
	static limitEntities(entities) {
		this.acceptedEntities = {};
		for (let i = 0; i < entities.length; i++) {
			if (!this.acceptedEntities[entities[i].datasource]) {
				//if this source isn't listed yet
				this.acceptedEntities[entities[i].datasource] = [entities[i].entityName]; //create it and store the entity
			} else {
				this.acceptedEntities[entities[i].datasource].push(entities[i].entityName); //add the name to the existing array
			}
		}
	}

	/**
	 * This function returns an array of fields that should not be selected in graph generation.
	 */
	static getAcceptedFields() {
		return graphSuggesterAI.acceptedFields || [];
	}

	/**
	 * This function passes the graph types that should be used in suggestion generation
	 * @param types an array of the graph types(bar, pie, scatter, etc.) that should be used in suggestion generation
	 */
	static setGraphTypes(types) {
		graphSuggesterAI.setGraphTypes(types);
	}

	/**
	 * This function deduces the fitness characteristics from an eChart style graph and updates them as the target.
	 * @param graph the target graph as an object in eCharts format
	 * @return {boolean} a boolean value indicating whether changing the fitness was successful
	 */
	static setFittestEChart(graph) {
		//if the graph is null, then we are resetting preferences for the fitness target
		// eslint-disable-next-line eqeqeq
		if (graph || graph === {} || graph == null) {
			//eslint-disable-line
			console.log('setFittestEChart received null, resetting fitness target...');
			graphSuggesterAI.changeFitnessTarget(null, null);
			return true;
		}
		//check if the required values are in the object
		if (
			graph['series'] == null || //eslint-disable-line
			graph['series'].isEmpty ||
			graph['dataset'] == null //eslint-disable-line
		) {
			console.log('Check that graph, graph series and graph dataset are not empty or null');
			return false; //required values missing, signal failure
		}

		let series = graph['series'][0];
		let graphType = series['type']; //the type of chart
		let dataset = graph['dataset'];

		//check if there is a source
		// eslint-disable-next-line eqeqeq
		if (dataset['source'] == null) {
			//eslint-disable-line
			console.log('Check that dataset has a source');
			return false; //required value missing, return failure
		}

		let fieldSample = dataset['source']; //select the first entry as a sample
		let encoding = series['encode']; //get encode information

		//if the dataset is empty
		if (fieldSample.length <= 1) {
			//eslint-disable-line
			console.log('Check that dataset source has entries');
			return false;
		}

		fieldSample = fieldSample[1]; //select the first data entry

		//check if entry is empty or if there is no data value
		// eslint-disable-next-line eqeqeq
		if (fieldSample == null || fieldSample.length === 0) {
			//eslint-disable-line
			console.log('Check that entries have values');
			return false;
		}

		//check that encoding is present and not empty
		// eslint-disable-next-line eqeqeq
		if (encoding == null || encoding.isEmpty) {
			//eslint-disable-line
			console.log("Check that 'encode' is not empty");
			return false;
		}

		let keys = Object.keys(encoding);

		//check if there are keys
		if (keys.length === 0) {
			console.log("check that 'encode' has keys");
		}

		let fieldIndex = -1; //the index at which values(0 - xAxis, 1 - yAxis) are found in all entries

		//determine which part of the dataset is the 'value' part
		if (keys.includes('x') && keys.includes('y')) {
			if (encoding['x'].includes('value')) {
				//x-axis has values and not labels
				fieldIndex = 0;
			} else {
				//y-axis has values and not labels
				fieldIndex = 1;
			}
		} else if (keys.includes('x') && encoding['x'].includes('value')) {
			//x-axis is the only axis
			fieldIndex = 0;
		} else if (keys.includes('y') && encoding['y'].includes('value')) {
			//y-axis is the only axis
			fieldIndex = 1;
		} else if (keys.includes('value')) {
			//pie charts, etc. have a different setup, not x and y-axis
			fieldIndex = keys.indexOf('value'); //this index is which index of an entry contains values
		}

		//check if the index is valid, i.e. the part of each entry containing values was identified
		if (fieldIndex < 0) {
			console.log('Could not determine which part of the dataset contains values');
			return false;
		}

		let fieldType = typeof fieldSample[fieldIndex]; //the type of data that is preferred for graph generation

		graphSuggesterAI.changeFitnessTarget(graphType, fieldType); //set these values as the fitness target for the IGA

		return true;
	}

	/**
	 * This function constructs and returns the graph parameters for eChart graph generation in frontend.
	 * @param graph the type of graph to be used.
	 * @param params the labels for data, used to select which entries go on the x and y-axis.
	 * @param xEntries the entry/entries used on the x-axis.
	 * @param yEntries the entry/entries used on the y-axis.
	 * @param graphName the suggested name of the graph
	 * @return option the data used to generate the graph.
	 */
	static constructOption(graph, params, xEntries, yEntries, graphName) {
		let src = [];
		src[0] = params;

		//this constructs the options sent to the Apache eCharts API - this will have to be changed if
		//a different API is used
		let option = {
			title: {
				text: graphName,
			},
			dataset: {
				source: src,
			},
			series: [
				//construct the series of graphs, this could be one or more graphs
				{
					type: graph,
					encode: {
						x: xEntries, //TODO check if multiple values are allowed - might be useful
						y: yEntries,
					},
				},
			],
		};
		//the current options array works for line, bar, scatter, effectScatter charts
		//it is also the default options array
		if (!graph.includes('pie')) {
			option.xAxis = {
				type: 'category', //TODO change this so the t1
			};

			option.yAxis = {
				show: !graph.includes('bar'), //if bar chart, hide y-axis, else show it
			};

			if (graph.includes('bar')) {
				option.tooltip = {
					trigger: 'axis',
					formatter: '{c}',
					axisPointer: {
						type: 'shadow',
					},
				};
			} else {
				option.tooltip = {
					trigger: 'axis',
					formatter: '{c}',
					axisPointer: {
						type: 'line',
					},
				};
			}
		}
		if (graph.includes('pie')) {
			//for pie charts

			option.legend = {
				type: 'scroll',
				orient: 'vertical',
				right: 10,
				top: 20,
				bottom: 20,
				selected: [],
			};

			option.tooltip = {
				trigger: 'item',
				formatter: '{c}',
				axisPointer: {
					type: 'none',
				},
			};

			option.series = [
				{
					type: graph,
					radius: '60%',
					labelLine: {
						show: false,
					},
					label: {
						show: false,
						position: 'center',
					},
					encode: {
						itemName: xEntries,
						value: yEntries,
					},
				},
			];
		} else if (graph.includes('parallel')) {
			//for parallel charts - TODO to be added
		} else if (graph.includes('candlestick')) {
			//for candlestick charts - TODO to be added
		} else if (graph.includes('map')) {
			//for map charts - TODO to be added
		} else if (graph.includes('funnel')) {
			//for funnel charts - TODO to be added
		}

		//console.log(option);

		return option;
	}

	static selectEntity() {
		if (!this.isInitialised()) {
			console.log('Not yet initialised');
			return null;
		}
		//console.log(this.metadata);
		let keys = Object.keys(this.acceptedEntities); //list the sources(sources are keys to acceptedEntities)

		let source;
		let entity = {};

		if (keys && keys.length > 0) {
			//if a filter was set
			let num = Math.floor(Math.random() * keys.length);
			let key = keys[num]; //pick a source index

			// eslint-disable-next-line eqeqeq
			if (key == null || !key) {
				console.log('Selected source key was undefined/null, key index: ', num);
				console.log('Source Keys: ', keys);
				return null;
			}

			entity['datasource'] = key;

			source = this.acceptedEntities[key]; //select the source entities

			entity['entityName'] = source[Math.floor(Math.random() * source.length)]; //select a random entity from the source

			// eslint-disable-next-line eqeqeq
			if (!this.metadata[entity['datasource']] || this.metadata[entity['datasource']] == null) {
				console.log('Entity metadata is not defined');
				console.log(this.metadata, ':', entity['datasource']);
				return null;
			}

			const index = Object.keys(this.metadata[entity['datasource']].items).indexOf(entity['entityName']); //select the index of the entity in metadata
			entity['entitySet'] = this.metadata[entity['datasource']].sets[index]; //select the set name(different from the entity name) for database querying
			entity['datasourcetype'] = this.metadata[entity['datasource']].type;

			return entity; //return the random entity
		} else {
			//else just pick from all options
			keys = Object.keys(this.metadata); //list the sources(sources are keys to acceptedEntities)

			let num = Math.floor(Math.random() * keys.length);
			let key = keys[num]; //pick a metadata source index
			// eslint-disable-next-line eqeqeq
			if (key == null || !key) {
				console.log('Selected source key was undefined/null, key index: ', num);
				console.log('Source Keys: ', keys);
				return null;
			}
			entity['datasource'] = key;

			let source = this.metadata[key];

			if (source && source['items']) {
				source = source['items']; //source entities are listed in 'items' - select it
			} else {
				console.log('Metadata is empty in selectEntities');
				return null;
			}

			keys = Object.keys(source); //select the entity keys

			const index = Math.floor(Math.random() * keys.length);

			entity['entityName'] = keys[index]; //select a random entity key
			entity['entitySet'] = this.metadata[entity['datasource']].sets[index]; //store the set item name for database querying
			entity['datasourcetype'] = this.metadata[entity['datasource']].type;

			return entity;
		}
	}

	/**
	 * This function populates the graph with its data
	 * @param suggestion the chart object
	 * @param data the chart data to populate with
	 * @return suggestion the full chart with data
	 */

	static assembleGraph(suggestion, { data }) {
		//console.log(data);
		// eslint-disable-next-line eqeqeq
		if (suggestion == null) {
			console.log('No suggestion object to add data to');
			return suggestion;
		}
		let selectedFields = [false];

		let count = 0;
		for (let i = 0; i < data.length; i++) {
			suggestion['dataset']['source'][i + 1] = data[i];
			if (count < 5 && data[i] !== 0) {
				selectedFields[i + 1] = true; //get the first 5 nonnull values
				count++;
			} else {
				selectedFields[i + 1] = false;
			}
		}

		if (suggestion['legend']) {
			//if we have defined a legend
			suggestion['legend']['selected'] = selectedFields; //set the selection to the first 5 nonnull values
		}

		//console.log('suggestion w/ data', suggestion);

		return suggestion;
	}
}
GraphSuggesterController.acceptedEntities = {};
GraphSuggesterController.metadata = [];

module.exports = GraphSuggesterController;
