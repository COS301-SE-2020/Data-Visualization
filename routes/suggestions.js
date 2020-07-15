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

router.post('/graphs', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.sourceurl === undefined) {
		error(res, { error: 'Source Undefined' }, 400);
	} else {
		Rest.getSuggestions(
			req.body.sourceurl,
			(list) => res.status(200).json(list),
			(err) => error(res, err, 400)
		);
	}
});

function error(res, err, status = 400) {
	console.error(err);
	res.status(status).json(err);
}
module.exports = router;
