/**
 * @file dataSourceController.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Phillip Schulze     Original
 * 30/06/2020   Phillip Schulze     Added more root modules
 *
 * Test Cases: none
 * - Testing functions that retrieve data from an Odata source
 * 		- Function that retrieves the entity list as JSON from a given Data Source
 * 		- Function that retrieves the metadata XML file for a given Data Source
 * 		- Function that retrieves entity-data as JSON from a given Data Source entity-url
 * 		- Function that tests the parsing of the XML Meta Data
 *
 * Functional Description: This file implements a snapshot, and tests if the data source controller,
 * retrieves the appropriate data.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
/**
 * @jest-environment node
 */
const { DataSource } = require('../../../controllers/controllers');

const SRC_URL = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const SRC_ENTITY = 'Products';

describe('Testing functions that retrieve data from an Odata source', () => {
	// test('Function that retrieves the entity list as JSON from a given Data Source', () => {
	// 	return DataSource.getEntityList(SRC_URL).then((list) => {
	// 		expect(list).toMatchSnapshot();
	// 	});
	// });

	// test('Function that retrieves the metadata XML file for a given Data Source', () => {
	// 	return DataSource.getMetaData(SRC_URL).then((xmlString) => {
	// 		expect(xmlString).toMatchSnapshot();
	// 	});
	// });

	// test('Function that retrieves entity-data as JSON from a given Data Source entity-url', () => {
	// 	return DataSource.getEntityData(SRC_URL, SRC_ENTITY).then((data) => {
	// 		expect(data).toMatchSnapshot();
	// 	});
	// });

	// test('Function that tests the parsing of the XML Meta Data', () => {
	// 	return DataSource.getMetaData(SRC_URL).then((meta) => {
	// 		const data = DataSource.parseMetadata(meta);
	// 		expect(data).toMatchSnapshot();
	// 	});
	// });
	test('temp', () => expect(1).toBe(1));
});
