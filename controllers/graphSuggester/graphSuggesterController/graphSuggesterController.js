/**
 * @file GraphSuggesterController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 * 01/07/2020    Marco Lombaard     Added parseODataMetadata function
 * 09/07/2020    Marco Lombaard     Fixed parseODataMetaData function
 * 05/08/2020	 Marco Lombaard		Changed class from singleton to normal class w/ static functions
 * 05/08/2020	 Marco Lombaard		Added limitFields and setFittestEChart functions
 * 07/08/2020	 Marco Lombaard		Added data-types array to return in parseODataMetaData function
 * 07/08/2020	 Marco Lombaard		Fixed setFittestEChart function, added setGraphTypes
 * 07/08/2020	 Phillip Schulze	Moved parseODataMetadata function to Odata.js
 * 11/08/2020	 Marco Lombaard		Removed deprecated changeFittestGraph function
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
	 * @param items	the entities('tables') and their related attributes/fields
	 * @param associations the other entities associated with this entity(containing related data)
	 * @param types the data types of each field, organised by entity
	 */
	static setMetadata({ items, associations, types }) {
		graphSuggesterAI.setMetadata(items, associations, types);
	}

	/**
	 * This function passes the data that suggestions need to be generated for, to the graph
	 * suggester in graphSuggesterAI.js.
	 * @param jsonData the data that suggestions need to be generated for, passed in JSON format
	 * @returns the suggestions that were generated, in JSON format.
	 */
	static getSuggestions(jsonData) {
		if (jsonData == null) {
			//eslint-disable-line
			return null;
		}
		if (typeof jsonData !== 'string') {
			jsonData = JSON.stringify(jsonData);
		}
		return graphSuggesterAI.getSuggestions(jsonData);
	}

	/**
	 * This function passes the fields that should not be selected in graph generation.
	 * @param fields the fields to be excluded in graph suggestion generation
	 */
	static limitFields(fields) {
		graphSuggesterAI.excludeFields(fields);
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
		if (graph == null) {
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
		if (fieldSample == null || fieldSample.length === 0) {
			//eslint-disable-line
			console.log('Check that entries have values');
			return false;
		}

		//check that encoding is present and not empty
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

		let fieldIndex = -1; //the index at which values are found in all entries

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
}

module.exports = GraphSuggesterController;
