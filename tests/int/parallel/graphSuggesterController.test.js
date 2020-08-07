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
const jsonData = {

	'results': [

		{

			'__metadata': {

				'uri': 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)', 'type': 'NorthwindModel.Product'

			},
			'ProductID': 1,
			'ProductName': 'Chai',
			'SupplierID': 1,
			'CategoryID': 1,
			'QuantityPerUnit': '10 boxes x 20 bags',
			'UnitPrice': '18.0000',
			'UnitsInStock': 39,
			'UnitsOnOrder': 0,
			'ReorderLevel': 10,
			'Discontinued': false,
			'Category': {

				'__deferred': {

					'uri': 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)/Category'

				}

			}, 'Order_Details': {

				'__deferred': {

					'uri': 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)/Order_Details'

				}

			}, 'Supplier': {

				'__deferred': {

					'uri': 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)/Supplier'

				}

			}

		}
	]
};
const metadata =
'<EntityType Name="Product">'+
	'<Key>'+
		'<PropertyRef Name="ProductID"/>'+
	'</Key>'+
	'<Property Name="ProductID" Type="Edm.Int32" Nullable="false" p8:StoreGeneratedPattern="Identity"/>'+
	'<Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" Unicode="true" FixedLength="false"/>'+
	'<Property Name="SupplierID" Type="Edm.Int32" Nullable="true"/>'+
	'<Property Name="CategoryID" Type="Edm.Int32" Nullable="true"/>'+
	'<Property Name="QuantityPerUnit" Type="Edm.String" Nullable="true" MaxLength="20" Unicode="true" FixedLength="false"/>'+
	'<Property Name="UnitPrice" Type="Edm.Decimal" Nullable="true" Precision="19" Scale="4"/>'+
	'<Property Name="UnitsInStock" Type="Edm.Int16" Nullable="true"/>'+
	'<Property Name="UnitsOnOrder" Type="Edm.Int16" Nullable="true"/>'+
	'<Property Name="ReorderLevel" Type="Edm.Int16" Nullable="true"/>'+
	'<Property Name="Discontinued" Type="Edm.Boolean" Nullable="false"/>'+
	'<NavigationProperty Name="Category" Relationship="NorthwindModel.FK_Products_Categories" FromRole="Products" ToRole="Categories"/>'+
	'<NavigationProperty Name="Order_Details" Relationship="NorthwindModel.FK_Order_Details_Products" FromRole="Products" ToRole="Order_Details"/>'+
	'<NavigationProperty Name="Supplier" Relationship="NorthwindModel.FK_Products_Suppliers" FromRole="Products" ToRole="Suppliers"/>'+
'</EntityType>';

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

describe('Testing functions in the graphSuggesterController class that call functions in the suggester class', function () {
	test('Returns a null suggestion on null call to getSuggestion', () => {
		expect(graphSuggesterController.getSuggestions(null)).toBeNull();
	});

	test('Successfully parses and sets metadata', () => {
		const associations = expect.any(Array);
		const items = expect.any(Array);
		const sets = expect.any(Array);
		const types = expect.any(Array);
		//eslint-disable-next-line
		expect(graphSuggesterController.parseODataMetadata(metadata)).toMatchObject({ "associations":associations, "items":items, "sets":sets, "types":types });
	});

	test('Returns a suggestion on call to getSuggestion', () => {
		graphSuggesterController.parseODataMetadata(metadata);
		expect(graphSuggesterController.getSuggestions(jsonData)).not.toBeNull();
	});

	test('Returns true when setting fitness chart', () => {
		expect(graphSuggesterController.setFittestEChart(fitnessChart)).toBe(true);
	});

	test('Returns null when null data is passed for parsing', () => {
		expect(graphSuggesterController.parseODataMetadata(null)).toBeNull();
	});

	test('Successfully limits fields', () => {
		expect(graphSuggesterController.limitFields(null)).toBeUndefined();
	});

});