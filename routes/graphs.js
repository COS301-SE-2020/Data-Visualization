require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

//  1. GET_GRAPHS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.post('/list', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined' }, 400);
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined' }, 400);
	else {
		Rest.getGraphList(
			req.body.email,
			req.body.dashboardID,
			(list) => res.status(200).json(list),
			(err) => error(res, err)
		);
	}
});

//  2. UPDATE_GRAPH
//  => PUT(graphType, graphID)
router.post('/update', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined' }, 400);
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined' }, 400);
	else if (req.body.graphID === undefined) error(res, { error: 'Graph Id Undefined' }, 400);
	else if (req.body.fields === undefined) error(res, { error: 'Fields Undefined' }, 400);
	else if (req.body.data === undefined) error(res, { error: 'Data Undefined' }, 400);
	else {
		Rest.updateGraph(
			req.body.email,
			req.body.dashboardID,
			req.body.graphID,
			req.body.fields,
			req.body.data,
			() => res.status(200).json({ message: 'Successfully Updated Graph' }),
			(err) => error(res, err)
		);
	}
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
router.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined' }, 400);
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Id Undefined' }, 400);
	else if (req.body.graphID === undefined) error(res, { error: 'GraphID Is Undefined' }, 400);
	else if (req.body.title === undefined) error(res, { error: 'Title Is Undefined' }, 400);
	else if (req.body.options === undefined) error(res, { error: 'Options Is Undefined' }, 400);
	else if (req.body.metadata === undefined) error(res, { error: 'MetData Is Undefined' }, 400);
	else {
		Rest.addGraph(
			req.body.email,
			req.body.dashboardID,
			req.body.graphID,
			req.body.title,
			req.body.options,
			req.body.metadata,
			() => res.status(200).json({ message: 'Successfully Added To Dashboard' }),
			(err) => error(res, err)
		);
	}
});

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
router.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) error(res, { error: 'Body Undefined' }, 400);
	else if (req.body.email === undefined) error(res, { error: 'Email Is Undefined' }, 400);
	else if (req.body.dashboardID === undefined) error(res, { error: 'Dashboard Is Undefined' }, 400);
	else if (req.body.graphID === undefined) error(res, { error: 'Graph Id Undefined' }, 400);
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

function error(res, err, status = 400) {
	console.error(err);
	res.status(status).json(err);
}

module.exports = router;
