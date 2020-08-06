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
const Cache = require('./cache');
const Odata = require('./Odata');
/**
 * Purpose: This class is responsible for getting DataSources.
 * Usage Instructions: Use the corresponding getters to retrieve class variables.
 * Class functionality should be accessed through restController.js.
 * @author Phillip Schulze
 */
class DataSource {
	/**
	 * This function gets Odata.
	 * @param src the source where this Odata must be retrieved from
	 * @returns a promise of Odata
	 */
	static getMetaData(src) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) resolve(Cache.getMetaData(src));
			else {
				Odata.getMetaData(src)
					.then((data) => {
						Cache.setMetaData(src, data);
						resolve(Cache.getMetaData(src));
					})
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
			if (Cache.validateEntityList(src)) resolve(Cache.getEntityList(src));
			else {
				Odata.getEntityList(src)
					.then((data) => {
						Cache.setEntityList(src, data);
						resolve(Cache.getEntityList(src));
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
			if (Cache.validateFieldList(src, entity)) resolve(Cache.getFieldList(src, entity));
			else {
				Odata.getEntityData(src, entity)
					.then((data) => {
						Cache.setFieldList(src, entity, data);
						resolve(Cache.getFieldList(src, entity));
					})
					.catch((err) => reject(err));
			}
		}); //Returns a promise
	}
}

module.exports = DataSource;
