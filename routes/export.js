/**
 * @file dataSource.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author            Changes
 * -------------------------------------------------------------------------------
 * 02/08/2020    Elna Pistorius      Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a exporting router that handles any client requests and these requests are
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

router.post('/json', (req, res) => {
    if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
    else {
        Rest.exportToJson(
            req.body,
            (list) => res.status(200).json(list),
            (err) => error(res, err)
        );
    }
});

router.post('/csv', (req, res) => {
    if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined', status: 400 });
    else {
        Rest.exportToCSV(
            req.body,
            (list) => res.status(200).json(list),
            (err) => error(res, err)
        );
    }
});
module.exports = router;