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
 * 02/07/2020    Phillip Schulze     Original
 * 06/08/2020    Phillip Schulze     DataSource now uses a cache to stored passed requests
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
	 * This function updates meta data that is stored in the cache for this data source.
	 * @param src the source where this Odata must be retrieved from
	 * @returns a promise of Odata
	 */
	static updateMetaData(src) {
		return new Promise((resolve, reject) => {
			Odata.getMetaData(src)
				.then((data) => {
					data = DataSource.parseMetadata(data);
					// data.items = [1, 2, 3, 4, 5];
					Cache.setMetaData(src, data);
					resolve();
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * This function updates entity data that is stored in the cache for this data source and entity.
	 * @param src the source where this Odata must be retrieved from
	 * @param entity the entity to which the data belongs to
	 * @returns a promise of Odata
	 */
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
				const data = Cache.getEntityList(src);
				resolve(formatList(src, data));
			} else {
				DataSource.updateMetaData(src)
					.then(() => {
						const data = Cache.getEntityList(src);
						resolve(formatList(src, data));
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
	static getEntityData(src, entity, field) {
		return new Promise((resolve, reject) => {
			if (Cache.validateEntityData(src, entity)) {
				const data = Cache.getEntityData(src, entity, field);
				resolve(formatData(src, entity, field, data));
			} else {
				DataSource.updateEntityData(src, entity)
					.then(() => {
						const data = Cache.getEntityData(src, entity, field);
						resolve(formatData(src, entity, field, data));
					})
					.catch((err) => reject(err));
			}
		});
	}

	/**
	 * This function parses XML metadata to a standard JS object.
	 * @param xmlData the XML metadata received from an external data source
	 * @returns a standard JS object
	 */
	static parseMetadata(xmlData) {
		return Odata.parseODataMetadata(xmlData);
	}
}

/**
 * This function formats entity list.
 * @param src the source where the entity data was retrieved from
 * @param data the entity list and each of its fields
 * @returns a JS object
 */
function formatList(src, data) {
	return {
		source: src,
		entityList: data,
	};
}

/**
 * This function formats entity list.
 * @param src the source where the entity data was retrieved from
 * @param entity the entity to which the field belongs to
 * @param field the field to which the data belongs to
 * @param entityData the field data for each item from this entity
 * @returns a JS object
 */
function formatData(src, entity, field, entityData) {
	return {
		source: src,
		entity: entity,
		field: field,
		data: entityData,
	};
}

module.exports = DataSource;
