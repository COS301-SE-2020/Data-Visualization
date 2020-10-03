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

		return new Promise((resolve, reject) => {
			try {
				let parser = new DOMParser();
				let xmlDoc = parser.parseFromString(inputdata, 'text/xml');
				let parents;

				if (fieldList.length > 0) {
					parents = xmlDoc.getElementsByTagName(xmlDoc.getElementsByTagName(fieldList[0])[0].parentNode.tagName);

					if (!parents || parents.length === 0) {

						let count = 0;
						let children = xmlDoc.childNodes;

						data[0] = {};
						for (let i = 0; i < fieldList.length; i++) {
							data[0][fieldList[i]] = null;
						}
						for (let i = 0; i < children.length; i++) {
							if (data[count][children[i].tagName]) {
								count++;
								data[count] = {};
								for (let j = 0; j < fieldList.length; j++) {
									data[count][fieldList[j]] = null;
								}
							}
							if (fieldList.indexOf(children[i].tagName) >= 0) {
								data[count][children[i].tagName] = children[i].childNodes[0].data;
							}
						}

					} else {
						for (let i = 0; i < parents.length; i++) {
							let children = parents[i].childNodes;
							data[i] = {};
							for (let j = 0; j < fieldList.length; j++) {
								data[i][fieldList[j]] = null;
							}

							for (let j = 0; j < children.length; j++) {
								if (fieldList.indexOf(children[j].tagName) >= 0) {
									data[i][children[j].tagName] = children[j].childNodes[0].data;
								}
							}
						}
					}
				}
				//console.log(data);
				resolve(data);
			} catch(e) {
				console.log('XML File in invalid format');
				//console.log(e);
				reject({
					title: 'Invalid XML',
					description: 'XML File in invalid format'
				});
			}
		});
		
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
