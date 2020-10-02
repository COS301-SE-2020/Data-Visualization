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

	static parseMetadata(entityName, primaryKey, fieldlist, typelist) {
		let items = {};
		items[entityName] = fieldlist;

		let sets = [entityName];

		let associations = {};
		associations[entityName] = [];

		let types = {};
		types[entityName] = typelist;

		const res = { items, sets, associations, types };
		console.log(res);

		return { items, sets, associations, types };
	}

	static formatCSVdata() {
		return '';
	}
}
CSV.logging = false;

module.exports = CSV;
