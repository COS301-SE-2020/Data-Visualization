/**
 * @file routes.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 30/06/2020   Elna Pistorius & Phillip Schulze     Original
 * 2/07/2020    Elna Pistorius & Phillip Schulze     Added more root modules
 *
 * Test Cases: none
 *
 * Functional Description: This file just groups all the routes together so that we only have to require routes
 * rather than every single rout
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const { router: UsersRoute, loggedUsers } = require('./users.js');
const DashboardsRoute = require('./dashboards.js');
const GraphsRoute = require('./graphs.js');
const DataSourceRoute = require('./dataSource.js');
const Suggestions = require('./suggestions.js');

module.exports = { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRoute, Suggestions, loggedUsers };
