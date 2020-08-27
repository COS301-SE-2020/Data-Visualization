/**
 * @file dashboard.js
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
 * Functional Description: This file implements a dashboard router that handles any client requests and these requests are
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
const { error } = require('../helper');

router.post('/list', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else {
		Rest.getDashboardList(
			req.body.email,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

router.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.description === undefined) error(res, { error: 'Dashboard Description Undefined', status: 400 });
	else if (req.body.name === undefined) error(res, { error: 'Dashboard Name Undefined', status: 400 });
	else if (req.body.metadata === undefined) error(res, { error: 'Dashboard MetData Is Undefined', status: 400 });
	else {
		Rest.addDashboard(
			req.body.email,
			req.body.name,
			req.body.description,
			req.body.metadata,
			(data) => res.status(200).json({ message: 'Successfully Added Dashboard', ...data }),
			(err) => error(res, err)
		);
	}
});

router.post('/update', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Id Undefined', status: 400 });
	else if (req.body.fields === undefined) error(res, { error: 'Fields Undefined', status: 400 });
	else if (req.body.data === undefined) error(res, { error: 'Data Undefined', status: 400 });
	else {
		Rest.updateDashboard(
			req.body.email,
			req.body.dashboardID,
			req.body.fields,
			req.body.data,
			(data) => {
				res.status(200).json({ message: 'Successfully Updated Dashboard', ...data });
			},
			(err) => error(res, err)
		);
	}
});

router.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Id Undefined', status: 400 });
	else {
		Rest.removeDashboard(
			req.body.email,
			req.body.dashboardID,
			() => {
				res.status(200).json({ message: 'Successfully Removed Dashboard' });
			},
			(err) => error(res, err)
		);
	}
});

module.exports = router;
