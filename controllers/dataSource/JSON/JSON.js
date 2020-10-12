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
 * 03/10/2020    Elna Pistorius		 Added test cases
 *
 * Test Cases: none
 *
 * Functional Description: This file implements an JSON class that gets JSON and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

//Field list == type list length => object.keys
// if a item is not one of those then fill with null
class JSON {
	static getMetaData() {
		return new Promise((resolve) => resolve());
	}

	static getEntityData(src, entity, fieldList, inputData) {
		let data = [];
		for (let value of Object.values(inputData)) {
			let obj = {};
			if (fieldList.length !== Object.keys(value).length) {
				for (let i = 0; i < fieldList.length; i++) {
					obj = value;
					if (!(Object.keys(value).indexOf(fieldList[i]) > -1)) {
						obj[fieldList[i]] = 'null';
					}
				}
			} else {
				obj = value;
			}
			data.push(obj);
		}
		// for (let value of Object.values(data)) {
		// 	console.log(value);
		// }
		return new Promise((resolve, reject) => resolve(inputData));
	}

	static parseMetadata(entity, primaryKey, fieldList, typeList) {
		if (fieldList.length > typeList.length) {
			const index = typeList.length;
			for (let i = index; i < fieldList.length; ++i) {
				typeList.push('string');
			}
		} else if (fieldList.length < typeList.length) {
			typeList = typeList.slice(0, fieldList.length);
		}
		let items = {};
		items[entity] = fieldList;

		let sets = [entity];

		let associations = {};
		associations[entity] = [];

		let types = {};
		types[entity] = typeList;

		let prims = {};
		if (!primaryKey) {
			prims[entity] = fieldList[0];
		} else {
			prims[entity] = primaryKey;
		}

		return { items, sets, associations, types, prims };
	}
}
JSON.logging = false;

module.exports = JSON;
