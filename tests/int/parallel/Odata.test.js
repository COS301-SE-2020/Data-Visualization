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
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a snapshot, and tests if the Odata component,
 * retrieves the appropriate data.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
/**
 * @jest-environment node
 */
const Odata = require('../../../controllers/dataSource/Odata.js');

describe('Testing functions that retrieve data from an Odata source', () => {
	const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
	const entity = 'Products'; //eslint-disable-line

	test('Function that retrieves the entity list as JSON from a given Odata source', () => {
		return Odata.getEntityList(sourceUrl).then((list) => {
			expect(list).toMatchSnapshot();
		});
	});

	test('Function that retrieves the metadata XML file for a given Odata source', () => {
		return Odata.getMetaData(sourceUrl).then((xmlString) => {
			expect(xmlString).toMatchSnapshot();
		});
	});

	test('Function that retrieves entity-data as JSON from a given Odata source entity-url', () => {
		return Odata.getEntityData(sourceUrl, entity).then((data) => {
			expect(data).toMatchSnapshot();
		});
	});
});

describe('Testing functions that parses the data received from an Odata source', () => {
	const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
	const entity = 'Products';

	test('Function that retrieves the entity list as JSON from a given Odata source', () => {
		return Odata.getEntityList(sourceUrl).then((list) => {
			expect(list).toMatchSnapshot();
		});
	});

	test('Function that retrieves the metadata XML file for a given Odata source', () => {
		return Odata.getMetaData(sourceUrl).then((xmlString) => {
			expect(xmlString).toMatchSnapshot();
		});
	});

	test('Function that retrieves entity-data as JSON from a given Odata source entity-url', () => {
		return Odata.getEntityData(sourceUrl, entity).then((data) => {
			expect(data).toMatchSnapshot();
		});
	});
});
