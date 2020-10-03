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
 * 27/08/2020    Elna Pistorius 	 Added error code that is sent back to route endpoints
 * 14/09/2020	 Marco Lombaard		 Added primaryKey parameter to getEntityData
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a data source that handles any data source requests.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const { v4: uuidv4 } = require('uuid');

const Database = require('../database/databaseController');

const Cache = require('./cache');
const Forecaster = require('./Forecast/forecaster');

const Odata = require('./Odata/Odata');
const GraphQL = require('./GraphQL/GraphQL');

const CSV = require('./CSV/CSV');
const XML = require('./XML/XML');
const JSON = require('./JSON/JSON');

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
	 * @param type
	 * @param data
	 * @param entityName
	 * @param primaryKey
	 * @param fieldlist
	 * @param typelist
	 * @returns a promise of Odata
	 */
	static updateMetaData(src, type, entityName, primaryKey, fieldlist, typelist) {
		//src, type, data, entityName, primaryKey, fieldlist, typelist

		return new Promise((resolve, reject) => {
			DataSource.Data(type)
				.getMetaData(src)
				.then(async (mdata) => {
					if (DataSource.isLocal(type)) {
						if (entityName && primaryKey && fieldlist && typelist) {
							mdata = DataSource.parseMetadataLocal(type, entityName, primaryKey, fieldlist, typelist);
						} else {
							const meta = await Database.getDataSourceLocalMeta(src);

							if (meta) {
								const { entity, prim, fields, types } = meta;
								mdata = DataSource.parseMetadataLocal(type, entity, prim, fields, types);
							} else {
								return reject({
									error: {
										message: 'Meta-Data not stored in Database and has not been provided.',
										src,
										type,
									},
									status: 500,
								});
							}
						}
					} else {
						mdata = DataSource.parseMetadataRemote(mdata, type);
					}
					Cache.setMetaData(src, mdata);
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
	static updateEntityData(src, type, entity, fieldList, inputdata) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			if (type === 1) {
				let meta = await this.getMetaData(src);
				fieldList = meta.items[entity];
			}

			if (!inputdata && DataSource.isLocal(type)) {
				inputdata = await Database.getDataSourceLocalData(src);

				if (!fieldList) {
					const meta = await DataSource.getMetaData(src, type);
					fieldList = meta.items[entity];
				}
			}

			DataSource.Data(type)
				.getEntityData(src, entity, fieldList, inputdata)
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
	static getMetaData(src, type, entityName, primaryKey, fieldlist, typelist) {
		return new Promise((resolve, reject) => {
			if (Cache.validateMetadata(src)) resolve(Cache.getMetaData(src));
			else {
				DataSource.updateMetaData(src, type, entityName, primaryKey, fieldlist, typelist)
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
	 * @param type
	 * @param entity the entity that we want data from
	 * @param field the field that is under consideration for a specific entity
	 * @param primaryKey the key used on the x-axis of the chart
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, type, entity, field, primaryKey = null) {
		// if (isGraphQL) entity = set;
		return new Promise(async (resolve, reject) => {
			if (!Cache.validateMetadata(src)) {
				await DataSource.updateMetaData(src).catch((err) => reject({ error: err, status: 500 }));
			}

			if (Cache.validateEntityData(src, entity)) {
				const data = Cache.getEntityData(src, entity, field, primaryKey);
				resolve(formatData(src, entity, field, data));
			} else {
				// console.log('TYPE:', type, DataSource.Data(type));

				DataSource.updateEntityData(src, type, entity)
					.then(() => {
						const data = Cache.getEntityData(src, entity, field, primaryKey);
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
	static parseMetadataRemote(data, type) {
		if (!DataSource.isLocal(type)) {
			return DataSource.Data(type).parseMetadata(data);
		}
		return null;
	}

	static Data(type) {
		return DataSource.sources[type];
	}

	static isLocal(type) {
		if (type < 0 || type >= DataSource.isLocalSource.length) type = 0;
		return DataSource.isLocalSource[type];
	}

	static sourceTypeName(type) {
		return DataSource.sourceNames[type];
	}

	static parseMetadataLocal(type, entityName, primaryKey, fieldlist, typelist) {
		if (DataSource.isLocal(type)) {
			return DataSource.Data(type).parseMetadata(entityName, primaryKey, fieldlist, typelist);
		}
		return null;
	}

	static generateLocalSourceFileName(type) {
		const ext = DataSource.sourceExtention[type];
		return uuidv4() + '.' + ext;
	}

	static predictTimeSeries(dataset, count = 4) {
		dataset = dataset.filter((data, i) => i > 0);
		dataset = DataSource.trimDataset(dataset);

		return new Promise((resolve, reject) => {
			Forecaster.predict(DataSource.toSeries(dataset), count)
				.then((forecast) => {
					forecast = DataSource.toDataset(forecast);
					dataset.push(forecast[0]);
					resolve({ forecast, trimmedSet: dataset });
				})
				.catch((err) => reject(err));
		});
	}

	static trimDataset(dataset) {
		const data = dataset.map((set) => set[1]);
		const avg = data.reduce((total, num) => total + num) / data.length;
		const sumSquares = data.reduce((total, num, i) => {
			if (i === 1) total = Math.pow(total - avg, 2);
			total += Math.pow(num - avg, 2);
			return total;
		});
		const n1 = data.length - 1;
		const standardDeviation = Math.sqrt(sumSquares / n1);
		const numDevs = standardDeviation > avg / 2 ? 1 : 2;

		const devUp = avg + numDevs * standardDeviation;
		const devDown = avg - numDevs * standardDeviation;

		// console.log('numDevs:', numDevs);
		// console.log('mean:', avg);
		// console.log('stdDiv:', standardDeviation);
		// console.log('devUp:', devUp);
		// console.log('devDown:', devDown);

		const withinDeviations = (num) => {
			// console.log(Math.abs(num));

			return num <= devUp && num >= devDown;
		};

		let trimmedSet = dataset.filter((set) => withinDeviations(set[1]));

		return trimmedSet;
	}

	static toSeries(dataset) {
		const series = {};
		dataset.forEach((set, i) => {
			const time = new Date(set[0]);
			const value = set[1];
			if (i > 1) {
				const prevTime = new Date(dataset[i - 1][0]);
				const prevValue = dataset[i - 1][1];
				const diff = Math.ceil(Math.abs(time - prevTime) / (1000 * 60 * 60 * 24));
				if (diff > 1) {
					const newDays = DataSource.inbetween(prevTime, diff, prevValue, value, time);
					Object.keys(newDays).forEach((day) => (series[formatDate(day)] = newDays[day]));
				}
			}
			series[formatDate(time)] = value;
		});

		const length = Object.keys(series).length;

		// console.log(length);

		if (length > 1000) {
			let short = {};

			Object.keys(series)
				.sort()
				.forEach((value, i) => {
					if (i > length - 1000) {
						short[value] = series[value];
					}
				});

			// console.log(Object.keys(short).length);

			return short;
		}

		return series;
	}

	static toDataset(series) {
		const dataset = Object.keys(series).map((key) => {
			const date = new Date(key).toDateString();
			return [date, series[key]];
		});
		return dataset;
	}

	static inbetween(fTime, diff, fValue, lValue) {
		let days = {};

		const n = diff;

		for (let i = 0; i < n; ++i) {
			let newDate = new Date(fTime);
			newDate.setDate(fTime.getDate() + i);

			let newValue = fValue * (1 - i / (n + 1)) + lValue * (i / (n + 1));

			days[newDate] = newValue;
		}

		// console.log(n, formatDate(fTime), formatDate(lTime));
		// console.log(days);

		return days;
	}
}
DataSource.sources = [Odata, GraphQL, CSV, XML, JSON];
DataSource.sourceNames = ['Odata', 'GraphQL', 'CSV', 'XML', 'JSON'];
DataSource.isLocalSource = [false, false, true, true, true];
DataSource.sourceExtention = ['json', 'json', 'csv', 'xml', 'json'];

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

function formatDate(date) {
	let d = new Date(date);
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

module.exports = DataSource;
