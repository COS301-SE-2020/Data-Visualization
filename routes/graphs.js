require('dotenv').config();
const express = require('express');
const router = express.Router();

const Database = require('../database');
const db = new Database();

//  1. GET_GRAPHS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.get('/', (req, res) => {
    const dashboardID = req.query.dashboardID || req.body.dashboardID || -1;
    db.getGraphList(dashboardID)
        .then((list) => {
            res.status(200);
            res.json(list);
        })
        .catch((err) => console.error(err));
});

//  2. UPDATE_GRAPH_TYPE
//  => PUT(graphType, graphID)
router.put('/', (req, res) => {
    const id = req.body.graphID;
    db.updateGraph(id, req.body.fields, req.body.data)
        .then(() => {
            res.status(200).json({ message: 'Successfully Updated Graph' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
router.post('/', (req, res) => {
    const graphTypeID = req.body.graphTypeID;
    const dashboardID = req.body.dashboardID;
    db.addGraph(dashboardID, graphTypeID)
        .then(() => {
            res.status(200).json({ message: 'Successfully Added To Dashboard' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});


//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
router.delete('/', (req, res) => {
    const id = req.body.graphID;
    db.removeGraph(id)
        .then(() => {
            res.status(200).json({ message: 'Successfully Removed Graph' });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ message: 'Error Occurred' });
        });
});
module.exports = router;