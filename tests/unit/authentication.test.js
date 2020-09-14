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

const Authentication = require('../../controllers/Authentication');

beforeAll(() => {
	Authentication.logging = false;
});

describe('Test User Authentication Process', () => {
	const APIKEY1 = 'sdlkjbgjsndgn';
	const APIKEY1_OLD = 'dfngjdsnfjgnd';
	const APIKEY2 = 'dmlgkdlkglklk';
	const APIKEY3 = 'jnnjknfjsdafj';

	const USER1 = { email: 'jan@gmail.com', name: 'Jan' };
	const USER2 = { email: 'koos@gmail.com', name: 'Koos' };
	const USER3 = { email: 'pieter@gmail.com', name: 'Pieter' };

	const LOGGED_USERS_PRUNED = {
		[APIKEY1]: USER1,
		[APIKEY2]: USER2,
		[APIKEY3]: USER3,
	};
	const LOGGED_USERS = {
		[APIKEY1]: USER1,
		[APIKEY1_OLD]: USER1,
		[APIKEY2]: USER2,
		[APIKEY3]: USER3,
	};
	const EMAIL_TO_APIKEY = {
		[USER1.email]: APIKEY1,
		[USER2.email]: APIKEY2,
		[USER3.email]: APIKEY3,
	};
	const EMPTY = {};

	test('Test Single-User authenticate and unauthenticate', () => {
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		Authentication.authenticate(APIKEY1, USER1);
		expect(Authentication.isAuthenticated(APIKEY1)).toBeTruthy();
		Authentication.unauthenticate(APIKEY1);
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
	});

	test('Test Multi-User authenticate and unauthenticate', () => {
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).not.toBeTruthy();
		Authentication.authenticate(APIKEY1, USER1);
		Authentication.authenticate(APIKEY2, USER2);
		Authentication.authenticate(APIKEY3, USER3);
		expect(Authentication.isAuthenticated(APIKEY1)).toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).toBeTruthy();
		Authentication.unauthenticate(APIKEY1);
		Authentication.unauthenticate(APIKEY2);
		Authentication.unauthenticate(APIKEY3);
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).not.toBeTruthy();
	});

	test('Test Pruning All user-Sessions', () => {
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).not.toBeTruthy();
		Authentication.authenticate(APIKEY1, USER1);
		Authentication.authenticate(APIKEY2, USER2);
		Authentication.authenticate(APIKEY3, USER3);
		expect(Authentication.isAuthenticated(APIKEY1)).toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).toBeTruthy();
		Authentication.pruneAll();
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY3)).not.toBeTruthy();
		Authentication.emailToApikey = EMAIL_TO_APIKEY;
		Authentication.loggedUsers = LOGGED_USERS_PRUNED;
		Authentication.pruneAll();
		expect(Authentication.emailToApikey).toMatchObject(EMPTY);
		expect(Authentication.loggedUsers).toMatchObject(EMPTY);
	});

	test('Test Pruning of invalid User-Sessions', () => {
		Authentication.emailToApikey = EMAIL_TO_APIKEY;
		Authentication.loggedUsers = LOGGED_USERS;
		Authentication.prune();
		expect(Authentication.emailToApikey).toMatchObject(EMAIL_TO_APIKEY);
		expect(Authentication.loggedUsers).toMatchObject(LOGGED_USERS_PRUNED);
		Authentication.pruneAll();
		Authentication.emailToApikey = {};
		Authentication.loggedUsers = LOGGED_USERS;
		Authentication.prune();
		expect(Authentication.emailToApikey).toMatchObject(EMPTY);
		expect(Authentication.loggedUsers).toMatchObject(EMPTY);
	});

	test('Getting Authenticated User info from Multiple Users', () => {
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticatedByEmail(USER1.email)).not.toBeTruthy();
		expect(Authentication.isAuthenticatedByEmail(USER2.email)).not.toBeTruthy();
		Authentication.authenticate(APIKEY1, USER1);
		Authentication.authenticate(APIKEY2, USER2);
		expect(Authentication.isAuthenticated(APIKEY1)).toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).toBeTruthy();
		expect(Authentication.retrieveUser(APIKEY1)).toMatchObject(USER1);
		expect(Authentication.retrieveUser(APIKEY2)).toMatchObject(USER2);
		expect(Authentication.getUser(USER1.email)).toMatchObject(USER1);
		expect(Authentication.getUser(USER2.email)).toMatchObject(USER2);
		expect(Authentication.isAuthenticatedByEmail(USER1.email)).toBeTruthy();
		expect(Authentication.isAuthenticatedByEmail(USER2.email)).toBeTruthy();
		Authentication.unauthenticateByEmail(USER1.email);
		Authentication.unauthenticateByEmail(USER2.email);
		expect(Authentication.isAuthenticated(APIKEY1)).not.toBeTruthy();
		expect(Authentication.isAuthenticated(APIKEY2)).not.toBeTruthy();
		expect(Authentication.isAuthenticatedByEmail(USER1.email)).not.toBeTruthy();
		expect(Authentication.isAuthenticatedByEmail(USER2.email)).not.toBeTruthy();
	});
});

describe('Test API-Key generation', () => {
	test('Test properties of generated key', () => {
		const apikey = Authentication.generateApiKey();
		expect(apikey.length).toBe(Authentication.apikeyLength);
		apikey.split('').forEach((char) => expect(Authentication.apikeyCharacters.includes(char)));
		expect(apikey).toEqual(expect.stringMatching(/^([a-zA-Z0-9_-]){20}$/));
	});

	test('Test uniqueness of generated key', () => {
		const apikey = Authentication.generateApiKey();
		let keyCounter = 0;
		Object.keys(Authentication.loggedUsers).forEach((key) => {
			if (key === apikey) keyCounter++;
		});
		expect(keyCounter).toBe(0);
	});
});

describe('Test validation Functions', () => {
	test('Test Email Validation', () => {
		const EMAIL1 = 'koos@gmail.com';
		const EMAIL2 = 'Koos@gmail.com';
		const EMAIL3 = 'koos123@gmail.com';
		const EMAIL4 = 'Koos.123@gmail.com';
		const EMAIL5 = 'kooskoekemoer@gmail.com';
		const EMAIL6 = 'Kooskoekemoer@gmail.com';
		const EMAIL7 = 'koos.koekemoer123@gmail.com';
		const EMAIL8 = 'Koos.Koekemoer123@gmail.com';
		const EMAIL9 = 'koos.koekemoer.123@gmail.com';
		const EMAIL10 = 'Koos.Koekemoer.123@gmail.com';
		const EMAIL11 = '123.Koos.Koekemoer.123@gmail.com';
		const EMAIL12 = '123.Koos.Koekemoer.123@gmail.com';
		const EMAIL_INVALID1 = '';
		const EMAIL_INVALID2 = 'kooskoekemoer';
		const EMAIL_INVALID3 = '@gmail.com';
		const EMAIL_INVALID4 = 'kooskoekemoer@';
		const EMAIL_INVALID5 = 'kooskoekemoer@gmail';
		const EMAIL_INVALID6 = 'kooskoekemoer@gmailcom';
		expect(Authentication.checkUserEmail(EMAIL1)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL2)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL3)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL4)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL5)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL6)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL7)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL8)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL9)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL10)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL11)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL12)).toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID1)).not.toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID2)).not.toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID3)).not.toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID4)).not.toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID5)).not.toBeTruthy();
		expect(Authentication.checkUserEmail(EMAIL_INVALID6)).not.toBeTruthy();
	});

	test('Test Name Validation', () => {
		const NAME1 = 'Koos';
		const NAME2 = 'Koekemoer';
		const NAME_INVALID1 = '';
		const NAME_INVALID2 = 'Koos_@$%';
		expect(Authentication.checkName(NAME1)).toBeTruthy();
		expect(Authentication.checkName(NAME2)).toBeTruthy();
		expect(Authentication.checkName(NAME_INVALID1)).not.toBeTruthy();
		expect(Authentication.checkName(NAME_INVALID2)).not.toBeTruthy();
	});

	test('Test Password Validation', () => {
		const NAME = 'Koos';
		const PASSWORD1 = 'KoosKoekemoer@301';
		const PASSWORD2 = '301@KoosKoekemoer@';
		const PASSWORD_INVALID0 = '';
		const PASSWORD_INVALID1 = 'kooskoekemoer';
		const PASSWORD_INVALID2 = 'KoosKoekemoer';
		const PASSWORD_INVALID3 = 'KoosKoekemoer301';
		const PASSWORD_INVALID4 = 'KoosKoekemoer@';
		const PASSWORD_INVALID5 = 'kooskoekemoer@301';
		expect(Authentication.checkUserPasswordLogin(PASSWORD1)).toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD2)).toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID0)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID1)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID2)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID3)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID4)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordLogin(PASSWORD_INVALID5)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD1, PASSWORD1, NAME)).toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD2, PASSWORD2, NAME)).toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD1, PASSWORD2, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD2, PASSWORD1, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD1, PASSWORD1, PASSWORD1)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD2, PASSWORD2, PASSWORD2)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID0, PASSWORD_INVALID0, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID1, PASSWORD_INVALID1, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID2, PASSWORD_INVALID2, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID3, PASSWORD_INVALID3, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID4, PASSWORD_INVALID4, NAME)).not.toBeTruthy();
		expect(Authentication.checkUserPasswordRegister(PASSWORD_INVALID5, PASSWORD_INVALID5, NAME)).not.toBeTruthy();
	});
});

afterAll(() => {
	Authentication.logging = true;
});
