/**
 * @file Odata.test.js
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
 * 17/08/2020   Phillip Schulze     Added a test for parsing metadata
 *
 * Test Cases: none
 * - Testing functions that retrieve data from an Odata source
 * 		- Function that retrieves the entity list as JSON from a given Odata source
 * 		- Function that retrieves the metadata XML file for a given Odata source
 * 		- Function that retrieves entity-data as JSON from a given Odata source entity-url
 * 		- Function that tests the parsing of the XML Meta Data
 *
 * Functional Description: This file implements a snapshot, and tests if the Odata component,
 * retrieves the appropriate data.
 *
 * Error Messages: None
 * Assumptions: None
 * Constraints: None
 */
/**
 * @jest-environment node
 */
const Odata = require('../../../controllers/dataSource/Odata.js');

const SRC_URL = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const SRC_ENTITY = 'Products';

describe('Testing functions that retrieve data from an Odata source', () => {
	test('Function that retrieves the entity list as JSON from a given Odata source', () => {
		return Odata.getEntityList(SRC_URL).then((list) => {
			expect(list).toMatchSnapshot();
		});
	});

	test('Function that retrieves the metadata XML file for a given Odata source', () => {
		return Odata.getMetaData(SRC_URL).then((xmlString) => {
			expect(xmlString).toMatchSnapshot();
		});
	});

	test('Function that retrieves entity-data as JSON from a given Odata source entity-url', () => {
		return Odata.getEntityData(SRC_URL, SRC_ENTITY).then((data) => {
			expect(data).toMatchSnapshot();
		});
	});

	test('Function that tests the parsing of the XML Meta Data', () => {
		return Odata.getMetaData(SRC_URL).then((meta) => {
			const data = Odata.parseODataMetadata(meta);
			expect(data).toMatchSnapshot();
		});
	});
});
