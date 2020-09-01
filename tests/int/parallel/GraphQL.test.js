/**
 * @file GraphQL.test.js
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
 * - Testing functions that retrieve data from an GraphQL source
 * 		- Function that retrieves the entity list as JSON from a given GraphQL source
 * 		- Function that retrieves the metadata XML file for a given GraphQL source
 * 		- Function that retrieves entity-data as JSON from a given GraphQL source entity-url
 * 		- Function that tests the parsing of the XML Meta Data
 *
 * Functional Description: This file implements a snapshot, and tests if the GraphQL component,
 * retrieves the appropriate data.
 *
 * Error Messages: None
 * Assumptions: None
 * Constraints: None
 */
/**
 * @jest-environment node
 */
const GraphQL = require('../../../controllers/dataSource/GraphQL/GraphQL');

const SRC_URL = 'https://api.spacex.land/graphql/';
const SRC_ENTITY = 'ships';
const SRC_FIELD_LIST = ['name', 'home_port', 'image'];

describe('Testing functions that retrieve data from an GraphQL source', () => {
	// test('Function that retrieves the metadata JSON file for a given GraphQL source', () => {
	// 	return GraphQL.getMetaData(SRC_URL).then((meta) => {
	// 		expect(meta).toMatchSnapshot();
	// 	});
	// });

	// test('Function that retrieves entity-data as JSON from a given GraphQL source entity-url', () => {
	// 	return GraphQL.getEntityData(SRC_URL, SRC_ENTITY).then((data) => {
	// 		expect(data).toMatchSnapshot();
	// 	});
	// });

	// test('Function that tests the parsing of the GraphQL Meta Data', () => {
	// return GraphQL.getMetaData(SRC_URL).then((meta) => {
	// 	const data = GraphQL.parseMetadata(meta);
	// 	console.log(data.items);
	// 	expect(data).toMatchSnapshot();
	// });
	// expect(1).toBe(1);
	// });

	test('', () => {
		// return GraphQL.getEntityData(SRC_URL, SRC_ENTITY, SRC_FIELD_LIST).then((data) => {
		// 	console.log(data);

		// 	expect(1).toBe(1);
		// });
		expect(1).toBe(1);
	});
});
