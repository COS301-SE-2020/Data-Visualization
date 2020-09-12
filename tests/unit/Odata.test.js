/**
 * @file Odata.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 16/07/2020   Phillip Schulze     Original
 * 22/07/2020   Phillip Schulze     Final
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a unit test to see if the Odata component is working properly.
 * This test executes some commands to see if the commands are executed properly, if an error does occur it will stop execution, if it
 * was successful then the test would complete and success would occur.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

const Odata = require('../../controllers/dataSource/Odata');

const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const entity = 'Products';
const sourceUrlJson = 'https://services.odata.org/V2/Northwind/Northwind.svc/?$format=json';
const sourceUrlEntity = 'https://services.odata.org/V2/Northwind/Northwind.svc/Products/?$format=json';
const sourceUrlMetaData = 'https://services.odata.org/V2/Northwind/Northwind.svc/$metadata';

describe('Testing different Odata url formatting functions', () => {
	test('Converts the Odata url to output JSON instead of XML', () => {
		expect(Odata.format(sourceUrl)).toBe(sourceUrlJson);
	});

	test('converts the Odata and entity to entity-url that outputs JSON instead of XML', () => {
		expect(Odata.formatEntity(sourceUrl, entity)).toBe(sourceUrlEntity);
	});

	test('converts the Odata url to odata-metada url', () => {
		expect(Odata.formatMetaData(sourceUrl)).toBe(sourceUrlMetaData);
	});
});
