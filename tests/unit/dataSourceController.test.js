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
 * - Testing functions that retrieve data from an Odata source
 * 		- Function that retrieves the entity list as JSON from a given Data Source
 * 		- Function that retrieves the metadata XML file for a given Data Source
 * 		- Function that retrieves entity-data as JSON from a given Data Source entity-url
 * 		- Function that tests the parsing of the XML Meta Data
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

const rewire = require('rewire');
const Odata = rewire('../../controllers/dataSource/dataSourceController.js');
const formatList = Odata.__get__('formatList');
const formatData = Odata.__get__('formatData');

const SRC_URL = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const SRC_ENTITY = 'Products';
const SRC_FIELD = 'UnitPrice';

const SRC_LIST = {
	CustomerDemographic: ['CustomerTypeID', 'CustomerDesc'],
	Customer: ['CustomerID', 'CompanyName', 'ContactName', 'ContactTitle', 'Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone', 'Fax'],
	Employee: ['EmployeeID', 'LastName', 'FirstName', 'Title', 'TitleOfCourtesy', 'BirthDate'],
	Order_Detail: ['OrderID', 'ProductID', 'UnitPrice', 'Quantity', 'Discount'], //eslint-disable-line
	Order: ['OrderID', 'CustomerID', 'EmployeeID', 'OrderDate'],
};
const SRC_LIST_EXPECTED = {
	source: 'https://services.odata.org/V2/Northwind/Northwind.svc',
	entityList: {
		CustomerDemographic: ['CustomerTypeID', 'CustomerDesc'],
		Customer: ['CustomerID', 'CompanyName', 'ContactName', 'ContactTitle', 'Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone', 'Fax'],
		Employee: ['EmployeeID', 'LastName', 'FirstName', 'Title', 'TitleOfCourtesy', 'BirthDate'],
		Order_Detail: ['OrderID', 'ProductID', 'UnitPrice', 'Quantity', 'Discount'], //eslint-disable-line
		Order: ['OrderID', 'CustomerID', 'EmployeeID', 'OrderDate'],
	},
};

const SRC_DATA = [39, 17, 13, 53, 0, 120, 15, 6, 29, 31, 22, 86, 24, 35, 39, 29, 0, 42, 25, 40];
const SRC_DATA_EXPECTED = {
	source: 'https://services.odata.org/V2/Northwind/Northwind.svc',
	entity: 'Products',
	field: 'UnitPrice',
	data: [39, 17, 13, 53, 0, 120, 15, 6, 29, 31, 22, 86, 24, 35, 39, 29, 0, 42, 25, 40],
};

describe('Testing different Data Source formatting functions', () => {
	test('Formats entity list to a standard output', () => {
		expect(formatList(SRC_URL, SRC_LIST)).toMatchObject(SRC_LIST_EXPECTED);
	});

	test('Formats entity data to a standard output', () => {
		expect(formatData(SRC_URL, SRC_ENTITY, SRC_FIELD, SRC_DATA)).toMatchObject(SRC_DATA_EXPECTED);
	});
});
