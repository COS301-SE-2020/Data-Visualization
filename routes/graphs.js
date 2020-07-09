require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

//  1. GET_GRAPHS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.post('/list', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.dashboardID === undefined){
    error(res, { error: 'Dashboard Id Undefined' }, 400);
  }
  else {
    Rest.getGraphList(
        req.body.dashboardID,
        (list) => res.status(200).json(list),
        (err) => error(res, err,404)
    );
  }
});

//  2. UPDATE_GRAPH
//  => PUT(graphType, graphID)
router.post('/update', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.graphID === undefined){
    error(res, { error: 'Graph Id Undefined' }, 400);
  }
  else if(req.body.fields === undefined){
    error(res, { error: 'Fields Undefined' }, 400);
  }
  else if( req.body.data === undefined){
    error(res, { error: 'Data Undefined' }, 400);
  }
  else {
    Rest.updateGraph(
        req.body.graphID,
        req.body.fields,
        req.body.data,
        () => res.status(200).json({message: 'Successfully Updated Graph'}),
        (err) => error(res, err,404)
    );
  }
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
router.post('/add', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.graphTypeID === undefined){
    error(res, { error: 'Graph Type Id Undefined' }, 400);
  }
  else if(req.body.dashboardID === undefined){
    error(res, { error: 'Dashboard Id Undefined' }, 400);
  }
  else {
    Rest.addGraph(
        req.body.graphTypeID,
        req.body.dashboardID,
        () => res.status(200).json({message: 'Successfully Added To Dashboard'}),
        (err) => error(res, err,404)
    );
  }
});

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
router.post('/remove', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.graphID === undefined){
    error(res, { error: 'Graph Id Undefined' }, 400);
  }
  else {
    Rest.removeGraph(
        req.body.graphID,
        () => res.status(200).json({message: 'Successfully Removed Graph'}),
        (err) => error(res, err,404)
    );
  }
});

function error(res, err, status= 404) {
  console.error(err);
  res.status(status).json(err);
}

module.exports = router;
