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
 * 02/07/2020   Elna Pistorius & Phillip Schulze    Changed endpoint names and request methods to POST
 * 05/08/2020   Elna Pistorius  					Added two new endpoints that returns a list of fields and a list of entities
 * 07/08/2020   Elna Pistorius   					Added new endpoint to retrieve data
 * 27/08/2020   Elna Pistorius 						Added a new error helper to make status code vary for different errors.
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
const DataSourceRouteSrc = express.Router();
const DataSourceRouteMeta = express.Router();

const { Rest } = require('../controllers');
const { error } = require('../helper');

//=============	Authenticated Endpoints ================

DataSourceRouteSrc.post('/list', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else {
		Rest.getDataSourceList(
			req.body.email,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

DataSourceRouteSrc.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.dataSourceUrl === undefined) error(res, { error: 'Data Source URL Undefined', status: 400 });
	else if (req.body.dataSourceType === undefined) error(res, { error: 'Data Source Type Undefined', status: 400 });
	else {
		Rest.addDataSource(
			req.body.email,
			req.body.dataSourceUrl,
			req.body.dataSourceType,
			(data) => res.status(200).json({ message: 'Successfully Added Data Source', ...data }),
			(err) => error(res, err)
		);
	}
});

DataSourceRouteSrc.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else {
		Rest.removeDataSource(
			req.body.email,
			req.body.dataSourceID,
			() => res.status(200).json({ message: 'Successfully Removed Data Source' }),
			(err) => error(res, err)
		);
	}
});

//=============	Unauthenticated Endpoints ================

DataSourceRouteMeta.post('/entities', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
	else if (req.body.sourceurl === undefined) error(res, { error: 'Source URL is Undefined', status: 400 });
	else if (req.body.sourcetype === undefined) error(res, { error: 'Source Type is Undefined', status: 400 });
	else {
		Rest.getEntityList(
			req.body.sourceurl,
			req.body.sourcetype,
			(data) => res.status(200).json(data),
			(err) => error(res, err)
		);
	}
});

DataSourceRouteMeta.post('/data', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.sourceurl === undefined) error(res, { error: 'Data Source URL Undefined' }, 400);
	else if (req.body.sourcetype === undefined) error(res, { error: 'Data Source Type Undefined' }, 400);
	else if (req.body.entity === undefined) error(res, { error: 'Data Entity Undefined' }, 400);
	else {
		Rest.getData(
			req.body.sourceurl,
			req.body.sourcetype,
			req.body.entity,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

DataSourceRouteMeta.post('/metadata', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.sourceurl === undefined) error(res, { error: 'Data Source Url Undefined' }, 400);
	else if (req.body.sourcetype === undefined) error(res, { error: 'Data Source Type Undefined' }, 400);
	else {
		Rest.getMetaData(
			req.body.sourceurl,
			req.body.sourcetype,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});
module.exports = { DataSourceRouteSrc, DataSourceRouteMeta };
