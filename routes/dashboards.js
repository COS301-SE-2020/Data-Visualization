require('dotenv').config();
const express = require('express');
const router = express.Router();

const SESS_NAME = 'sid'; //ms
const { Rest } = require('../controllers');

//  1. GET_DASHBOARDS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.post('/list', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else {
		Rest.getDashboardList(
			req.body.email,
			(list) => res.status(200).json(list),
			(err) => error(res, err, 400)
		);
	}
});

//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
router.post('/add', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.dashboardID === undefined) {
		error(res, { error: 'Dashboard ID Undefined' }, 400);
	} else if (req.body.description === undefined) {
		error(res, { error: 'Dashboard Description Undefined' }, 400);
	} else if (req.body.name === undefined) {
		error(res, { error: 'Dashboard Name Undefined' }, 400);
	} else {
		Rest.addDashboard(
			req.body.email,
			req.body.dashboardID,
			req.body.name,
			req.body.description,
			() => res.status(200).json({ message: 'Successfully Added Dashboard' }),
			(err) => error(res, err, 400)
		);
	}
});

//  3. REMOVE_DASHBOARD
router.post('/remove', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.dashboardID === undefined) {
		error(res, { error: 'Dashboard Id Undefined' }, 400);
	} else {
		Rest.removeDashboard(
			req.body.email,
			req.body.dashboardID,
			() => {
				res.status(200).json({ message: 'Successfully Removed Dashboard' });
			},
			(err) => error(res, err, 400)
		);
	}
});

//  4. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardID)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
router.post('/update', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		error(res, { error: 'Body Undefined' }, 400);
	} else if (req.body.dashboardID === undefined) {
		error(res, { error: 'Dashboard Id Undefined' }, 400);
	} else if (req.body.fields === undefined) {
		error(res, { error: 'Fields Undefined' }, 400);
	} else if (req.body.data === undefined) {
		error(res, { error: 'Data Undefined' }, 400);
	} else {
		Rest.updateDashboard(
			req.body.email,
			req.body.dashboardID,
			req.body.fields,
			req.body.data,
			() => {
				res.status(200).json({ message: 'Successfully Updated Dashboard' });
			},
			(err) => error(res, err, 400)
		);
	}
});

function error(res, err, status = 400) {
	console.error(err);
	res.status(status).json(err);
}

module.exports = router;
