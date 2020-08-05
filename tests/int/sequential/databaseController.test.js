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
 * Functional Description: This file implements a integration test to see if the database controller component is working how it should
 * This test executes some commands to see if the subsystems work together properly.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

/**
 * @jest-environment node
 */
const { Database } = require('../../../controllers/controllers');

const EMAIL = 'firstnamelastname@gmail.com';
const PASSWORD = 'FirstnameLastname@1234';
const F_NAME = 'FIRSTNAME';
const L_NAME = 'LASTNAME';

const USER_ALREADY_EXISTS_ERROR = 'userAlreadyExists';
const ITEM_ALREADY_EXISTS_ERROR = 'userAlreadyExists';

const DATA_SOURCE_URL = 'http://data.source.url/mock/mock.cvs';

const DASHBOARD_NAME = 'Dashboard Name';
const DASHBOARD_DESC = 'Dashboard Description';

const DASHBOARD_NEW_NAME = 'New Dashboard Name';
const DASHBOARD_NEW_DESC = 'New Dashboard Description';
const DASHBOARD_FIELDS = ['name', 'description'];
const DASHBOARD_DATA = [DASHBOARD_NEW_NAME, DASHBOARD_NEW_DESC];

const GRAPH_TITLE = 'Graph Title';
const GRAPH_OPTIONS = { data: [1, 2, 3, 4], x: 'dependent', y: 'independent' };
const GRAPH_META = { w: 100, h: 200, x: 10, y: 20 };

const GRAPH_NEW_TITLE = 'New Graph Title';
const GRAPH_NEW_OPTIONS = { data: [1, 2, 3], x: 'x-axis', y: 'y-axis' };
const GRAPH_NEW_META = { w: 150, h: 150, x: 20, y: 50 };
const GRAPH_FIELDS = ['title', 'options', 'metadata'];
const GRAPH_DATA = [GRAPH_NEW_TITLE, GRAPH_NEW_OPTIONS, GRAPH_NEW_META];

beforeAll((done) => {
	return Database.deregister(EMAIL, PASSWORD).finally(() => done());
});

describe('Testing user management', () => {
	beforeAll((done) => {
		return Database.deregister(EMAIL, PASSWORD).finally(() => done());
	});

	afterAll((done) => {
		return Database.deregister(EMAIL, PASSWORD).finally(() => done());
	});

	test('Test registration of a new user', () => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => {
			expect(response.email).toBe(EMAIL);
			expect(response.firstname).toBe(F_NAME);
			expect(response.lastname).toBe(L_NAME);
			expect(response).toHaveProperty('apikey');
		});
	});

	test('Test registration when the user already exists', () => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).catch(({ error }) => {
			expect(error).toBe(USER_ALREADY_EXISTS_ERROR);
		});
	});

	test('Test user authentication', () => {
		return Database.authenticate(EMAIL, PASSWORD).then((response) => {
			expect(response.email).toBe(EMAIL);
			expect(response.firstname).toBe(F_NAME);
			expect(response.lastname).toBe(L_NAME);
			expect(response).toHaveProperty('apikey');
		});
	});
});

describe('Testing with an existing user', () => {
	beforeAll((done) => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).finally(() => done());
	});

	afterAll((done) => {
		return Database.deregister(EMAIL, PASSWORD).finally(() => done());
	});

	describe('Test data source management', () => {
		let DATA_SOURCE_ID = -1;

		test('data source list defaults to empty', () => {
			return Database.getDataSourceList(EMAIL).then((list) => {
				expect(list.length).toBe(0);
			});
		});

		test('Adding a data source', () => {
			return Database.addDataSource(EMAIL, DATA_SOURCE_URL).then((response) => {
				DATA_SOURCE_ID = response.id;
				expect(response.email).toBe(EMAIL);
				expect(response.sourceurl).toBe(DATA_SOURCE_URL);
			});
		});

		test('Removing a data source', () => {
			return Database.removeDataSource(EMAIL, DATA_SOURCE_ID).then((response) => {
				Database.getDataSourceList(EMAIL).then((list) => {
					DATA_SOURCE_ID = -1;
					expect(list.length).toBe(0);
				});
			});
		});
	});

	describe('Test dashboard management', () => {
		let DASHBOARD_ID = -1;

		test('dashboard list defaults to empty', () => {
			return Database.getDashboardList(EMAIL).then((list) => {
				expect(list.length).toBe(0);
			});
		});

		test('Adding a dashboard', () => {
			return Database.addDashboard(EMAIL, DASHBOARD_NAME, DASHBOARD_DESC).then((response) => {
				DASHBOARD_ID = response.id;
				expect(response.email).toBe(EMAIL);
				expect(response.name).toBe(DASHBOARD_NAME);
				expect(response.description).toBe(DASHBOARD_DESC);
			});
		});

		test('Updating a dashboard', () => {
			return Database.updateDashboard(EMAIL, DASHBOARD_ID, DASHBOARD_FIELDS, DASHBOARD_DATA).then((response) => {
				Database.getDashboardList(EMAIL).then((list) => {
					expect(list.length).toBe(1);
					expect(list[0].id).toBe(DASHBOARD_ID);
					expect(list[0].email).toBe(EMAIL);
					expect(list[0].name).toBe(DASHBOARD_NEW_NAME);
					expect(list[0].description).toBe(DASHBOARD_NEW_DESC);
				});
			});
		});

		test('Removing a dashboard', () => {
			return Database.removeDashboard(EMAIL, DASHBOARD_ID).then((response) => {
				Database.getDashboardList(EMAIL).then((list) => {
					DASHBOARD_ID = -1;
					expect(list.length).toBe(0);
				});
			});
		});
	});

	describe('Test graph management', () => {
		let DASHBOARD_ID = -1;
		let GRAPH_ID = -1;

		beforeAll((done) => {
			return Database.addDashboard(EMAIL, DASHBOARD_NAME, DASHBOARD_DESC)
				.then((response) => {
					DASHBOARD_ID = response.id;
				})
				.finally(() => done());
		});

		afterAll((done) => {
			return Database.removeDashboard(EMAIL, DASHBOARD_ID)
				.then((response) => {
					DASHBOARD_ID = -1;
				})
				.finally(() => done());
		});

		test('graph list defaults to empty', () => {
			return Database.getGraphList(EMAIL, DASHBOARD_ID).then((list) => {
				expect(list.length).toBe(0);
			});
		});

		test('Adding a graph', () => {
			return Database.addGraph(EMAIL, DASHBOARD_ID, GRAPH_TITLE, GRAPH_OPTIONS, GRAPH_META)
				.then((response) => {
					// console.log(response);
					GRAPH_ID = response.id;
					expect(response.dashboardid).toBe(DASHBOARD_ID);
					expect(response.title).toBe(GRAPH_TITLE);
					expect(response.metadata).toMatchObject(GRAPH_META);
					expect(response.options).toMatchObject(GRAPH_OPTIONS);
				})
				.catch((err) => console.log(err));
		});

		test('Updating a graph', () => {
			return Database.updateGraph(EMAIL, DASHBOARD_ID, GRAPH_ID, GRAPH_FIELDS, GRAPH_DATA).then((response) => {
				Database.getGraphList(EMAIL, DASHBOARD_ID).then((list) => {
					expect(list.length).toBe(1);
					expect(list[0].id).toBe(GRAPH_ID);
					expect(list[0].dashboardid).toBe(DASHBOARD_ID);
					expect(list[0].title).toBe(GRAPH_NEW_TITLE);
					expect(list[0].metadata).toMatchObject(GRAPH_NEW_META);
					expect(list[0].options).toMatchObject(GRAPH_NEW_OPTIONS);
				});
			});
		});

		test('Removing a graph', () => {
			return Database.removeGraph(EMAIL, DASHBOARD_ID, GRAPH_ID).then((response) => {
				Database.getGraphList(EMAIL, DASHBOARD_ID).then((list) => {
					GRAPH_ID = -1;
					expect(list.length).toBe(0);
				});
			});
		});
	});
});

afterAll((done) => {
	return Database.deregister(EMAIL, PASSWORD).finally(() => {
		Database.pgPool.end().finally(() => done());
	});
});
