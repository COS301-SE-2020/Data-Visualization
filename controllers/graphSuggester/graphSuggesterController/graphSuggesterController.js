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
 * 11/09/2020	 Marco Lombaard						Modified constructOption and assembleGraph to display even better graphs
 * 11/09/2020	 Marco Lombaard						Added function to add a series to a suggestion
 * 16/09/2020	 Marco Lombaard						Pie charts convert to bar charts if they have too much data
 * 12/10/2020	 Marco Lombaard						Added blacklist function to blacklist bad fields
 * 12/10/2020	 Marco Lombaard						Added blacklistEntity function to blacklist bad entities, renamed blacklist to blacklistField
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
	 * @param type the type of datasource(Odata, GraphQL etc.)
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
		// console.log(type);
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
				//this data gets changed later, then the field becomes the key
				option = this.constructOption(graphType, [field, dependentVariable], field, dependentVariable, entity + ': ' + field);
			} else {
				option = this.constructOption(graphType, [primaryKey, dependentVariable], primaryKey, dependentVariable, entity + ': ' + field);
			}
			//console.log(option);
			let chartSuggestion = {
				fieldType: fieldType,
				primaryKey: primaryKey,
				field: field,
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
		if (!graph || graph === {} || graph == null) {
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
			option.grid = {
				top: 30,
				bottom: 130,
				left: 60,
			};

			option.xAxis = {
				type: 'category', //TODO change this so the type(s) get decided by frontend or by the AI
				name: xEntries,
				nameLocation: 'center',
				nameGap: 115,
				nameTextStyle: {
					fontSize: 15,
				},
				axisLabel: {
					rotate: 330,
					padding: [20, 0, 0, -10],
				},
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
				formatter: '{d}%',
				axisPointer: {
					type: 'none',
				},
			};

			option.series = [
				{
					type: graph,
					radius: '60%',

					center: ['30%', '50%'],

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

	/**
	 * This function selects and returns an entity for suggestion generation
	 * @returns {{}|null} An object containing the datasource, entity name, entityset name and datasource type(e.g. Odata or GraphQL)
	 */
	static selectEntity() {
		if (!this.isInitialised()) {
			console.log('Not yet initialised');
			return null;
		}
		//console.log(this.metadata);
		let keys = Object.keys(this.acceptedEntities); //list the sources(sources are keys to acceptedEntities)

		let entity = {};

		if (keys && keys.length > 0) {
			//if a filter was set

			//the maximum combined index of entities over all sources(first source's first entity at 0, last source's last entity at max)
			let max = 0;

			for (let key = 0; key < keys.length; key++) {
				max += Object.keys(this.acceptedEntities[keys[key]]).length;
			}

			let num = Math.floor(Math.random() * max);

			let selectedIndex;
			let sourceKey;

			for (let k = 0; k < keys.length; k++) {
				let entityKeys = this.acceptedEntities[keys[k]];
				if (num < entityKeys.length) {
					sourceKey = keys[k];
					selectedIndex = num;
					break;
				} else {
					num -= entityKeys.length;
				}
			}

			if ((!selectedIndex && selectedIndex !== 0) || !sourceKey) {
				console.log("Failed to select a key in 'if' clause for selectEntity(), sourceKey: ", sourceKey, " selectedIndex: ", selectedIndex);
				return null;
			}

			entity['datasource'] = sourceKey;
			entity['entityName'] = this.acceptedEntities[sourceKey][selectedIndex];

			// console.log('accepted entities:', source);
			// console.log('field list:', this.metadata[key].items[entity['entityName']]);

			// eslint-disable-next-line eqeqeq
			if (!this.metadata[entity['datasource']] || this.metadata[entity['datasource']] == null) {
				console.log('Entity metadata is not defined');
				console.log('Metadata: ', this.metadata, ' - Entity: ', entity['datasource']);
				return null;
			}

			const index = Object.keys(this.metadata[entity['datasource']].items).indexOf(entity['entityName']); //select the index of the entity in metadata
			entity['entitySet'] = this.metadata[entity['datasource']].sets[index]; //select the set name(different from the entity name) for database querying
			entity['datasourcetype'] = this.metadata[entity['datasource']].type;

			// console.log('Entity selected: ', entity);

			return entity; //return the random entity
		} else {
			//else just pick from all options
			keys = Object.keys(this.metadata); //list the sources(sources are keys to acceptedEntities)

			//the maximum combined index of entities over all sources(first source's first entity at 0, last source's last entity at max)
			let max = 0;

			for (let key = 0; key < keys.length; key++) {
				max += Object.keys(this.metadata[keys[key]]).length;
			}

			let num = Math.floor(Math.random() * max);

			let selectedEntity;
			let sourceKey;

			for (let k = 0; k < keys.length; k++) {
				let entityKeys = Object.keys(this.metadata[keys[k]]['items']);
				if (num < entityKeys.length) {
					sourceKey = keys[k];
					selectedEntity = entityKeys[num];
					break;
				} else {
					num -= entityKeys.length;
				}
			}

			if (!selectedEntity || !sourceKey) {
				console.log("Failed to select a key in 'else' clause for selectEntity(), sourceKey: ", sourceKey, " selectedEntity: ", selectedEntity);
				return null;
			}

			let source = this.metadata[sourceKey];

			if (source && source['items']) {
				source = source['items']; //source entities are listed in 'items' - select it
			} else {
				console.log('Metadata is empty in selectEntities');
				return null;
			}

			keys = Object.keys(source); //select the entity keys

			entity['datasource'] = sourceKey;
			entity['entityName'] = selectedEntity;
			entity['entitySet'] = this.metadata[sourceKey].sets[keys.indexOf(selectedEntity)]; //store the set item name for database querying
			entity['datasourcetype'] = this.metadata[sourceKey].type;

			return entity;
		}
	}

	/**
	 * This function populates the graph with its data
	 * @param suggestion the chart object
	 * @param data the chart data to populate with
	 * @return suggestion the full chart with data - if it is null, the field will be blacklisted in restController, if
	 * an empty object then it won't be blacklisted.
	 */
	static assembleGraph(suggestion, { data }, shouldSort = true) {
		//console.log(data);
		// eslint-disable-next-line eqeqeq
		if (!suggestion || !suggestion['dataset'] || !suggestion['dataset']['source']) {
			console.log('No suggestion object to add data to');
			return suggestion;
		}

		let selectedFields = {};

		let count = 0;
		let sameValues = [];
		let sameKeys = true;
		let sameKeyValue = null;
		let hasValues = [];
		let index = 0;
		// let allSameValue = true;	//if everything has the same value, we have a boring graph
		// let sameValue = data[0][1];	//compare everything with first value

		for (let i = 0; i < data.length; i++) {
			suggestion['dataset']['source'][i + 1] = data[i];

			// if (allSameValue && sameValue !== data[i][1]) {	//if not the same value, flag it
			// 	allSameValue = false;
			// }
			if (sameValues[data[i][1]]) {
				//if this value has been encountered before
				sameValues[data[i][1]]++; //increment how many have been encountered
			} else {
				//otherwise create new index
				sameValues[data[i][1]] = 1;
			}

			if (data[i][1] !== 0) {
				hasValues[index++] = data[i];
			}

			if (count < 5 && data[i][1] !== 0) {
				selectedFields[data[i][0]] = true; //get the first 5 nonnull values
				count++;
			} else {
				selectedFields[data[i][0]] = false;
			}

			if (sameKeys) {
				if (sameKeyValue == null) {
					sameKeyValue = data[i][0];
				} else {
					if (sameKeyValue !== data[i][0]) {
						sameKeys = false;
					}
				}
			}
		}

		if (sameKeys) {
			console.log('All items in graph have the same key - invalidating graph');
			return null; //returning null blacklists the field
		}

		let keys = Object.keys(sameValues);
		let proportion;
		for (let i = 0; i < keys.length; i++) {
			proportion = sameValues[keys[i]] / data.length;
			if (proportion > 0.8) {
				//if more than 80% of the same value exists, boring graph
				if (hasValues.length <= 5 && hasValues.length >= 2 && keys.length > 1) {
					if (graphSuggesterAI.graphTypes.includes('pie')) {
						//if we have less or equal to 5 non-zero values, with some variance, return a pie chart of the values
						let params = suggestion['dataset']['source'][0];
						let replacement = this.constructOption('pie', params, params[0], params[1], suggestion['title']['text']); //new chart
						for (let i = 0; i < hasValues.length; i++) {
							replacement['dataset']['source'].push(hasValues[i]); //add the values to the data field
						}
						return replacement; //return the new chart
					} else {
						return {}; //returning empty to flag that it is a bad suggestion, but to not blacklist the field
					}
				}
				//else we can't make it less boring
				console.log('Too many items in graph have the same value - invalidating graph');
				// console.log('data: ', data);
				return null; //returning null to flag it is a bad suggestion and blacklist the field
			}
		}

		let chartType = suggestion['series'][0]['type'];

		//do chart conversions between pie and bar charts
		if (graphSuggesterAI.graphTypes.includes('bar') && chartType.includes('pie')) {
			//if we are allowed to have bar charts, consider limiting data

			if (hasValues.length > 10) {
				//pie charts shouldn't have too many values, use a bar chart instead
				let params = suggestion['dataset']['source'][0];
				//create a new bar chart
				let values;

				if (shouldSort) {
					values = this.sort(data, 1);
				} else {
					values = data;
				}

				let replacement = this.constructOption('bar', params, params[0], params[1], suggestion['title']['text']);

				replacement['dataset']['source'] = [params].concat(values);

				return replacement;
			}
		}

		// if (allSameValue) {	//if all the values were the same, the graph is worthless return empty suggestion
		// 	return {};
		// }

		if (suggestion['legend']) {
			//if we have defined a legend, we have pie chart
			suggestion['legend']['selected'] = selectedFields; //set the selection to the first 5 nonnull values
		}

		let values;
		if (shouldSort && chartType.includes('bar')) { //bar charts should preferably be sorted
			values = this.sort(data, 1);
			let params = suggestion['dataset']['source'][0];
			suggestion['dataset']['source'] = [params].concat(values);
		}

		//console.log('suggestion w/ data', suggestion);

		return suggestion;
	}

	/**
	 * This adds an extra data series to the graph, so it will also display as a separate colour
	 * @param suggestion the chart suggestion to add the series to
	 * @param data the data belonging to the series
	 * @return suggestion the new suggestion
	 */
	static addSeriesData(suggestion, { forecast, trimmedSet }) {
		if (!suggestion || !suggestion['series'] || !suggestion['series'][0]) {
			console.log('Invalid series in given suggestion');
		}
		let original = suggestion['series'][0];
		original.name = 'Original Data';

		let series1 = {
			type: original.type,
			data: trimmedSet,
			name: 'Estimated Data',
		};

		let series2 = {
			type: original.type,
			data: forecast,
			name: 'Forecast Data',
		};
		suggestion['series'].push(series1);
		suggestion['series'].push(series2);

		suggestion.legend = {
			data: [original.name, series1.name, series2.name],
		};
		return suggestion;
	}

	/**
	 * A function to sort the data from large to small
	 * @param data the data to sort
	 * @param order the order to sort the data in. -1 is descending, 1 is ascending
	 * @returns sorted the sorted data
	 */
	static sort(data, order = 1) {
		let sorted = this.mergeSort(data, 0, data.length);
		if (order === -1) {
			sorted = sorted.reverse();
		}
		return sorted;
	}

	/**
	 * A mergesort for 2D data
	 * @param dataArray the 2D data
	 * @param first the first item in the data to start sorting from
	 * @param last the last item in the data to start sorting from
	 * @returns combined the combined arrays after sorting
	 */
	static mergeSort(dataArray, first, last) {
		if (first > last) {
			return [];
		} else if (first === last) {
			return dataArray.slice(first, last + 1);
		} else {
			let middle = Math.trunc((last + first) / 2);
			let left = this.mergeSort(dataArray, first, middle);
			let right = this.mergeSort(dataArray, middle + 1, last);
			let combined = [];

			let i = 0;
			let j = 0;
			let k = 0;

			while (i < left.length && j < right.length) {
				if (left[i][1] <= right[j][1]) {
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

	static blacklistSource(source) {
		if (!this.metadata || !this.metadata[source]) {
			console.log('Cannot blacklist source: ', source);
		} else {
			console.log('REMOVING SOURCE:', source);

			delete this.metadata[source];
			delete this.acceptedEntities[source];
		}
	}

	/**
	 * In an attempt to improve suggestion generation, entity suggestions that generate null suggestions are blacklisted
	 * @param source the source to access the entity
	 * @param entity the entity to remove
	 * @param set the set to find the entity to remove
	 */
	static blacklistEntity(source, entity, set) {
		if (!this.metadata || !this.metadata[source] || !this.metadata[source].items[entity]) {
			console.log('Cannot blacklist entity: ', entity, ' of source: ', source, ', as it does not exist');
		} else {
			console.log('REMOVING ENTITY:', source, entity);

			//entity without fields is a useless entity
			delete this.metadata[source].items[entity];
			delete this.metadata[source].types[entity];
			delete this.metadata[source].associations[entity];

			const setIndex = this.metadata[source].sets.indexOf(set);
			if (setIndex >= 0) this.metadata[source].sets.splice(setIndex, 1);

			let index = this.acceptedEntities[source].indexOf(entity);
			if (index >= 0) {
				this.acceptedEntities[source].splice(index, 1);
			}

			if (Object.keys(this.metadata[source].items).filter((item) => this.acceptedEntities[source].includes(item)).length <= 0) {
				this.blacklistSource(source);
			}
		}
	}

	/**
	 * In an attempt to improve suggestion generation, field suggestions that generate null suggestions are blacklisted
	 * @param source the source to access the entity
	 * @param entity the entity to access the field
	 * @param set the set to remove the entity from
	 * @param field the field to blacklist
	 */
	static blacklistField(source, entity, set, field) {
		if (!this.metadata) {
			console.log('Metadata not set');
		} else if (!this.metadata[source]) {
			console.log('No source: ', source, ' to blacklist field: ', field);
		} else if (!this.metadata[source].items[entity]) {
			console.log('Entity: ', entity, ' cannot be removed as it does not exist in source: ', source);
		} else if (!this.metadata[source].items[entity].length === 0) {
			console.log('Cannot blacklist field: ', field, 'of entity: ', entity, ' of source: ', source, ', as no fields exist');
		} else {
			console.log('REMOVING FIELD:', source, entity, field);

			let index = this.metadata[source].items[entity].indexOf(field);

			// console.log(index, this.metadata[source]);

			if (index < 0) {
				console.log('Cannot blacklist field: ', field, 'of entity: ', entity, ' of source: ', source, ', as it does not exist');
			} else {
				this.metadata[source].items[entity].splice(index, 1);
				this.metadata[source].types[entity].splice(index, 1);

				if (this.metadata[source].items[entity].length === 0) {
					this.blacklistEntity(source, entity, set);
				}
			}
		}
	}
}
GraphSuggesterController.acceptedEntities = {};
GraphSuggesterController.metadata = [];
GraphSuggesterController.suggestionsMade = 0;

module.exports = GraphSuggesterController;
