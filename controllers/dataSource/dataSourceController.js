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
	static getEntityData(src, entity, field) {
		return new Promise((resolve, reject) => {
			if (Cache.validateEntityData(src, entity)) resolve(DataSource.entityData(src, entity, field));
			else {
				DataSource.updateEntityData(src, entity)
					.then(() => resolve(DataSource.entityData(src, entity, field)))
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
	static entityData(src, entity, field) {
		const entityData = Cache.getEntityData(src, entity, field);

		return {
			source: src,
			entity: entity,
			data: entityData,
		};
	}

	static parseMetadata(xmlData) {
		return Odata.parseODataMetadata(xmlData);
	}
}

module.exports = DataSource;
