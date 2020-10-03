/**
 * @file XML.js
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
 * Functional Description: This file implements an XML class that gets XML and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const DOMParser = require('xmldom').DOMParser;
class XML {
	static getMetaData() {
		return new Promise((resolve) => resolve());
	}

	static getEntityData(src, entity, fieldList, inputdata) {
		let data = [];
		
		try {
			
			let parser = new DOMParser();
			let xmlDoc = parser.parseFromString(inputdata, 'text/xml');
			for (let i = 0; i < fieldList.length; i++) {
				let field = xmlDoc.getElementsByTagName(fieldList[i]);
				for (let j = 0; j < field.length; j++) {
					if (!data[j]) {
						data[j] = {};
					}
					data[j][fieldList[i]] = field[j].childNodes[0].data;
				}
			}
			
		} catch (e) {
			console.log('XML File in invalid format');
		}
		
		return new Promise((resolve, reject) => resolve(data));
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
XML.logging = false;

module.exports = XML;
