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
 * 27/08/2020    Elna Pistorius 		 Added error code that is sent back to route endpoints
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
const Odata = require('./Odata/Odata');
const GraphQL = require('./GraphQL/GraphQL');

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
	static updateMetaData(src, type) {
		return new Promise((resolve, reject) => {
			DataSource.Data(type)
				.getMetaData(src)
				.then((data) => {
					data = DataSource.parseMetadata(data, type);
					// data.items = [1, 2, 3, 4, 5];
					Cache.setMetaData(src, data);
					resolve();
				})
				.catch((err) => reject({ error: err, status: 500 }));
		});
	}

	/**
	 * This function updates entity data that is stored in the cache for this data source and entity.
	 * @param src the source where this Odata must be retrieved from
	 * @param entity the entity to which the data belongs to
	 * @returns a promise of Odata
	 */
	static updateEntityData(src, type, entity) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			let fieldList = [];

			console.log(type);

			if (type === 1) {
				let meta = await this.getMetaData(src);
				// console.log('META:', Object.keys(meta.items));
				// console.log('ENTITY:', entity);
				// console.log('FIELDS:', meta.items[entity]);
				// console.log('META:', meta.items);

				fieldList = meta.items[entity];
			}
			DataSource.Data(type)
				.getEntityData(src, entity, fieldList)
				.then((data) => {
					Cache.setEntityData(src, entity, data);
					resolve();
				})
				.catch((err) => {
					reject({ error: err, status: 500 });
				});
		});
	}
	static async getGraphQLFieldList(src, entity) {
		let meta = await this.getMetaData(src);
		//console.log('datasource metadata: ', meta);
		return meta.items[entity];
	}
	/**
	 * This function gets Odata
	 * @param src the source where this Odata must be retrieved from
	 * @returns a promise of Odata
	 */
	static getMetaData(src, type) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) resolve(Cache.getMetaData(src));
			else {
				DataSource.updateMetaData(src, type)
					.then(() => resolve(Cache.getMetaData(src)))
					.catch((err) => reject({ error: err, status: 500 }));
			}
		}); //Returns a promise
	}
	/**
	 * This function gets an entity list.
	 * @param src the source where this entity list must be retrieved from
	 * @returns a promise of the entity list
	 */
	static getEntityList(src, type) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) {
				const data = Cache.getEntityList(src);
				resolve(formatList(src, data));
			} else {
				DataSource.updateMetaData(src, type)
					.then(() => {
						const data = Cache.getEntityList(src);
						resolve(formatList(src, data));
					})
					.catch((err) => reject({ error: err, status: 500 }));
			}
		}); //Returns a promise
	}

	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @param field the field that is under consideration for a specific entity
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, type, entity, field) {
		// if (isGraphQL) entity = set;
		return new Promise(async (resolve, reject) => {
			if (!Cache.validateMetadata(src)) {
				await DataSource.updateMetaData(src).catch((err) => reject({ error: err, status: 500 }));
			}

			if (Cache.validateEntityData(src, entity)) {
				const data = Cache.getEntityData(src, entity, field);
				resolve(formatData(src, entity, field, data));
			} else {
				console.log('TYPE:', type, DataSource.Data(type));

				DataSource.updateEntityData(src, type, entity)
					.then(() => {
						const data = Cache.getEntityData(src, entity, field);
						resolve(formatData(src, entity, field, data));
					})
					.catch((err) => reject({ error: err, status: 500 }));
			}
		});
	}
	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @returns a promise of the entities data
	 */
	static getEntityDataAll(src, type, entity) {
		// if (isGraphQL) entity = set;
		return new Promise(async (resolve, reject) => {
			if (!Cache.validateMetadata(src)) {
				await DataSource.updateMetaData(src).catch((err) => reject({ error: err, status: 500 }));
			}

			if (Cache.validateEntityData(src, entity)) {
				const data = Cache.getEntityDataAll(src, entity);
				resolve(data);
			} else {
				DataSource.updateEntityData(src, type, entity)
					.then(() => {
						const data = Cache.getEntityDataAll(src, entity);
						resolve(data);
					})
					.catch((err) => reject({ error: err, status: 500 }));
			}
		});
	}
	/**
	 * This function parses XML metadata to a standard JS object.
	 * @param xmlData the XML metadata received from an external data source
	 * @returns a standard JS object
	 */
	static parseMetadata(data, type) {
		return DataSource.Data(type).parseMetadata(data);
	}

	static Data(type) {
		return DataSource.sources[type];
	}

	static sourceTypeName(type) {
		return DataSource.sourceNames[type];
	}
}
DataSource.sources = [Odata, GraphQL];
DataSource.sourceNames = ['Odata', 'GraphQL'];

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
