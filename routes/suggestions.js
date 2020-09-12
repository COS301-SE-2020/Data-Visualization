/**
 * @file suggestions.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author                             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Elna Pistorius & Phillip Schulze    Original
 * 12/07/2020   Elna Pistorius & Phillip Schulze    Added graphs endpoint
 * 27/08/2020   Elna Pistorius 						Added a new error helper to make status code vary for different errors.
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a suggestion router that handles any client requests and these requests are
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

router.post('/params', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined', status: 400 });
	} else if (req.body.selectedEntities === undefined) {
		error(res, { error: 'Selected Entities Graph Undefined', status: 400 });
	} else if (req.body.selectedFields === undefined) {
		error(res, { error: 'Selected Fields Undefined', status: 400 });
	} else if (req.body.graphTypes === undefined) {
		error(res, { error: 'Graph Types Undefined', status: 400 });
	} else if (req.body.fittestGraph === undefined) {
		error(res, { error: 'Fittest Graph Undefined', status: 400 });
		// } else if (!Array.isArray(req.body.fittestGraph)) {
		// 	error(res, { error: 'Fittest Graph has to be an array of graphs' }, 400);
		// } else if (req.body.fittestGraph.length <= 0) {
		// 	error(res, { error: 'Fittest Graph has to have at least 1 element' }, 400);
	} else if (!validateEntityStructure(req.body.selectedEntities)) {
		error(res, { error: 'The structure of the selected entities are invalid.', hint: 'the structure should have the format of [ { datasource:string, entityName:string }:object ]:array', status: 400 });
	} else {
		Rest.setSuggestionParams(
			// req.body.fittestGraph[0],
			req.body.fittestGraph,
			req.body.selectedEntities,
			req.body.selectedFields,
			req.body.graphTypes,
			() => res.status(200).json({ message: 'Successfully Set Suggestion Params' }),
			(err) => error(res, err)
		);
	}
});

router.post('/graphs', (req, res) => {
	Rest.getSuggestions(
		(list) => res.status(200).json(list),
		(err) => error(res, err)
	);
});

function validateEntityStructure(entities) {
	function validateEntity(entity) {
		return !!(entity && entity.datasource && entity.entityName);
	}
	return entities.every((entity) => validateEntity(entity));
}

module.exports = router;
