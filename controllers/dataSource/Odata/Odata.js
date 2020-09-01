/**
 * @file dataSourceController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 2/07/2020    Phillip Schulze     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a Odata class that gets Odata and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
// const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production');
/**
 * Purpose: This class is responsible for getting Odata.
 * Usage Instructions: Use the corresponding getters to retrieve class variables. And use the format to format this Odata
 * @author Phillip Schulze
 */
class Odata {
	/**
	 * This function gets Odata.
	 * @param src the source where this Odata must be retrieved from
	 * @returns a promise of Odata
	 */
	static getMetaData(src) {
		if (Odata.logging) console.log('Odata: ', Odata.formatMetaData(src));
		return new Promise((resolve, reject) => {
			axios
				.get(Odata.formatMetaData(src))
				.then((res) => {
					const { data } = res;
					resolve(data);
				})
				.catch((err) => reject(err));
		});
	}
	/**
	 * This function gets an entity list.
	 * @param src the source where this entity list must be retrieved from
	 * @returns a promise of the entity list
	 */
	static getEntityList(src) {
		if (Odata.logging) console.log('Odata: ', Odata.format(src));
		return new Promise((resolve, reject) => {
			axios
				.get(Odata.format(src))
				.then((res) => {
					const { EntitySets } = res.data.d;
					resolve(EntitySets);
				})
				.catch((err) => reject(err));
		});
	}
	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, entity) {
		if (Odata.logging) console.log('Odata: ', Odata.formatEntity(src, entity));
		return new Promise((resolve, reject) => {
			axios
				.get(Odata.formatEntity(src, entity))
				.then((res) => {
					const { results } = res.data.d;
					resolve(results);
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * This function parses the metadata which is received in XML format and passes it to the suggester
	 * so it knows what it can suggest. It passes the properties(treated as terminal nodes) and the
	 * navigation properties(so it can go to deeper layers) via the setMetadata function.
	 * @param xmlData the metadata in XML format.
	 * @returns an object containing the parsed items and associated tables as well as the item sets and data-types in each "table"
	 */
	static parseMetadata(xmlData) {
		if (!xmlData || xmlData == null) return null; //eslint-disable-line

		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xmlData, 'text/xml');
		let entitySets = xmlDoc.getElementsByTagName('EntitySet'); //all "tables" that are available
		let entityTypes = xmlDoc.getElementsByTagName('EntityType'); //all "tables" that are available
		let items = {}; //each "table" has its own items
		let sets = []; //each "table" has its own items
		let index; //used to index items for JSON parsing
		let children; //children of each entity(basically elements/attributes)
		let links; //links to other "tables" associated with this one
		let associations = {}; //associated tables - used in suggestion generation
		let types = {}; //the data types of the fields
		let keyRefs = {};
		let primsArray = [];
		let prims = {};

		for (let i = 0; i < entityTypes.length; i++) {
			//step through each table and find their items
			//The idea is to use strings as indices for JSON parsing, here the name of the entity is used
			index = entityTypes[i].attributes.getNamedItem('Name').value;
			items[index] = [];

			associations[index] = []; //initialise array
			types[index] = []; //initialise array

			keyRefs = entityTypes[i].getElementsByTagName('Key');

			for (let j = 0; j < keyRefs.length; j++) {
				primsArray.push(keyRefs[j].getElementsByTagName('PropertyRef')[0].attributes.getNamedItem('Name').value);
			}

			children = entityTypes[i].getElementsByTagName('Property');

			for (let j = 0; j < children.length; j++) {
				//store the 'fields' of each 'table'
				items[index][j] = children[j].attributes.getNamedItem('Name').value;
				//store the types of each 'field'
				types[index][j] = children[j].attributes.getNamedItem('Type').value;
			}

			links = entityTypes[i].getElementsByTagName('NavigationProperty');

			for (let j = 0; j < links.length; j++) {
				//store the 'tables' associated with the current 'table'
				associations[index][j] = links[j].attributes.getNamedItem('Name').value;
			}
		}

		for (let i = 0; i < entitySets.length; i++) {
			//not to be confused with 'items', which uses entityTypes. This uses entitySets
			sets.push(entitySets[i].attributes.getNamedItem('Name').value);
			prims[sets[i]] = primsArray[i];
		}
		return { items, associations, sets, types, prims };
	}

	/**
	 * This function formats data in to json.
	 * @param src the source that needs to be formatted
	 * @returns string of json format
	 */
	static format(src) {
		return `${src}/?$format=json`;
	}

	/**
	 * This function formats an entity in to json.
	 * @param src the source that needs to be formatted
	 * @param entity the entity that needs to be formatted
	 * @returns string of json format
	 */
	static formatEntity(src, entity) {
		return `${src}/${entity}/?$format=json`;
	}

	/**
	 * This function formats an entity in to json and removes the metadata.
	 * @param obj the json object to be formatted
	 * @returns string of json format
	 */
	// function removeMeta(obj) {
	// 	console.log(delete obj['__metadata']);
	// 	return obj;
	// }
	/**
	 * This function formats an metadata in to json.
	 * @param src the source that needs to be formatted
	 * @returns string of json format
	 */
	static formatMetaData(src) {
		return `${src}/$metadata`;
	}
}
Odata.logging = false;

module.exports = Odata;
