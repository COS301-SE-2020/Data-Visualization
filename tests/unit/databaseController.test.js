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
 * 27/08/2020 	Elna Pistorius 		Updated unit tests for DBerror
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
const DBerror = database.__get__('DBerror');
const UndefinedResponseFromDBerror = database.__get__('UndefinedResponseFromDBerror');

describe('Function that converts lists of fields and data into comma seperated field=data pairs', () => {
	test('fields and data lists both have the same length', () => {
		const fields = ['field1', 'field2', 'field3'];
		const data = ['value1', 2, true];
		const offset = 3;

		console.log();

		expect(fieldUpdates(fields, data, offset)).toBe(' field1 = $4,  field2 = $5,  field3 = $6');
	});

	test('fields list has more items that data list', () => {
		const fields = ['field1', 'field2', 'field3'];
		const data = ['value1', 2];
		const offset = 3;
		expect(fieldUpdates(fields, data, offset)).toBe(' field1 = $4,  field2 = $5');
	});

	test('fields list has less items that data list', () => {
		const fields = ['field1', 'field2'];
		const data = ['value1', 2, true];
		const offset = 1;
		expect(fieldUpdates(fields, data, offset)).toBe(' field1 = $2,  field2 = $3');
	});
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
		).toMatchObject({error: {
				origin: DB,
				table: TABLE,
				code: CODE,
				error: ROUTINE,
				hint: HINT,
			}, status: 500});
	});

	test('Hint value not given', () => {
		expect(
			DBerror({
				table: TABLE,
				code: CODE,
				routine: ROUTINE,
				detail: DETAIL,
			})
		).toMatchObject({error: {
				origin: DB,
				table: TABLE,
				code: CODE,
				error: ROUTINE,
				hint: DETAIL,
			}, status: 500});
	});

	test('Hint value not given', () => {
		expect(
			DBerror({
				table: TABLE,
				code: EXISTS_CODE,
				routine: ROUTINE,
				detail: DETAIL,
			})
		).toMatchObject({error:{
				origin: DB,
				table: TABLE,
				code: EXISTS_CODE,
				error: EXISTS_ROUTINE,
				hint: DETAIL,
			} , status: 500});
	});
});

test("Function that returns an error object when the database's response is undefined", () => {
	const SQL_QUERY = 'SELECT * FROM mytable;';
	expect(UndefinedResponseFromDBerror(SQL_QUERY)).toMatchObject({
		table: undefined,
		code: undefined,
		routine: 'undefinedResponseFromDatabase',
		hint: undefined,
		detail: 'Query Sent: ' + SQL_QUERY,
	});
});
