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
 * 06/08/2020   Marco Lombaard     Fixed erroneous test input 'option'
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a unit test to see if the graph suggester controller component is working properly.
 * This file calls a few functions in the controller component to test their functionality
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

const graphSuggesterAI = require('../../controllers/graphSuggester/graphSuggesterAI/graphSuggesterAI').getInstance();

const metadata = {
	'Product': [
		'ProductID',
		'ProductName',
		'SupplierID',
		'CategoryID',
		'QuantityPerUnit',
		'UnitPrice',
		'UnitsInStock',
		'UnitsOnOrder',
		'ReorderLevel',
		'Discontinued',
	],
};

const option = [ 'QuantityPerUnit',
	'UnitPrice', 'UnitsInStock', 'UnitsOnOrder', 'ReorderLevel', 'Discontinued' ];

const items = {
	'Product': [ 'ProductID', 'ProductName', 'SupplierID', 'CategoryID', 'QuantityPerUnit',
		'UnitPrice', 'UnitsInStock', 'UnitsOnOrder', 'ReorderLevel', 'Discontinued' ]
};

const associations = {
	'Product': [ 'Category', 'Order_Details', 'Supplier' ],
};

const types = {
	'Product': [ 'int', 'string', 'int', 'int', 'int',
		'float', 'int', 'int', 'int', 'bool' ],
};

describe('Testing functions within the graphSuggesterAI class', function () {
	test('Returns true to a field that is included', () => {
		expect(graphSuggesterAI.accepted('yes')).toBe(true);
	});

	test('Excludes field and returns true when checked if it is included', () => {
		graphSuggesterAI.setFields([ 'red' ]);
		expect(graphSuggesterAI.accepted('red')).toBe(true);
		graphSuggesterAI.setFields([]);
	});

	test('Generates a null suggestion on null input', () => {
		expect(graphSuggesterAI.getSuggestions(null)).toBeNull();
	});

	test('Generates a null suggestion when no metadata exists yet', () => {
		expect(graphSuggesterAI.getSuggestions('Product')).toBeNull();
	});

	test('Successfully sets metadata', () => {
		graphSuggesterAI.setMetadata(items, associations, types);
		expect(graphSuggesterAI.terminals).toMatchObject(metadata);
	});

	test('Genetic algorithm returns null on null data', () => {
		graphSuggesterAI.setMetadata(items, associations, types);
		expect(graphSuggesterAI.geneticAlgorithm(null, null)).toBeNull();
	});

	test('Genetic algorithm returns suggestion', () => {
		graphSuggesterAI.setMetadata(items, associations, types);
		let suggestion = graphSuggesterAI.geneticAlgorithm(option, types);
		expect(suggestion).toHaveLength(3);
		expect(suggestion[2]).toBe(types[suggestion[0]]);	//type must match the type of the selected field
	});

	test('Generates a suggestion when receiving valid data and metadata exists', () => {
		graphSuggesterAI.setMetadata(items, associations, types);
		let suggestion = graphSuggesterAI.getSuggestions('Product');
		expect(suggestion).toMatchObject([ expect.any(String), expect.any(String), expect.any(String), expect.any(String) ]);
	});
});