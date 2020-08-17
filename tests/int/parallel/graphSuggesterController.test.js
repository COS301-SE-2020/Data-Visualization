/**
 * @file graphSuggesterController.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 07/08/2020   Marco Lombaard     Original
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
require('../../../controllers/graphSuggester/graphSuggesterAI/graphSuggesterAI');
const graphSuggesterController = require('../../../controllers/graphSuggester/graphSuggesterController/graphSuggesterController');
	
const fitnessChart = {
	'title': {
		'text': 'Orders_Qry:Country'
	},
	'dataset': {
		'source': [
			[
				'OrderID',
				'value'
			],
			[
				10383,
				'UK'
			],
			[
				10453,
				'UK'
			],
			[
				10501,
				'Germany'
			],
			[
				10509,
				'Germany'
			],
			[
				10801,
				'Spain'
			],
			[
				10970,
				'Spain'
			],
			
			[
				10932,
				'France'
			],
			[
				10940,
				'France'
			],
			[
				11076,
				'France'
			],
			[
				10389,
				'Canada'
			],
			[
				10410,
				'Canada'
			],
			[
				10411,
				'Canada'
			],
			[
				10431,
				'Canada'
			],
		]
	},
	'xAxis': {
		'type': 'category'
	},
	'yAxis': {},
	'series': [
		{
			'type': 'pie',
			'radius': '60%',
			'label': {
				'formatter': '{b}: {@value} ({d}%)'
			},
			'encode': {
				'itemName': 'OrderID',
				'value': 'value'
			}
		}
	]
};

const items = {
	'Product': [ 'ProductID', 'ProductName', 'SupplierID', 'CategoryID', 'QuantityPerUnit',
		'UnitPrice', 'UnitsInStock', 'UnitsOnOrder', 'ReorderLevel', 'Discontinued' ],
};

const associations = {
	'Product': [ 'Category', 'Order_Details', 'Supplier' ],
};

const types = {
	'Product': [ 'int', 'string', 'int', 'int', 'int',
		'int', 'int', 'int', 'int', 'bool' ],
};

const sets = [
	'Products',
];

const suggestion =
{
	title: { text: expect.any(String) },
	dataset: { source: expect.any(Array) },
	xAxis: { type: 'category' },
	yAxis: {},
	series: [{ type: expect.any(String), encode: expect.any(Object) }],
};

describe('Testing functions in the graphSuggesterController class that call functions in the suggester class', function () {
	test('Returns a null suggestion on null call to getSuggestion', () => {
		expect(graphSuggesterController.getSuggestions(null)).toBeNull();
	});

	test('Returns a suggestion on call to getSuggestion', () => {
		graphSuggesterController.setMetadata('url', { items, associations, types, sets });
		expect(graphSuggesterController.getSuggestions('Product', 'url')).toMatchObject(suggestion);
	});

	test('Returns true when setting fitness chart', () => {
		expect(graphSuggesterController.setFittestEChart(fitnessChart)).toBe(true);
	});

	test('Successfully limits fields', () => {
		expect(graphSuggesterController.limitFields([])).toBeUndefined();
	});

	test('Successfully limits entities', () => {
		graphSuggesterController.setMetadata('url', { items, associations, types, sets });
		expect(graphSuggesterController.getSuggestions('Red', 'url')).toBeNull();
		graphSuggesterController.limitEntities([{ entityname:'Product', datasource:'url' }]);
		expect(graphSuggesterController.getSuggestions('Red', 'url')).toBeNull();
		expect(graphSuggesterController.getSuggestions('Product', 'url')).toMatchObject(suggestion);
	});

	test('Successfully selects an entity from filtered entities', () => {
		graphSuggesterController.setMetadata('url', { items, associations, types, sets });

		let choice = graphSuggesterController.selectEntity();
		let object = { 'datasource':'url', 'entityname':'Product', 'entityset':'Products' };

		expect(choice).toMatchObject(object);
		graphSuggesterController.limitEntities([{ entityname:'Product', datasource:'url' }]);
		expect(graphSuggesterController.selectEntity()).toMatchObject(object);
	});

});