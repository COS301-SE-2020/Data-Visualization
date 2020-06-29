require('dotenv').config();
const express = require('express');
const router = express.Router();
const Database = require('../database');

const db = new Database();
//  1. GET_DASHBOARDS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.get('/', (req, res) => {
    db.getDashboardList()
        .then((list) => {
            res.status(200);
            res.json(list);
        })
        .catch((err) => console.error(err));
});

//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
router.post('/', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    db.addDashboard(name, description)
        .then(() => {
            res.status(200).json({ message: 'Successfully Added Dashboard' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});


//  3. REMOVE_DASHBOARD
router.delete('/', (req, res) => {
    const id = req.body.dashboardID;
    db.removeDashboard(id)
        .then(() => {
            res.status(200).json({ message: 'Successfully Removed Dashboard' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});

//  4. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardID)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
router.put('/', (req, res) => {
    console.log(req);
    const id = req.body.dashboardID;
    db.updateDashboard(id, req.body.fields, req.body.data)
        .then(() => {
            res.status(200).json({ message: 'Successfully Updated Dashboard' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});

module.exports = router;