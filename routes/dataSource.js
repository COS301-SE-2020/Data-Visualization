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
 * 02/10/2020   Elna Pistorius 						Created a new route to import CSV
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
const CSV = require('csv-js');
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
	else if (req.body.dataSourceName === undefined) error(res, { error: 'Data Source Name Undefined', status: 400 });
	else if (req.body.isLiveData === undefined) error(res, { error: 'Is Live Data Undefined', status: 400 });
	else {
		Rest.addDataSource(
			req.body.email,
			req.body.dataSourceUrl,
			req.body.dataSourceType,
			req.body.dataSourceName,
			req.body.isLiveData,
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

DataSourceRouteSrc.post('/local-import', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.SourceType === undefined) error(res, { error: 'Source type undefined' }, 400);
	else if (req.body.SourceName === undefined) error(res, { error: 'Source name undefined' }, 400);
	else if (req.body.EntityName === undefined) error(res, { error: 'Entity name undefined' }, 400);
	else if (req.body.PrimaryKey === undefined) error(res, { error: 'Primary key undefined' }, 400);
	else if (req.body.fields === undefined) error(res, { error: 'Fields are undefined' }, 400);
	else if (req.body.types === undefined) error(res, { error: 'Types are undefined' }, 400);
	else if (req.body.data === undefined) error(res, { error: 'Data are undefined' }, 400);
	else if (!Array.isArray(req.body.fields)) error(res, { error: 'Fields is not an array' }, 400);
	else if (!Array.isArray(req.body.types)) error(res, { error: 'Types is not an array' }, 400);
	else if (!isString(req.body.PrimaryKey)) error(res, { error: 'PrimaryKey is not a string' }, 400);
	else if (!isStringArray(req.body.fields)) error(res, { error: 'Fields is not an array of strings' }, 400);
	else if (!isStringArray(req.body.types)) error(res, { error: 'Types is not an array of strings' }, 400);
	else {
		let success = true;
		let perr = null;

		if (isString(req.body.data)) {
			try {
				req.body.data = parse(req.body.SourceType, req.body.data);
			} catch (e) {
				success = false;
				perr = e;
			}
		}

		if (success) {
			Rest.importLocalSourceAuth(
				req.body.email,
				req.body.SourceType,
				req.body.SourceName,
				req.body.EntityName,
				req.body.PrimaryKey,
				req.body.fields,
				req.body.types,
				req.body.data,
				(src) => res.status(200).json(src),
				(err) => error(res, err)
			);
		} else {
			error(res, perr);
		}
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
			false,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

DataSourceRouteMeta.post('/local-import', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.SourceType === undefined) error(res, { error: 'Source type undefined' }, 400);
	else if (req.body.EntityName === undefined) error(res, { error: 'Entity name undefined' }, 400);
	else if (req.body.PrimaryKey === undefined) error(res, { error: 'Primary key undefined' }, 400);
	else if (req.body.fields === undefined) error(res, { error: 'Fields are undefined' }, 400);
	else if (req.body.types === undefined) error(res, { error: 'Types are undefined' }, 400);
	else if (req.body.data === undefined) error(res, { error: 'Data are undefined' }, 400);
	else if (!isNumber(req.body.SourceType)) error(res, { error: 'Source type is not a number' }, 400);
	else if (!Array.isArray(req.body.fields)) error(res, { error: 'Fields is not an array' }, 400);
	else if (!Array.isArray(req.body.types)) error(res, { error: 'Types is not an array' }, 400);
	else if (!isString(req.body.PrimaryKey)) error(res, { error: 'PrimaryKey is not a string' }, 400);
	else if (!isStringArray(req.body.fields)) error(res, { error: 'Fields is not an array of strings' }, 400);
	else if (!isStringArray(req.body.types)) error(res, { error: 'Types is not an array of strings' }, 400);
	else {
		let success = true;
		let perr = null;

		if (isString(req.body.data)) {
			try {
				req.body.data = parse(req.body.SourceType, req.body.data);
			} catch (e) {
				success = false;
				perr = e;
			}
		}

		if (success) {
			Rest.importLocalSource(
				req.body.SourceType,
				req.body.EntityName,
				req.body.PrimaryKey,
				req.body.fields,
				req.body.types,
				req.body.data,
				(src) => res.status(200).json(src),
				(err) => error(res, err)
			);
		} else {
			error(res, perr);
		}
	}
});

function parse(type, data) {
	if (type === 4) return JSON.parse(data);
	else if (type === 2) return CSV.parse(data);
	else return data;
}

function isNumber(int) {
	return typeof int === 'number';
}

function isString(str) {
	return typeof str === 'string';
}

function isStringArray(strArray) {
	return Array.isArray(strArray) && strArray.every((str) => isString(str));
}

module.exports = { DataSourceRouteSrc, DataSourceRouteMeta };
