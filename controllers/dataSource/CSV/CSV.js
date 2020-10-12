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
		return new Promise((resolve, reject) => {
			let data = [];

			console.log('=====================================');
			// console.log(inputdata);

			inputdata.forEach((datarow, d) => {
				let obj = {};
				fieldList.forEach((field, i) => {
					if (i < datarow.length) obj[field] = datarow[i];
					else obj[field] = null;
				});
				data.push(obj);
			});
			resolve(data);
		});
	}

	static parseMetadata(entity, primaryKey, fieldlist, typelist) {
		if (fieldlist.length > typelist.length) {
			const start = typelist.length;
			for (let i = start; i < fieldlist.length; ++i) typelist.push('string');
		} else if (fieldlist.length < typelist.length) {
			typelist = typelist.slice(0, fieldlist.length);
		}

		if (fieldlist.indexOf(primaryKey) < 0) {
			primaryKey = fieldlist[0];
		}

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
}
CSV.logging = false;

module.exports = CSV;
