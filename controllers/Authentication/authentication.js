/**
 * @file  cache.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 06/08/2020   Phillip Schulze     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a cache using the singleton pattern. This cache stores data the was previously
 * requested from external data sources, and thus can be accessed in the future without making additional requests to external sources.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const { LogAuthUsers, LogAuthKeys } = require('../../helper/helper');

const AuthenticationMaker = (function () {
	let instance = null;
	/**
	 * This class handles chache data requested from external data sources.
	 * Usage Instructions: metadata, entityList and fieldList of all data sources that where accessed recently are saved here.
	 * @author Phillip Schulze
	 */
	class Authentication {
		constructor() {
			this.loggedUsers = {};
			this.emailToApikey = {};
			this.apikeyCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			this.apikeyLength = 20;
			this.maxTime = 1000 * 60 * 60 * 0.5; //ms => 30mins
			this.logging = true;
		}

		prune() {
			const users = {};
			let pruneCount = 0;

			Object.keys(this.loggedUsers)
				.filter((apikey) => {
					const email = this.loggedUsers[apikey].email;
					const testkey = this.emailToApikey[email];

					if (apikey === testkey) return true;
					else {
						pruneCount++;
						return false;
					}
				})
				.forEach((apikey) => (users[apikey] = this.loggedUsers[apikey]));

			this.loggedUsers = users;

			if (this.logging) console.log(`Pruned ${pruneCount} invalid sessions.`);
		}

		pruneAll() {
			this.emailToApikey = {};
			this.prune();
		}

		getUser(email) {
			return email ? this.loggedUsers[this.emailToApikey[email]] : null;
		}

		retrieveUser(apikey) {
			return apikey ? this.loggedUsers[apikey] : null;
		}

		isAuthenticated(apikey) {
			return apikey ? Object.prototype.hasOwnProperty.call(this.loggedUsers, apikey) : false;
		}

		isAuthenticatedByEmail(email) {
			return email ? Object.prototype.hasOwnProperty.call(this.loggedUsers, this.emailToApikey[email]) : false;
		}

		authenticate(apikey, user) {
			if (user && user.email && apikey) {
				this.loggedUsers[apikey] = user;
				this.emailToApikey[user.email] = apikey;
				this.prune();
			}
		}

		unauthenticate(apikey) {
			if (apikey) {
				delete this.emailToApikey[this.loggedUsers[apikey].email];
				this.prune();
			}
		}

		unauthenticateByEmail(email) {
			if (email) {
				delete this.emailToApikey[email];
				this.prune();
			}
		}

		logAuthUsers() {
			if (this.logging) LogAuthUsers(this.loggedUsers);
		}

		logAuthKeys() {
			if (this.logging) LogAuthKeys(this.emailToApikey);
		}

		/**
		 * This function is used to generate an api key, represented as a random alpha-numeric string of length 20
		 * @returns an apikey
		 */
		generateApiKey() {
			let result;
			do {
				result = '';
				for (let i = 0; i < this.apikeyLength; i++) {
					result += this.apikeyCharacters.charAt(Math.floor(Math.random() * this.apikeyCharacters.length));
				}
			} while (Object.keys(this.loggedUsers).includes(result));
			return result;
		}

		/**
		 * This function validates the client's input, the users username and surname.
		 * @param name the name of the user that needs to be tested (username or surname)
		 */
		checkName(name) {
			let re = /^\w+$/;
			let valid = true;
			if (name.trim().length === 0) valid = false;
			// name can not be blank
			else if (!re.test(name)) valid = false;
			return valid;
		}
		/**
		 * This function validates the users email address
		 * @param email the email that needs to be validated
		 */
		checkUserEmail(email) {
			let emailReg = new RegExp(
				/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
			);
			let valid = true;
			if (email.trim().length === 0) valid = false;
			// email required
			else if (!emailReg.test(email)) valid = false; //email does not exist
			return valid;
		}
		/**
		 * This function validates the client's password.
		 * @param password the users password that needs to be validated
		 */
		checkUserPasswordLogin(password) {
			let valid = true;
			let re;
			if (password.trim().length === 0) valid = false; // password cannot be empty
			if (password !== '' && password) {
				if (password.length < 8) valid = false; //password must be 8 letters
				re = /[0-9]/;
				if (!re.test(password)) valid = false; // password password must contain at least one number (0-9)
				re = /[a-z]/;
				if (!re.test(password)) valid = false; // password must contain at least one lowercase letter (a-z)!
				re = /[A-Z]/;
				if (!re.test(password)) valid = false; // password must contain at least one capital letter
				re = /[!@#$%^&*]/;
				if (!re.test(password)) valid = false; // password must contain at least one special character
			} else valid = false; //confirm password incorrect
			return valid;

			/*
			let valid = true;
			let re;
			if (password.trim().length === 0) valid = false;
			// password cannot be empty
			else {
				re = /^[0-9a-zA-Z!@#\$%\^&\*]{9,}$/; //eslint-disable-line
				return re.test(password);
			}
			return valid;
			*/
		}
		/**
		 * This function validates the client's input, the users password, confirm password and name.
		 * @param password the users password that needs to be validated
		 * @param confirmPassword the users confirm password that needs to be validated
		 * @param name the name of the user that needs to be tested (username or surname)
		 *
		 */
		checkUserPasswordRegister(password, confirmPassword, name) {
			return this.checkUserPasswordLogin(password) && password === confirmPassword && password !== name;

			/*
			let valid = true;
			let re;
			if (password.trim().length === 0) valid = false; // password cannot be empty
			if (password !== '' && password === confirmPassword) {
				if (password.length < 8) valid = false; //password must be 8 letters
				if (password === name) valid = false; //password must be different than name
				re = /[0-9]/;
				if (!re.test(password)) valid = false; // password password must contain at least one number (0-9)
				re = /[a-z]/;
				if (!re.test(password)) valid = false; // password must contain at least one lowercase letter (a-z)!
				re = /[A-Z]/;
				if (!re.test(password)) valid = false; // password must contain at least one capital letter
				re = /[!@#$%^&*]/;
				if (!re.test(password)) valid = false; // password must contain at least one special character
			} else valid = false; //confirm password incorrect
			return valid;
			*/
		}
	}

	return {
		/**
		 * A function that returns a singleton object of the Cache type.
		 * @return {Authentication} an object that stores data from previous requests.
		 */
		getInstance: function () {
			if (instance === null) {
				instance = new Authentication();
				instance.constructor = null;
			}
			return instance;
		},
	};
})();

module.exports = AuthenticationMaker.getInstance();
