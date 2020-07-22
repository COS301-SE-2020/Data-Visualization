/**
 * @file graphSuggesterAI.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * --------------------------------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 * 01/07/2020    Marco Lombaard     Added setMetadata function
 * 02/07/2020    Marco Lombaard     Added constructOption function
 * 09/07/2020    Marco Lombaard     Fixed getSuggestions and setMetaData functions
 * 15/07/2020    Marco Lombaard     Added more graph types to suggestion generation
 *
 * Test Cases: none
 *
 * Functional Description: This file implements the graph suggestion functionality of the app. It generates the
 * suggestions via a genetic algorithm, where the best-fitness is decided by the user's preferences. It will
 * then return these suggestions as a JSON object.
 *
 * Error Messages: "Error"
 * Assumptions: Input values are assumed to be in JSON format when requesting suggestions.
 * Constraints: Input values must be in JSON format when requesting suggestions.
 */

/**
 * Purpose: This class is responsible for suggestion generation when graph suggestions are generated.
 * Usage Instructions: Use the corresponding getters and setters to modify/retrieve class variables.
 *                     Class functionality should be accessed through graphSuggestionController.js.
 * @author Marco Lombaard
 */
class graphSuggesterAI {
	/**
	 * The default constructor for the object - initialises class variables
	 */
	constructor() {
		//graphTypes are the types of graphs that can be generated - TODO right now it's hardcoded, it should be set by setGraphTypes
		this.graphTypes = [ 'line', 'bar', 'pie', 'scatter', 'effectScatter', 'parallel', 'candlestick', 'map', 'funnel', 'custom' ];
		this.graphWeights = [];
		this.terminals = [];
		this.nonTerminals = [];
		this.nodeWeights = [];
		//initialise maybe
	}

	/**
	 * This function sets the available types of graphs so that graph suggestion knows which graphs it can
	 * suggest.
	 * @param newTypes the new graph types that can be selected(such as bar/pie charts) in array format
	 */
	setGraphTypes(newTypes) {
		this.graphTypes = [];
		for (let i = 0; i < newTypes.length; i++) {
			this.graphTypes[i] = newTypes[i];
		}

		//TODO maybe add some way to carry over/reset weights?
	}

	/**
	 * This function sets the nodes that can be selected for graph suggestions.
	 * @param items the 'terminal' nodes, these don't lead to other tables for data.
	 * @param associations the 'non-terminal' nodes, these lead to other tables for data.
	 */
	setMetadata(items, associations) {
		let count = 0; //used to set weights for all nodes(option pool)
		let defaultWeight = 10; //just a default weight for IGA
		this.terminals = []; //reset values so that old ones don't interfere
		this.nonTerminals = [];
		this.nodeWeights = [];

		let itemsKeys = Object.keys(items);
		let associationKeys = Object.keys(associations);

		for (let i = 0; i < itemsKeys.length; i++) {
			this.terminals[itemsKeys[i]] = items[itemsKeys[i]];
			this.nodeWeights[count] = defaultWeight;
			count++;
		}

		for (let i = 0; i < associationKeys.length; i++) {
			this.nonTerminals[associationKeys[i]] = associations[associationKeys[i]];
			this.nodeWeights[count] = defaultWeight;
			count++;
		}

		this.totalWeight = (count - 1) * defaultWeight;

		// console.log(this.terminals);
	}

	/**
	 * This function returns the graph suggestions in JSON format.
	 * @param jsonData the data to be used in suggestion generation, in JSON format.
	 * @return suggestions the suggested graphs in JSON format.
	 */
	getSuggestions(jsonData) {
		// let object = JSON.parse(jsonData);
		let object = jsonData;
		// object = object [ 'd' ];            //OData always starts with 'd' as the main key
		let results = object['results']; //OData follows up with 'results' key

		if (results == null) { //eslint-disable-line
			results = object;
		}
		if (results == null || results.length === 0) { //eslint-disable-line
			console.log('RESULTS array has length of 0.');
			return null;
		}

		if (results == null) { //eslint-disable-line
			//Didn't follow with 'results' key, will have to go to a deeper layer
			console.log('Need to go a layer deeper');
			return null;
			//request deeper layer based on 'redirect' field
		} else {
			//generate suggestions
			let type = results[0]['__metadata']['type']; //get the table type(Customers, Products, etc.)

			type = type.substr(type.indexOf('.') + 1); //they all start with 'Northwind.' so trim that out
			//TODO make it adapt to different sources

			//   console.log(this.terminals);
			//   console.log(type);

			let keys = this.terminals[type]; //check the available keys in the metadata
			let options = []; //the available key options(processed later)
			let count = 0; //the index for options
			let nameKey = null;

			//   console.log(keys);

			for (let key = 0; key < keys.length; key++) {
				//go through all the keys and get rid of IDs and such
				//those keys are not graph data, just identifiers
				let name = keys[key]; //the key

				if (
					!(
						name.includes('ID') ||
						name.includes('Name') ||
						name.includes('Picture') ||
						name.includes('Description') ||
						name.includes('Date')
					)
				) {
					//trim out the "useless" keys
					options[count++] = keys[key]; //add the key if it is meaningful data
				} else if ((name.includes('Name') || name.includes('ID')) && nameKey == null) { //eslint-disable-line
					//store the name key for later access
					nameKey = name;
				}
			}

			let hasData = false; //check variable used to see if data exists or if a deeper thread is followed

			for (let i = 0; i < options.length; i++) {
				if (results[0][options[i]]['__deferred'] == null) { //eslint-disable-line
					//if this isn't a link then we have data
					hasData = true;
					break;
				}
			}

			if (!hasData) {
				//if we don't have data then request the deeper layer(s)
				//TODO request the (deeper layer) data from dataSource and add them to the options
				console.log('Need to go deeper for more info');
				return null;
			}

			let choice = Math.trunc(Math.random() * options.length); //select random index - TODO let the GA do this
			let data = []; //2D array containing item names and attributes
			let params = [ nameKey, 'value' ]; //the labels for column values
			let graph = this.graphTypes[Math.trunc(Math.random() * 5)]; //select a random graph type - TODO replace 5 with graphTypes.length

			for (let i = 0; i < results.length; i++) {
				//Store name of field and its chosen attribute in data
				data[i] = [ results[i][nameKey], results[i][options[choice]] ];
			}

			//generate the graph option - TODO fix the hardcoding
			let option = this.constructOption(data, graph, params, params[0], params[1], type);

			return option;
		}
	}

	/**
	 * This function constructs and returns the graph parameters for eChart graph generation in frontend.
	 * @param data an array containing data arrays, which contain data for graphs.
	 * @param graph the type of graph to be used.
	 * @param params the labels for data, used to select which entries go on the x and y-axis.
	 * @param xEntries the entry/entries used on the x-axis.
	 * @param yEntries the entry/entries used on the y-axis.
	 * @param graphName the suggested name of the graph
	 * @return option the data used to generate the graph.
	 */
	constructOption(data, graph, params, xEntries, yEntries, graphName) {
		let src = [];
		src[0] = params;

		for (let i = 0; i < data.length; i++) {
			src[i + 1] = data[i];
		}

		//this constructs the options sent to the Apache eCharts API - this will have to be changed if
		//a different API is used
		let option = {
			title: {
				text: graphName,
			},
			dataset: {
				source: src,
			},
			xAxis: { type: 'category' }, //TODO change this so the type(s) gets decided by frontend or by the AI
			yAxis: {},
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

		if (graph.includes('pie')) {
			//for pie charts
			option.series = [
				{
					type: graph,
					radius: '60%',
					label: {
						formatter: '{b}: {@' + yEntries + '} ({d}%)',
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

		return option;
	}

	/**
	 * This function sets the target graph as the fittest individual, so the genetic algorithm tries to
	 * achieve more generations of that type.
	 * @param target the target graph type
	 */
	changeFitnessTarget(target) {
		//change target with best fitness
		let targetPosition = this.graphTypes.indexOf(target);
		let worstWeight = 10; //this doesn't have to be hardcoded and can be decided by an algorithm/formula

		for (let i = 0; i < this.graphWeights.length; i++) {
			this.graphWeights[i] = worstWeight; //reset weights so that fittest individual is the target
		}

		this.graphWeights[targetPosition] = 0; //set target to fittest individual

		/*
                the idea is something along the lines of:
                graphWeights[target] = bestWeight(so probably 0, maybe some other value for less extreme suggestion changes)
                graphWeights[originalTarget] = lesserWeight or worstWeight(make other options less attractive again)
         */
	}
}
module.exports = graphSuggesterAI;
