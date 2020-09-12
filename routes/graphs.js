/**
 * @file graphs.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             				Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze    Original
 * 02/07/2020   Elna Pistorius & Phillip Schulze    Changed endpoint names and request methods to POST
 * 06/08/2020   Elna Pistorius						Added graph type filter endpoint
 * 11/08/2020   Elna Pistorius                      Updated the graph type endpoint
 * 27/08/2020   Elna Pistorius 						Added a new error helper to make status code vary for different errors.
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a graphs router that handles any client requests and these requests are
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
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined', status: 400 });
	else {
		Rest.getGraphList(
			req.body.email,
			req.body.dashboardID,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

router.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Id Undefined', status: 400 });
	else if (req.body.title === undefined) error(res, { error: 'Title Is Undefined', status: 400 });
	else if (req.body.options === undefined) error(res, { error: 'Options Is Undefined', status: 400 });
	else if (req.body.metadata === undefined) error(res, { error: 'MetData Is Undefined', status: 400 });
	else {
		Rest.addGraph(
			req.body.email,
			req.body.dashboardID,
			req.body.title,
			req.body.options,
			req.body.metadata,
			(data) => res.status(200).json({ message: 'Successfully Added To Dashboard', ...data }),
			(err) => error(res, err)
		);
	}
});

router.post('/update', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined', status: 400 });
	else if (req.body.graphID === undefined) error(res, { error: 'Graph Id Undefined', status: 400 });
	else if (req.body.fields === undefined) error(res, { error: 'Fields Undefined', status: 400 });
	else if (req.body.data === undefined) error(res, { error: 'Data Undefined', status: 400 });
	else {
		Rest.updateGraph(
			req.body.email,
			req.body.dashboardID,
			req.body.graphID,
			req.body.fields,
			req.body.data,
			(data) => res.status(200).json({ message: 'Successfully Updated Graph', ...data }),
			(err) => error(res, err)
		);
	}
});

router.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined', status: 400 });
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined', status: 400 });
	else if (req.body.graphID === undefined) error(res, { error: 'Graph Id Undefined', status: 400 });
	else {
		Rest.removeGraph(
			req.body.email,
			req.body.dashboardID,
			req.body.graphID,
			() => res.status(200).json({ message: 'Successfully Removed Graph' }),
			(err) => error(res, err)
		);
	}
});

router.post('/types', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.graphTypes === undefined) error(res, { error: 'Graphs Is Undefined', status: 400 });
	else {
		Rest.updateGraphTypes(
			req.body.graphTypes,
			() => res.status(200).json({ message: 'Successfully Updated Graph Types' }),
			(err) => error(res, err)
		);
	}
});

module.exports = router;
