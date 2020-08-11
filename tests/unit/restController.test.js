/**
 * @file restController.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 11/08/2020   Marco Lombaard     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements unit tests to see if the functions in the rest controller work properly.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const restController = require('../../controllers/rest/restController');

const stringArray = [
	'Red', 'Blue', 'Red', 'Green', 'Blue', 'Red'
];
describe('Testing in-class functions', function () {
	test('Successfully transforms string data into graph data', () => {
		let results = restController.stringsToGraphData(stringArray);
		expect(results['Red']).toEqual(3);
		expect(results['Blue']).toEqual(2);
		expect(results['Green']).toEqual(1);
	});
});