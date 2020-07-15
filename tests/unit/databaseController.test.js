const rewire = require('rewire');
const database = rewire('../../controllers/database/databaseController'),

	fieldUpdates = database.__get__('fieldUpdates'),
	generateApiKey = database.__get__('generateApiKey'),
	DBerror = database.__get__('DBerror'),
	UndefinedResponseFromDBerror = database.__get__('UndefinedResponseFromDBerror');

describe('Function that converts lists of fields and data into comma seperated field=data pairs', () => {
	test('fields and data lists both have the same length', () => {
		const fields = [ 'field1', 'field2', 'field3' ],
		 data = [ 'value1', 2, true ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\',  field3 = \'true\'');
	});

	test('fields list has more items that data list', () => {
		const fields = [ 'field1', 'field2', 'field3' ],
		 data = [ 'value1', 2 ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\'');
	});

	test('fields list has less items that data list', () => {
		const fields = [ 'field1', 'field2' ],
		 data = [ 'value1', 2, true ];
		expect(fieldUpdates(fields, data)).toBe(' field1 = \'value1\',  field2 = \'2\'');
	});
});

test('Function that generates an api key, represented as a random alpha-numeric string of length 20', () => {
	expect(generateApiKey()).toEqual(expect.stringMatching(/^([a-zA-Z0-9_-]){20}$/));
});

describe('Function that formast an error to be displayed.', () => {
	const TABLE = 'Table Name',
	 CODE = '12345',
	 ROUTINE = 'actionAtempted',
	 HINT = 'This might be the problem',
	 DETAIL = 'More information about the problem',
	 DB = 'database',

	 EXISTS_CODE = '23505',
	 EXISTS_ROUTINE = 'userAlreadyExists';

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
