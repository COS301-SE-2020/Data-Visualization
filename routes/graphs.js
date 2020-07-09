require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

//  1. GET_GRAPHS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.post('/list', (req, res) => {
  Rest.getGraphList(
    req.body.dashboardID,
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});

//  2. UPDATE_GRAPH
//  => PUT(graphType, graphID)
router.post('/update', (req, res) => {
  Rest.updateGraph(
    req.body.graphID,
    req.body.fields,
    req.body.data,
    () => res.status(200).json({ message: 'Successfully Updated Graph' }),
    (err) => error(res, err)
  );
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
router.post('/add', (req, res) => {
  Rest.addGraph(
    req.body.graphTypeID,
    req.body.dashboardID,
    () => res.status(200).json({ message: 'Successfully Added To Dashboard' }),
    (err) => error(res, err)
  );
});

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
router.post('/remove', (req, res) => {
  Rest.removeGraph(
    req.body.graphID,
    () => res.status(200).json({ message: 'Successfully Removed Graph' }),
    (err) => error(res, err)
  );
});

function error(res, err) {
  console.error(err);
  res.status(400).json({ message: 'Error Occurred' });
}

module.exports = router;
