/**
 * @file controllers.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author                             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze     Original
 * 12/07/2020   Elna Pistorius & Phillip Schulze     Add Graph Suggester Controller
 *
 * Test Cases: none
 *
 * Functional Description: This file just groups all the controller together so that we only have to require controllers.js
 * rather than every single controller
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const Rest = require('./rest'),
	DataSource = require('./dataSource'),
	Database = require('./database'),

	{ GraphSuggesterController } = require('./graphSuggester');

module.exports = { Rest, DataSource, Database, GraphSuggesterController };
