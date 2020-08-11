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
const jsonData =  {
	data: [
		{

			__metadata: {

				uri: 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(21)',
				type: 'NorthwindModel.Product'

			},
			ProductID: 21,
			ProductName: 'Sir Rodney\'s Scones',
			SupplierID: 8,
			CategoryID: 3,
			QuantityPerUnit: '24 pkgs. x 4 pieces',
			UnitPrice: '10.0000',
			UnitsInStock: 3,
			UnitsOnOrder: 40,
			ReorderLevel: 5,
			Discontinued: false,
			Category: {

				__deferred: {

					uri: 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(21)/Category'

				}

			},
			// eslint-disable-next-line camelcase
			Order_Details: {

				__deferred: {

					uri: 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(21)/Order_Details'

				}

			},
			Supplier: {

				__deferred: {

					uri: 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(21)/Supplier'

				}

			}

		}
	],
};
	
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

describe('Testing functions in the graphSuggesterController class that call functions in the suggester class', function () {
	test('Returns a null suggestion on null call to getSuggestion', () => {
		expect(graphSuggesterController.getSuggestions(null)).toBeNull();
	});

	test('Returns a suggestion on call to getSuggestion', () => {
		graphSuggesterController.setMetadata({ items, associations, types });
		expect(graphSuggesterController.getSuggestions(jsonData)).not.toBeNull();
	});

	test('Returns true when setting fitness chart', () => {
		expect(graphSuggesterController.setFittestEChart(fitnessChart)).toBe(true);
	});

	test('Successfully limits fields', () => {
		expect(graphSuggesterController.limitFields(null)).toBeUndefined();
	});

});