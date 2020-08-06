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
const DOMParser = require('xmldom').DOMParser;
const graphSuggesterAI = require('../graphSuggesterAI/graphSuggesterAI').getInstance();

/**
 * This class handles all requests for graph suggestion generation.
 * Usage Instructions: This class requires a JSON object containing the data that suggestions
 * must be generated for so it can pass it to the graph suggester.
 * @author Marco Lombaard
 */
class GraphSuggesterController {
	/**
	 * This function passes the data that suggestions need to be generated for, to the graph
	 * suggester in graphSuggesterAI.js.
	 * @param jsonData the data that suggestions need to be generated for, passed in JSON format
	 * @returns the suggestions that were generated, in JSON format.
	 */
	static getSuggestions(jsonData) {
		return graphSuggesterAI.getSuggestions(jsonData);
	}

	/**
	 * This function passes the target graph that must become the fittest graph to the graph
	 * suggester in graphSuggesterAI.js.
	 * @param target the target graph.
	 */
	static changeFitnessTarget(target) {
		graphSuggesterAI.changeFitnessTarget(target);
	}

	/**
	 * This function passes the fields that should not be selected in graph generation.
	 * @param fields the fields to be excluded in graph suggestion generation
	 */
	static limitFields(fields) {
		graphSuggesterAI.excludeFields(fields);
	}

	/**
	 * This function deduces the fitness characteristics from an eChart style graph and updates them as the target.
	 * @param graph the target graph as an object in eCharts format
	 * @return {boolean} a boolean value indicating whether changing the fitness was successful
	 */
	static setFittestEChart(graph) {
		//if the graph is null, then we are resetting preferences for the fitness target
		if (graph == null){	//eslint-disable-line
			console.log('setFittestEChart received null, resetting fitness target...');
			graphSuggesterAI.changeFitnessTarget(null, null);
			return true;
		}
		//check if the required values are in the object
		if (
			graph['series'] == null || //eslint-disable-line
			graph['dataset'] == null //eslint-disable-line
		) {
			console.log('Check that graph, graph series and graph dataset are not empty or null');
			return false;	//required values missing, signal failure
		}

		let graphType = graph['series']['type'];	//the type of chart
		let dataset = graph['dataset'];
		
		//check if there is a source
		if (dataset['source'] == null || dataset['series'] == null) {//eslint-disable-line
			console.log('Check that dataset has a source and series information');
			return false;	//required value missing, return failure
		}
		
		let fieldSample = dataset['source'];	//select the first entry as a sample
		let encoding = dataset['series']['encode'];			//get encode information

		//if the dataset is empty
		if (fieldSample.length <= 1) { //eslint-disable-line
			console.log('Check that dataset source has entries');
			return false;
		}
		
		fieldSample = fieldSample[1];	//select the first data entry
		
		//check if entry is empty or if there is no data value
		if (fieldSample == null || fieldSample.length === 0) {//eslint-disable-line
			console.log('Check that entries have values');
			return false;
		}

		//check that encoding is present and not empty
		if (encoding == null || encoding.isEmpty) { //eslint-disable-line
			console.log('Check that \'encode\' is not empty');
			return false;
		}

		let keys = Object.keys(encoding);

		//check if there are keys
		if (keys.length === 0){
			console.log('check that \'encode\' has keys');
		}

		let fieldIndex = -1;	//the index at which values are found in all entries

		//determine which part of the dataset is the 'value' part
		if (keys.includes('x') && keys.includes('y')) {
			if (encoding['x'].includes('value')) {//x-axis has values and not labels
				fieldIndex = 0;
			} else {									//y-axis has values and not labels
				fieldIndex = 1;
			}
		} else if (keys.includes('x') && encoding['x'].includes('value')){	//x-axis is the only axis
			fieldIndex = 0;
		} else if (keys.includes('y') && encoding['y'].includes('value')){	//y-axis is the only axis
			fieldIndex = 1;
		} else if (keys.includes('value')){	//pie charts, etc. have a different setup, not x and y-axis
			fieldIndex = keys.indexOf('value');	//this index is which index of an entry contains values
		}

		//check if the index is valid, i.e. the part of each entry containing values was identified
		if (fieldIndex < 0){
			console.log('Could not determine which part of the dataset contains values');
			return false;
		}

		let fieldType = typeof fieldSample[fieldIndex];	//the type of data that is preferred for graph generation

		graphSuggesterAI.changeFitnessTarget(graphType, fieldType);	//set these values as the fitness target for the IGA

		return true;
	}

	/**
	 * This function parses the metadata which is received in XML format and passes it to the suggester
	 * so it knows what it can suggest. It passes the properties(treated as terminal nodes) and the
	 * navigation properties(so it can go to deeper layers) via the setMetadata function.
	 * @param xmlData the metadata in XML format.
	 * @returns an object containing the parsed items and associated tables as well as the item sets in each "table"
	 */
	static parseODataMetadata(xmlData) {
		if (xmlData == null) {	//eslint-disable-line
			return null;
		}
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xmlData, 'text/xml');
		let entitySets = xmlDoc.getElementsByTagName('EntitySet'); //all "tables" that are available
		let entityTypes = xmlDoc.getElementsByTagName('EntityType'); //all "tables" that are available
		let items = []; //each "table" has its own items
		let sets = []; //each "table" has its own items
		let index; //used to index items for JSON parsing
		let children; //children of each entity(basically elements/attributes)
		let links; //links to other "tables" associated with this one
		let associations = []; //associated tables - used in suggestion generation

		for (let i = 0; i < entityTypes.length; i++) {
			//step through each table and find their items
			//The idea is to use strings as indices for JSON parsing, here the name of the entity is used
			index = entityTypes[i].attributes.getNamedItem('Name').value;
			items[index] = [];
			sets.push(entitySets[i].attributes.getNamedItem('Name').value);
			associations[index] = [];

			children = entityTypes[i].getElementsByTagName('Property');

			for (let j = 0; j < children.length; j++) {
				//store the 'fields' of each 'table'
				items[index][j] = children[j].attributes.getNamedItem('Name').value;
			}

			links = entityTypes[i].getElementsByTagName('NavigationProperty');

			for (let j = 0; j < links.length; j++) {
				//store the 'tables' associated with the current 'table'
				associations[index][j] = links[j].attributes.getNamedItem('Name').value;
			}
		}
		graphSuggesterAI.setMetadata(items, associations);

		return { items, associations, sets };
	}
}

module.exports = GraphSuggesterController;
