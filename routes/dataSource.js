/**
 * @file dataSource.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             				Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze    Original
 * 2/07/2020    Elna Pistorius & Phillip Schulze    Changed endpoint names and request methods to POST
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a dataSource router that handles any client requests and these requests are
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

router.post('/list', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else {
		Rest.getDataSourceList(
			req.body.email,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

router.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.dataSourceID === undefined) {
		error(res, { error: 'Data Source Id Undefined' }, 400);
	} else if (req.body.dataSourceUrl === undefined) {
		error(res, { error: 'Data Source url Undefined' }, 400);
	} else {
		Rest.addDataSource(
			req.body.email,
			req.body.dataSourceID,
			req.body.dataSourceUrl,
			() => res.status(200).json({ message: 'Successfully Added Data Source' }),
			(err) => error(res, err)
		);
	}
});

router.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.dataSourceID === undefined) {
		error(res, { error: 'Data Source Id Undefined' }, 400);
	} else {
		Rest.removeDataSource(
			req.body.email,
			req.body.dataSourceID,
			() => res.status(200).json({ message: 'Successfully Removed Data Source' }),
			(err) => error(res, err)
		);
	}
});

function error(res, err, status = 400) {
	console.error(err);
	res.status(status).json(err);
}

module.exports = router;
