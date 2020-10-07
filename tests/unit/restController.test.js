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

const stringArray = {
	data: ['Red', 'Blue', 'Red', 'Green', 'Blue', 'Red'],
};
const boolArray = {
	data: ['true', 'false', 'false', 'true', 'true', 'true'],
};
const validDate = {
	data: [['Tue Jul 16 1996', 156]],
};

describe('Testing in-class restController functions', function () {
	test('Successfully transforms string data into graph data', () => {
		let results = restController.stringsToGraphData(stringArray);

		expect(results).not.toBeNull();
		expect(results).not.toBeUndefined();
		expect(results.data).toMatchObject(expect.any(Array));
		expect(results.data[0]).toMatchObject(expect.any(Array));
	});

	test('Successfully transforms boolean data into graph data', () => {
		let results = restController.boolsToGraphData(boolArray);

		expect(results).not.toBeNull();
		expect(results).not.toBeUndefined();
		expect(results.data).toMatchObject(expect.any(Array));
		expect(results.data[0]).toMatchObject(expect.any(Array));
	});

	test('Successfully transforms dates', () => {
		let dates = { data: [['/Date(837475200000)/', 156]] };
		let result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).toMatchObject(validDate);

		dates = { data: [['1996-07-16', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).toMatchObject(validDate);

		dates = { data: [['1996/07/16', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).toMatchObject(validDate);

		dates = { data: [['Jul 16 1996', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).toMatchObject(validDate);

		dates = { data: [['16 Jul 1996', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).toMatchObject(validDate);

		dates = { data: [['Ja 28 2019', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).not.toMatchObject(validDate);

		dates = { data: [['28 2019 Ja', 156]] };
		result = restController.dateConversion(dates);
		// console.log("RESULT: ", result);
		expect(result).not.toMatchObject(validDate);
	});
});
