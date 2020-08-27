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

const { Rest, Authentication } = require('../controllers');

router.post('/login', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (!Authentication.checkUserEmail(req.body.email)) error(res, { error: 'User Email Incorrect' }, 400);
	else if (!Authentication.checkUserPasswordLogin(req.body.password)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		if (Authentication.isAuthenticatedByEmail(req.body.email)) {
			Authentication.logAuthUsers();
			res.status(200).json({ message: 'Successfully Logged In User', ...Authentication.getUser(req.body.email) });
		} else {
			Rest.loginUser(
				req.body.email,
				req.body.password,
				(user) => {
					if (user === false) {
						res.status(401).json({ message: 'Failed to Log In User' });
					} else {
						Authentication.authenticate(user.apikey, user);
						Authentication.logAuthUsers();
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
	else if (!Authentication.checkName(req.body.name)) error(res, { error: 'User Name Incorrect' }, 400);
	else if (!Authentication.checkName(req.body.surname)) error(res, { error: 'User Surname Incorrect' }, 400);
	else if (!Authentication.checkUserEmail(req.body.email)) error(res, { error: 'User Email Incorrect' }, 400);
	else if (!Authentication.checkUserPasswordRegister(req.body.password, req.body.confirmPassword, req.body.name)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		Rest.registerUser(
			req.body.name,
			req.body.surname,
			req.body.email,
			req.body.password,
			(user) => {
				Authentication.authenticate(user.apikey, user);
				Authentication.logAuthUsers();

				res.status(200).json({ message: 'Successfully Registered User', ...user });
			},
			(err) => error(res, err, 400)
		);
	}
});
router.post('/logout', (req, res) => {
	Authentication.unauthenticate(req.body.apikey);
	Authentication.logAuthUsers();
	res.status(200).json({ message: 'Successfully Logged out' });
});

router.post('/deregister', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (!Authentication.checkUserEmail(req.body.email)) error(res, { error: 'User Email Incorrect' }, 400);
	else if (!Authentication.checkUserPasswordLogin(req.body.password)) error(res, { error: 'User Password Incorrect' }, 400);
	else {
		Rest.deregisterUser(
			req.body.email,
			req.body.password,
			() => {
				Authentication.unauthenticateByEmail(req.body.email);
				Authentication.logAuthUsers();
				res.status(200).json({ message: 'Successfully Deregistered User' });
			},
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

module.exports = router;
