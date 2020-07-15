const { Database } = require('../../controllers/controllers');

const EMAIL = 'firstnamelastname@gmail.com';
const PASSWORD = 'FirstnameLastname@1234';
const F_NAME = 'FIRSTNAME';
const L_NAME = 'LASTNAME';

const STRING = 'string';
const USER_ALREADY_EXISTS = 'userAlreadyExists';

describe('Testing user registration', () => {
	beforeEach((done) => {
		return Database.unregister(EMAIL, PASSWORD).then(() => done());
	});

	afterAll((done) => {
		return Database.unregister(EMAIL, PASSWORD).then(() => done());
	});

	test('Test registration of a new user', () => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => {
			expect(response.hasOwnProperty('apikey')).toBeTruthy();
		});
	});

	test('Test registration when the user already exists', () => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((resp) => {
			Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).catch(({ error }) => {
				expect(error).toBe(USER_ALREADY_EXISTS);
			});
		});
	});
});

describe('Testing with an existing user', () => {
	beforeAll((done) => {
		return Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => done());
	});

	afterAll((done) => {
		return Database.unregister(EMAIL, PASSWORD).then(() => done());
	});

	test('Test user authentication', () => {
		return Database.authenticate(EMAIL, PASSWORD).then((response) => {
			expect(response.email).toBe(EMAIL);
			expect(response.firstname).toBe(F_NAME);
			expect(response.lastname).toBe(L_NAME);
			expect(response.hasOwnProperty('apikey')).toBeTruthy();
		});
	});
});

afterAll((done) => {
	Database.pg_pool.end();
	done();
});

// test('Test authentication of a user', () => {
// 	return Database.unregister(EMAIL, PASSWORD).then(() => {
// 		Database.register(F_NAME, L_NAME, EMAIL, PASSWORD).then((response) => {
// 			expect(response.hasOwnProperty('apikey')).toBeTruthy();
// 		});
// 	});
// });

// beforeEach(async () => {

// 	// response = await Database.register(fname, lname, email, password);
// });

// afterEach(() => {
// 	response = await Database.unregister(email, password);
// });

// test('', async () => {
// 	expect.assertions(1);

// 	await Database.unregister(EMAIL, PASSWORD);
// 	let response = = await Database.register(F_NAME, L_NAME, EMAIL, PASSWORD); //success

// 	// response = await Database.register(F_NAME, L_NAME, EMAIL, PASSWORD); //success
// 	// const { error } = response;

// 	// expect(error).toBe(USER_ALREADY_EXISTS);

// 	// response = await Database.register(fname, lname, email, password); //user exists
// 	// console.log(response);

// 	// Database.authenticate(userName, password)
// 	//     .then((user) => done(user))
// 	//     .catch((err) => error && error(err));

// 	// response = await Database.unregister(email, password); //success
// 	// console.log(response);
// });

//attempt requests 401

//register user

//requests

//logout user

//attempt requests 401

//log in user

//logout user

//attempt requests 401

//unregister user
