/**
 * @file user.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             				Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze    Original
 * 30/06/2020   Elna Pistorius & Phillip Schulze    Added more functionality
 * 02/07/2020   Elna Pistorius & Phillip Schulze    Changed endpoint names and request methods to POST
 * 06/08/2020	Elna Pistorius 						Added the deregister endpoint
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a user router that handles any client requests and these requests are
 * forwarded to the application’s REST controller.
 *
 * Error Messages: "Error"
 * Assumptions: Requests should be POST methods and have a JSON body (if so is needed). The correct endpoint name must also be used.
 * Check the API manual for more detail.
 * Constraints: The API manual must be followed when making requests otherwise no requests will work properly.
 */
require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');
const { LogAuthUsers } = require('../helper');

let loggedUsers = {};

router.post('/login', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (!checkUserEmail(req.body.email))error(res, { error: 'User Email Incorrect' }, 400);
	else if (!checkUserPasswordLogin(req.body.password)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		const users = Object.keys(loggedUsers)
			.filter((key) => loggedUsers[key].email === req.body.email)
			.map((key) => loggedUsers[key]);

		if (users.length > 0) {
			LogAuthUsers(loggedUsers);
			res.status(200).json({ message: 'Successfully Logged In User', ...users[0] });
		} else {
			Rest.loginUser(
				req.body.email,
				req.body.password,
				(user) => {
					if (user === false) {
						res.status(401).json({ message: 'Failed to Log In User' });
					} else {
						loggedUsers[user.apikey] = user;
						LogAuthUsers(loggedUsers);
						res.status(200).json({ message: 'Successfully Logged In User', ...user });
					}
				},
				(err) => error(res, err, 400)
			);
		}
	}
});

router.post('/register', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (!checkName(req.body.name)) error(res, { error: 'User Name Incorrect' }, 400);
	else if (!checkName(req.body.surname)) error(res, { error: 'User Surname Incorrect' }, 400);
	else if (!checkUserEmail(req.body.email)) error(res, { error: 'User Email Incorrect' }, 400);
	else if (!checkUserPasswordRegister(req.body.password, req.body.confirmPassword, req.body.name)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		Rest.registerUser(
			req.body.name,
			req.body.surname,
			req.body.email,
			req.body.password,
			(user) => {
				// if (!req.session.sid) req.session.sid = {};
				// req.session.sid[user.apikey] = user;
				loggedUsers[user.apikey] = user;

				console.log('=====================================');
				console.log(
					'USERS',
					Object.keys(loggedUsers).map((key) => `${key} : ${loggedUsers[key].email}`)
				);
				console.log('=====================================');

				res.status(200).json({ message: 'Successfully Registered User', ...user });
			},
			(err) => error(res, err, 400)
		);
	}
});
router.post('/logout', (req, res) => {
	delete loggedUsers[req.body.apikey];

	console.log('=====================================');
	console.log(
		'USERS',
		Object.keys(loggedUsers).map((key) => `${key} : ${loggedUsers[key].email}`)
	);
	console.log('=====================================');

	res.status(200).json({ message: 'Successfully Logged out' });

	// req.session.destroy((err) => {
	//   if (err) {
	//     res.status(200).json({ message: 'Failed to Log out' });
	//   } else {
	//     if (req.session && req.session.sid) {
	//       res.clearCookie(sid);
	//     }
	//     res.status(200).json({ message: 'Successfully Logged out' });
	//   }
	// });
});

router.post('/deregister', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (!checkUserEmail(req.body.email)) error(res, { error: 'User Email Incorrect' }, 400);
	else if (!checkUserPasswordLogin(req.body.password)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		Rest.deregisterUser(
			req.body.email,
			req.body.password,
			() => res.status(200).json({ message: 'Successfully Deregistered User' }),
			(err) => error(res, err, 400)
		);
	}
});
/**
 * This function displays the error's message if one occurred in the console.
 * @param res the response message in JSON format
 * @param err the error message
 * @param status the status code
 */
function error(res, err, status = 400) {
	console.error(err);
	res.status(status).json(err);
}
/**
 * This function validates the client's input, the users username and surname.
 * @param name the name of the user that needs to be tested (username or surname)
 */
function checkName(name) {
	let re = /^\w+$/;
	let valid = true;
	if (name.trim().length === 0) valid = false; // name can not be blank
	else if (!re.test(name)) valid = false;
	return valid;
}
/**
 * This function validates the users email address
 * @param email the email that needs to be validated
 */
function checkUserEmail(email) {
	let emailReg = new RegExp(
		/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
	);
	let valid = true;
	if (email.trim().length === 0) valid = false; // email required
	else if (!emailReg.test(email)) valid = false; //email does not exist
	return valid;
}
/**
 * This function validates the client's password.
 * @param password the users password that needs to be validated
 */
function checkUserPasswordLogin(password) {
	let valid = true;
	let re;
	if (password.trim().length === 0) valid = false; // password cannot be empty
	else {
		re = /^[0-9a-zA-Z!@#\$%\^&\*]{9,}$/; //eslint-disable-line
		return re.test(password);
	}
	return valid;
}
/**
 * This function validates the client's input, the users password, confirm password and name.
 * @param password the users password that needs to be validated
 * @param confirmPassword the users confirm password that needs to be validated
 * @param name the name of the user that needs to be tested (username or surname)
 *
 */
function checkUserPasswordRegister(password, confirmPassword, name) {
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
}
module.exports = { router, loggedUsers };
