/**
 * @file databaseController.test.js
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
 * Functional Description: This file implements a unit test to see if the database controller component is working properly.
 * This test executes some commands to see if the commands are executed properly, if an error does occur it will stop execution, if it
 * was successful then the test would complete and success would occur.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const rewire = require('rewire');
const database = rewire('../../controllers/database/databaseController');
const fieldUpdates = database.__get__('fieldUpdates');
const generateApiKey = database.__get__('generateApiKey');
const DBerror = database.__get__('DBerror');
const UndefinedResponseFromDBerror = database.__get__('UndefinedResponseFromDBerror');

describe('Function that converts lists of fields and data into comma seperated field=data pairs', () => {
	test('fields and data lists both have the same length', () => {
		const fields = [ 'field1', 'field2', 'field3' ];
		const data = [ 'value1', 2, true ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\',  field3 = \'true\'');
	});

	test('fields list has more items that data list', () => {
		const fields = [ 'field1', 'field2', 'field3' ];
		const data = [ 'value1', 2 ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\'');
	});

	test('fields list has less items that data list', () => {
		const fields = [ 'field1', 'field2' ];
		const data = [ 'value1', 2, true ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\'');
	});
});

test('Function that generates an api key, represented as a random alpha-numeric string of length 20', () => {
	expect(generateApiKey()).toEqual(expect.stringMatching(/^([a-zA-Z0-9_-]){20}$/));
});

describe('Function that formast an error to be displayed.', () => {
	const TABLE = 'Table Name';
	const CODE = '12345';
	const ROUTINE = 'actionAtempted';
	const HINT = 'This might be the problem';
	const DETAIL = 'More information about the problem';
	const DB = 'database';
	const EXISTS_CODE = '23505';
	const EXISTS_ROUTINE = 'userAlreadyExists';

	test('All values are given', () => {
		expect(
			DBerror({
				table: TABLE,
				code: CODE,
				routine: ROUTINE,
				hint: HINT,
				detail: DETAIL,
			})
		).toMatchObject({
			origin: DB,
			table: TABLE,
			code: CODE,
			error: ROUTINE,
			hint: HINT,
		});
	});

	test('Hint value not given', () => {
		expect(
			DBerror({
				table: TABLE,
				code: CODE,
				routine: ROUTINE,
				detail: DETAIL,
			})
		).toMatchObject({
			origin: DB,
			table: TABLE,
			code: CODE,
			error: ROUTINE,
			hint: DETAIL,
		});
	});

	test('Hint value not given', () => {
		expect(
			DBerror({
				table: TABLE,
				code: EXISTS_CODE,
				routine: ROUTINE,
				detail: DETAIL,
			})
		).toMatchObject({
			origin: DB,
			table: TABLE,
			code: EXISTS_CODE,
			error: EXISTS_ROUTINE,
			hint: DETAIL,
		});
	});
});

test('Function that returns an error object when the database\'s response is undefined', () => {
	const SQL_QUERY = 'SELECT * FROM mytable;';
	expect(UndefinedResponseFromDBerror(SQL_QUERY)).toMatchObject({
		table: undefined,
		code: undefined,
		routine: 'undefinedResponseFromDatabase',
		hint: undefined,
		detail: 'Query Sent: ' + SQL_QUERY,
	});
});
