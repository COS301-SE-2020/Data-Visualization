const { Database } = require('../../controllers/controllers')

const EMAIL = 'firstnamelastname@gmail.com'
const PASSWORD = 'FirstnameLastname@1234'
const F_NAME = 'FIRSTNAME'
const L_NAME = 'LASTNAME'

const USER_ALREADY_EXISTS_ERROR = 'userAlreadyExists'

const DATA_SOURCE_ID = 'ASKDNFKSNDAFKNSAF'
const DATA_SOURCE_URL = 'http://data.source.url/mock/mock.cvs'

// describe('Testing user management', () => {
// 	beforeEach((done) => {
// 		return Database.unregister(EMAIL, PASSWORD).then(() => done());
// 	});

// 	afterAll((done) => {
// 		return Database.unregister(EMAIL, PASSWORD).then(() => done());
// 	});

// 	test('Test registration of a new user', () => {
// 		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => {
// 			expect(response.hasOwnProperty('apikey')).toBeTruthy();
// 		});
// 	});

// 	test('Test registration when the user already exists', () => {
// 		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((resp) => {
// 			Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).catch(({ error }) => {
// 				expect(error).toBe(USER_ALREADY_EXISTS_ERROR);
// 			});
// 		});
// 	});

// 	test('Test user authentication', () => {
// 		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then(() => {
// 			Database.authenticate(EMAIL, PASSWORD).then((response) => {
// 				expect(response.email).toBe(EMAIL);
// 				expect(response.firstname).toBe(F_NAME);
// 				expect(response.lastname).toBe(L_NAME);
// 				expect(response.hasOwnProperty('apikey')).toBeTruthy();
// 			});
// 		});
// 	});
// });

describe('Testing with an existing user', () => {
	beforeAll((done) => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => done())
	})

	afterAll((done) => {
		return Database.unregister(EMAIL, PASSWORD).then(() => done())
	})

	describe('Test data-source management', () => {
		test('List defaults to empty', () => {
			return Database.getDataSourceList(EMAIL).then((list) => {
				expect(list.length).toBe(0)
			})
		})

		test('Adding a data source', () => {
			return Database.addDataSource(EMAIL, DATA_SOURCE_ID, DATA_SOURCE_URL).then((response) => {
				Database.getDataSourceList(EMAIL).then((list) => {
					expect(list.length).toBe(1)
					expect(list[0].id).toBe(DATA_SOURCE_ID)
					expect(list[0].email).toBe(EMAIL)
					expect(list[0].sourceurl).toBe(DATA_SOURCE_URL)
				})
			})
		})

		//update list with src

		//get list with update

		//remove src

		//get list empty
	})
})

afterAll((done) => {
	Database.pg_pool.end()
	done()
})
