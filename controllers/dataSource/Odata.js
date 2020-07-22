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
		// if (!PRODUCTION) console.log('Odata: ', formatMetaData(src));
		return new Promise((resolve, reject) => {
			axios
				.get(formatMetaData(src))
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
		// if (!PRODUCTION) console.log('Odata: ', format(src));
		return new Promise((resolve, reject) => {
			axios
				.get(format(src))
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
		// if (!PRODUCTION) console.log('Odata: ', formatEntity(src, entity));
		return new Promise((resolve, reject) => {
			axios
				.get(formatEntity(src, entity))
				.then((res) => {
					const { results } = res.data.d;
					resolve(results);
				})
				.catch((err) => reject(err));
		});
	}
}
/**
 * This function formats data in to json.
 * @param src the source that needs to be formatted
 * @returns string of json format
 */
function format(src) {
	return `${src}/?$format=json`;
}
/**
 * This function formats an entity in to json.
 * @param src the source that needs to be formatted
 * @param entity the entity that needs to be formatted
 * @returns string of json format
 */
function formatEntity(src, entity) {
	return `${src}/${entity}/?$format=json`;
}
/**
 * This function formats an metadata in to json.
 * @param src the source that needs to be formatted
 * @returns string of json format
 */
function formatMetaData(src) {
	return `${src}/$metadata`;
}

module.exports = Odata;
