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

describe('Testing functions that retrieve data from an Odata source', () => {
	const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
	const entity = 'Products';

	test('Function that retrieves the entity list as JSON from a given Data Source', () => {
		return DataSource.getEntityList(sourceUrl).then((list) => {
			expect(list).toMatchSnapshot();
		});
	});

	test('Function that retrieves the metadata XML file for a given Odata source', () => {
		return DataSource.getMetaData(sourceUrl).then((xmlString) => {
			expect(xmlString).toMatchSnapshot();
		});
	});

	test('Function that retrieves entity-data as JSON from a given Odata source entity-url', () => {
		return DataSource.getEntityData(sourceUrl, entity).then((data) => {
			expect(data).toMatchSnapshot();
		});
	});
});
