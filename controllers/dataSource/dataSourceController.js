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
 * Functional Description: This file implements a data source that handles any data source requests.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const DOMParser = require('xmldom').DOMParser;
const Cache = require('./cache');
const Odata = require('./Odata');
/**
 * Purpose: This class is responsible for getting DataSources.
 * Usage Instructions: Use the corresponding getters to retrieve class variables.
 * Class functionality should be accessed through restController.js.
 * @author Phillip Schulze
 */
class DataSource {
	static updateMetaData(src) {
		return new Promise((resolve, reject) => {
			Odata.getMetaData(src)
				.then((data) => {
					data = DataSource.parseODataMetadata(data);
					// data.items = [1, 2, 3, 4, 5];
					Cache.setMetaData(src, data);
					resolve();
				})
				.catch((err) => reject(err));
		});
	}

	static updateEntityData(src, entity) {
		return new Promise((resolve, reject) => {
			Odata.getEntityData(src, entity)
				.then((data) => {
					Cache.setEntityData(src, entity, data);
					resolve();
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * This function gets Odata.
	 * @param src the source where this Odata must be retrieved from
	 * @returns a promise of Odata
	 */
	static getMetaData(src) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) resolve(Cache.getMetaData(src));
			else {
				DataSource.updateMetaData(src)
					.then(() => resolve(Cache.getMetaData(src)))
					.catch((err) => reject(err));
			}
		}); //Returns a promise
	}
	/**
	 * This function gets an entity list.
	 * @param src the source where this entity list must be retrieved from
	 * @returns a promise of the entity list
	 */
	static getEntityList(src) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) {
				const data = DataSource.entityList(src);
				resolve(data);
			} else {
				DataSource.updateMetaData(src)
					.then(() => {
						const data = DataSource.entityList(src);
						resolve(data);
					})
					.catch((err) => reject(err));
			}
		}); //Returns a promise
	}

	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, entity) {
		return new Promise((resolve, reject) => {
			if (Cache.validateEntityData(src, entity)) {
				resolve(DataSource.entityData(src, entity));
			} else {
				DataSource.updateEntityData(src, entity)
					.then(() => resolve(DataSource.entityData(src, entity)))
					.catch((err) => reject(err));
			}
		}); //Returns a promise
	}

	static entityList(src) {
		const data = Cache.getEntityList(src);

		return {
			source: src,
			entityList: data,
		};
	}
	static entityData(src, entity) {
		return {
			source: src,
			entity: entity,
			data: Cache.getEntityData(src, entity),
		};
	}

	/**
	 * This function parses the metadata which is received in XML format and passes it to the suggester
	 * so it knows what it can suggest. It passes the properties(treated as terminal nodes) and the
	 * navigation properties(so it can go to deeper layers) via the setMetadata function.
	 * @param xmlData the metadata in XML format.
	 * @returns an object containing the parsed items and associated tables as well as the item sets and data-types in each "table"
	 */
	static parseODataMetadata(xmlData) {
		if (xmlData == null) return null; //eslint-disable-line

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

		for (let i = 0; i < entityTypes.length; i++) {
			//step through each table and find their items
			//The idea is to use strings as indices for JSON parsing, here the name of the entity is used
			index = entityTypes[i].attributes.getNamedItem('Name').value;
			items[index] = [];

			associations[index] = []; //initialise array
			types[index] = []; //initialise array

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
		}
		return { items, associations, sets, types };
	}
}

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

module.exports = DataSource;
