require('dotenv').config();
const http = require('http');
const Database = require('./database');
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;

const express = require('express');
const app = express();
const path = require('path');
const static_path = '/data-visualisation-app/build/';
// const router = express.Router();

const db = new Database();

app.use(express.static(__dirname + static_path));

app.get('/', function (req, res) {
  let result = '';

  db.getGraphList()
    .then((list) => {
      res.json(list);
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });

  // res.sendFile(path.join(__dirname + static_path + '/index.html'));
});

app.get('/opt', function (req, res) {
  console.log(req.query);

  db.updateGraph(req.query.id, req.query.f, req.query.d)
    .then((response) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

let server = app.listen(PORT, function () {
  let port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});

/*Request types
 POST -> ADD
 PUT -> UPDATE
 DELETE -> REMOVE
*/
//TODO: ADD(WHAT, DATA), UPDATE(WHAT, DATA), DELETE(WHAT,WHICH ONE)
// DASHBOARD, GRAPHS, GRAPH TYPES
// 1. GET_DASHBOARD
// 1. ADD DASHBOARD => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
// 2. ADD GRAPH TO DASHBOARD => POST (dashboardId, graphId)
// 3. REMOVE GRAPH FROM DASHBOARD => DELETE (graphId)
// 4. REMOVE DASHBOARD => DELETE (dashboardId)
// 5. UPDATE_DASHBOARD_NAME => PUT(dashboardNewName, dashboardId)
// 6. UPDATE_DASHBOARD_DESCRIPTION => PUT(dashboardDescription, dashboardID)
// 7. UPDATE_GRAPH_TYPE => PUT(graphType, graphID)
