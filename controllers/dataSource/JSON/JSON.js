/**
 * @file JSON.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 02/09/2020    Marco Lombaard		 Original (2 October)
 *
 * Test Cases: none
 *
 * Functional Description: This file implements an JSON class that gets JSON and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

class JSON {
	static getMetaData() {
		return new Promise((resolve) => resolve());
	}

	static getEntityData(src, entity, fieldList, inputdata) {
		return new Promise((resolve, reject) => resolve(inputdata));
	}

	static parseMetadata(entity, primaryKey, fieldlist, typelist) {
		let items = {};
		items[entity] = fieldlist;

		let sets = [ entity ];

		let associations = {};
		associations[entity] = [];

		let types = {};
		types[entity] = typelist;

		let prims = {};
		if (!primaryKey) {
			prims[entity] = fieldlist[0];
		} else {
			prims[entity] = primaryKey;
		}

		return { items, sets, associations, types, prims };
	}
}
JSON.logging = false;

module.exports = JSON;
