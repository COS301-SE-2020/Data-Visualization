/**
 * @file graphSuggesterAI.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 06/08/2020   Marco Lombaard     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a unit test to see if the graph suggester component is working properly.
 * This file calls a few functions in the suggester component to test their functionality
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
require('../../controllers/graphSuggester/graphSuggesterAI/graphSuggesterAI');
const graphSuggesterController = require('../../controllers/graphSuggester/graphSuggesterController/graphSuggesterController');

describe('Testing functions in the graphSuggesterController class', function () {
	test('Returns a suggestion on call to getSuggestion', () => {
		expect(graphSuggesterController.getSuggestions(null)).toBeNull();
	});

	test('Returns true when setting fitness chart to null', () => {
		expect(graphSuggesterController.setFittestEChart(null)).toBe(true);
	});

	test('returns null when null data is passed for parsing', () => {
		expect(graphSuggesterController.parseODataMetadata(null)).toBeNull();
	});
});