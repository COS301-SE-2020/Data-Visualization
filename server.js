/**
 * @file server.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author                             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze     Original
 * 30/06/2020   Elna Pistorius & Phillip Schulze     Added more root modules
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a router that handles any client requests to the application’s endpoints
 * and handles these requests accordingly.
 *
 * Error Messages: "Error"
 * Assumptions: Requests should be POST methods and have a JSON body (if so is needed). The correct endpoint name must also be used.
 * Check the API manual for more detail.
 * Constraints: The API manual must be followed when making requests otherwise no requests will work properly.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const staticPath = '/data-visualisation-app/build/';
// const session = require('express-session');
// const pgStore = require('connect-pg-simple')(session);
// const { Database } = require('./controllers');
const { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRouteSrc, DataSourceRouteMeta, Suggestions } = require('./routes');
const { Authentication } = require('./controllers');
const { LogReqParams } = require('./helper');

const { PORT = 8000, HOST = '127.0.0.1' } = process.env;
const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + staticPath));

app.use((req, res, next) => {
	if (!PRODUCTION) LogReqParams(req);
	next();
});

app.use('/users', UsersRoute);
app.use('/suggestions', Suggestions);
app.use('/datasource/meta', DataSourceRouteMeta);

app.use((req, res, next) => {
	if (Authentication.isAuthenticated(req.body.apikey)) {
		req.body.email = Authentication.retrieveUser(req.body.apikey).email;
		console.log('auth-email', req.body.email);
		next();
	} else res.status(401).json({ message: 'User is not authenticated' });
});

app.use('/graphs', GraphsRoute);
app.use('/dashboards', DashboardsRoute);
app.use('/datasource/src', DataSourceRouteSrc);

let server = app.listen(PORT, function () {
	console.log(`Server started at http://${HOST}:${PORT}`);
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + staticPath + '/index.html'));
});

module.exports = server;
