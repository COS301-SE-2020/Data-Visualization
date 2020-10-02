/**
 * @file CSV.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 2/07/2020    Phillip Schulze     Original (2 October)
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a CSV class that gets CSV and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

// const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production');

class CSV {
	static getMetaData() {
		return new Promise((resolve) => resolve());
	}

	static getEntityData(src, entity, fieldList, inputdata) {
		let data = [];
		inputdata.forEach((datarow, d) => {
			let obj = {};
			fieldList.forEach((field, i) => {
				obj[field] = datarow[i];
			});
			data.push(obj);
		});
		return new Promise((resolve, reject) => resolve(data));
	}

	static parseMetadata(entity, primaryKey, fieldlist, typelist) {
		let items = {};
		items[entity] = fieldlist;

		let sets = [entity];

		let associations = {};
		associations[entity] = [];

		let types = {};
		types[entity] = typelist;

		let prims = {};
		prims[entity] = primaryKey;

		return { items, sets, associations, types, prims };
	}

	static formatCSVdata() {
		return '';
	}
}
CSV.logging = false;

module.exports = CSV;
