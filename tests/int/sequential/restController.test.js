/**
 * @file restController.test.js
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
 * Functional Description: This file implements a integration test to see if the rest controller is working properly
 * with the other components. This test executes some commands to see if the subsystems work together properly.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
/**
 * @jest-environment node
 */
const { Rest, Database } = require('../../../controllers/controllers');

const EMAIL = 'firstnamelastname@gmail.com';
const PASSWORD = 'FirstnameLastname@1234';
const F_NAME = 'FIRSTNAME';
const L_NAME = 'LASTNAME';

const USER_ALREADY_EXISTS_ERROR = 'userAlreadyExists';
const ITEM_ALREADY_EXISTS_ERROR = 'userAlreadyExists';

const DATA_SOURCE_ID = 'ASKDNFKSNDAFKNSAF';
const DATA_SOURCE_URL = 'http://data.source.url/mock/mock.cvs';

const DASHBOARD_ID = 'ksbfnlsadnflnsa';
const DASHBOARD_NAME = 'Dashboard Name';
const DASHBOARD_DESC = 'Dashboard Description';

const DASHBOARD_NEW_NAME = 'New Dashboard Name';
const DASHBOARD_NEW_DESC = 'New Dashboard Description';
const DASHBOARD_FIELDS = [ 'name', 'description' ];
const DASHBOARD_DATA = [ DASHBOARD_NEW_NAME, DASHBOARD_NEW_DESC ];

const GRAPH_ID = 'slajkbfhsbajf';
const GRAPH_TITLE = 'Graph Title';
const GRAPH_OPTIONS = { data: [ 1, 2, 3, 4 ], x: 'dependent', y: 'independent' };
const GRAPH_META = { w: 100, h: 200, x: 10, y: 20 };

const GRAPH_NEW_TITLE = 'New Graph Title';
const GRAPH_NEW_OPTIONS = { data: [ 1, 2, 3 ], x: 'x-axis', y: 'y-axis' };
const GRAPH_NEW_META = { w: 150, h: 150, x: 20, y: 50 };
const GRAPH_FIELDS = [ 'title', 'options', 'metadata' ];
const GRAPH_DATA = [ GRAPH_NEW_TITLE, GRAPH_NEW_OPTIONS, GRAPH_NEW_META ];

describe('Testing user management', () => {
	beforeEach((done) => {
		return Rest.deregisterUser(
			EMAIL,
			PASSWORD,
			() => done(),
			() => done()
		);
	});

	afterAll((done) => {
		return Rest.deregisterUser(
			EMAIL,
			PASSWORD,
			() => done(),
			() => done()
		);
	});

	test('Test registration of a new user', () => {
		return Rest.registerUser(
			F_NAME,
			L_NAME,
			EMAIL,
			PASSWORD,
			(user) => expect(user).toHaveProperty('apikey'),
			() => {}
		);
	});

	test('Test registration when the user already exists', () => {
		return Rest.registerUser(
			F_NAME,
			L_NAME,
			EMAIL,
			PASSWORD,
			(user) => {
				return Rest.registerUser(
					F_NAME,
					L_NAME,
					EMAIL,
					PASSWORD,
					(user) => {},
					({ error }) => expect(error).toBe(USER_ALREADY_EXISTS_ERROR)
				);
			},
			() => {}
		);
	});

	test('Test user authentication', () => {
		return Rest.registerUser(
			F_NAME,
			L_NAME,
			EMAIL,
			PASSWORD,
			(user) => {
				return Rest.loginUser(
					EMAIL,
					PASSWORD,
					(user) => {
						expect(user.email).toBe(EMAIL);
						expect(user.firstname).toBe(F_NAME);
						expect(user.lastname).toBe(L_NAME);
						expect(user).toHaveProperty('apikey');
					},
					(err) => {}
				);
			},
			() => {}
		);
	});
});

describe('Testing with an existing user', () => {
	beforeAll((done) => {
		return Rest.registerUser(
			F_NAME,
			L_NAME,
			EMAIL,
			PASSWORD,
			() => done(),
			() => done()
		);
	});

	afterAll((done) => {
		return Rest.deregisterUser(
			EMAIL,
			PASSWORD,
			() => done(),
			() => done()
		);
	});

	describe('Test data source management', () => {
		test('data source list defaults to empty', () => {
			return Rest.getDataSourceList(
				EMAIL,
				(list) => expect(list.length).toBe(0),
				(err) => {}
			);
		});

		test('Adding a data source', () => {
			return Rest.addDataSource(
				EMAIL,
				DATA_SOURCE_ID,
				DATA_SOURCE_URL,
				() => {
					return Rest.getDataSourceList(
						EMAIL,
						(list) => {
							expect(list.length).toBe(1);
							expect(list[0].id).toBe(DATA_SOURCE_ID);
							expect(list[0].email).toBe(EMAIL);
							expect(list[0].sourceurl).toBe(DATA_SOURCE_URL);
						},
						() => {}
					);
				},
				() => {}
			);
		});

		test('Adding a data source that a user already has', () => {
			return Rest.addDataSource(
				EMAIL,
				DATA_SOURCE_ID,
				DATA_SOURCE_URL,
				() => {},
				({ error }) => {
					expect(error).toBe(ITEM_ALREADY_EXISTS_ERROR);
				}
			);
		});

		test('Removing a data source', () => {
			return Rest.removeDataSource(
				EMAIL,
				DATA_SOURCE_ID,
				() => {
					return Rest.getDataSourceList(
						EMAIL,
						(list) => expect(list.length).toBe(0),
						() => {}
					);
				},
				() => {}
			);
		});
	});

	describe('Test dashboard management', () => {
		test('dashboard list defaults to empty', () => {
			return Rest.getDashboardList(
				EMAIL,
				(list) => expect(list.length).toBe(0),
				() => {}
			);
		});

		test('Adding a dashboard', () => {
			return Rest.addDashboard(
				EMAIL,
				DASHBOARD_ID,
				DASHBOARD_NAME,
				DASHBOARD_DESC,
				() => {
					return Rest.getDashboardList(
						EMAIL,
						(list) => {
							expect(list.length).toBe(1);
							expect(list[0].id).toBe(DASHBOARD_ID);
							expect(list[0].email).toBe(EMAIL);
							expect(list[0].name).toBe(DASHBOARD_NAME);
							expect(list[0].description).toBe(DASHBOARD_DESC);
						},
						() => {}
					);
				},
				() => {}
			);
		});

		test('Adding a dashboard that a user already has', () => {
			return Rest.addDashboard(
				EMAIL,
				DASHBOARD_ID,
				DASHBOARD_NAME,
				DASHBOARD_DESC,
				() => {},
				({ error }) => expect(error).toBe(ITEM_ALREADY_EXISTS_ERROR)
			);
		});

		test('Updating a dashboard', () => {
			return Rest.updateDashboard(
				EMAIL,
				DASHBOARD_ID,
				DASHBOARD_FIELDS,
				DASHBOARD_DATA,
				() => {
					Rest.getDashboardList(
						EMAIL,
						(list) => {
							expect(list.length).toBe(1);
							expect(list[0].id).toBe(DASHBOARD_ID);
							expect(list[0].email).toBe(EMAIL);
							expect(list[0].name).toBe(DASHBOARD_NEW_NAME);
							expect(list[0].description).toBe(DASHBOARD_NEW_DESC);
						},
						() => {}
					);
				},
				() => {}
			);
		});

		test('Removing a dashboard', () => {
			return Rest.removeDashboard(
				EMAIL,
				DASHBOARD_ID,
				() => {
					return Rest.getDashboardList(
						EMAIL,
						(list) => expect(list.length).toBe(0),
						() => {}
					);
				},
				() => {}
			);
		});
	});

	describe('Test graph management', () => {
		beforeAll((done) => {
			return Rest.addDashboard(
				EMAIL,
				DASHBOARD_ID,
				DASHBOARD_NAME,
				DASHBOARD_DESC,
				() => done(),
				() => done()
			);
		});

		afterAll((done) => {
			return Rest.removeDashboard(
				EMAIL,
				DASHBOARD_ID,
				() => done(),
				() => done()
			);
		});

		test('graph list defaults to empty', () => {
			return Rest.getGraphList(
				EMAIL,
				DASHBOARD_ID,
				(list) => expect(list.length).toBe(0),
				() => {}
			);
		});

		test('Adding a graph', () => {
			return Rest.addGraph(
				EMAIL,
				DASHBOARD_ID,
				GRAPH_ID,
				GRAPH_TITLE,
				GRAPH_OPTIONS,
				GRAPH_META,
				() => {
					return Rest.getGraphList(
						EMAIL,
						DASHBOARD_ID,
						(list) => {
							expect(list.length).toBe(1);
							expect(list[0].id).toBe(GRAPH_ID);
							expect(list[0].dashboardid).toBe(DASHBOARD_ID);
							expect(list[0].title).toBe(GRAPH_TITLE);
							expect(list[0].metadata).toMatchObject(GRAPH_META);
							expect(list[0].options).toMatchObject(GRAPH_OPTIONS);
						},
						() => {}
					);
				},
				() => {}
			);
		});

		test('Adding a graph that a user dashbaord already has', () => {
			return Rest.addGraph(
				EMAIL,
				DASHBOARD_ID,
				GRAPH_ID,
				GRAPH_TITLE,
				GRAPH_OPTIONS,
				GRAPH_META,
				() => {},
				(err) => {
					console.log(err);
					expect(err.error).toBe(ITEM_ALREADY_EXISTS_ERROR);
				}
			);
		});

		test('Updating a graph', () => {
			return Rest.updateGraph(
				EMAIL,
				DASHBOARD_ID,
				GRAPH_ID,
				GRAPH_FIELDS,
				GRAPH_DATA,
				() => {
					Rest.getGraphList(
						EMAIL,
						DASHBOARD_ID,
						(list) => {
							expect(list.length).toBe(1);
							expect(list[0].id).toBe(GRAPH_ID);
							expect(list[0].dashboardid).toBe(DASHBOARD_ID);
							expect(list[0].title).toBe(GRAPH_NEW_TITLE);
							expect(list[0].metadata).toMatchObject(GRAPH_NEW_META);
							expect(list[0].options).toMatchObject(GRAPH_NEW_OPTIONS);
						},
						() => {}
					);
				},
				() => {}
			);
		});

		test('Removing a graph', () => {
			return Rest.removeGraph(
				EMAIL,
				DASHBOARD_ID,
				GRAPH_ID,
				() => {
					return Rest.getGraphList(
						EMAIL,
						DASHBOARD_ID,
						(list) => expect(list.length).toBe(0),
						() => {}
					);
				},
				() => {}
			);
		});
	});
});

afterAll((done) => {
	return Rest.deregisterUser(
		EMAIL,
		PASSWORD,
		() => {
			Database.pgPool
				.end()
				.then(() => done())
				.catch(() => done());
		},
		() => {
			return Database.pgPool
				.end()
				.then(() => done())
				.catch(() => done());
		}
	);
});
