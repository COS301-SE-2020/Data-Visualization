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
  res.sendFile(path.join(__dirname + static_path + '/index.html'));
});

let server = app.listen( PORT, function(){
  let port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});

/*Request types
 POST -> ADD
 PUT -> UPDATE
 DELETE -> REMOVE
*/
/*GET REQUESTS*/
//  1. GET_DASHBOARDS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
app.get('/dashboard', (req, res) =>{
  db.getDashboardList()
      .then((list) => {
        res.json(list);
      })
      .catch((err) => console.error(err));
});

/*POST REQUESTS*/

//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
app.post('/dashboard', (req,res)=>{
  const dashboardName = req.query.name;
  const dashboardDescription = req.query.description;
  const dashboardColour = req.query.colour;
  // do database call here
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardId, graphId)
app.post('/graph', (req,res)=>{
  // do database call here
});

/* DELETE REQUESTS */

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphId)
app.delete('/graph', (req,res)=>{
  // do database call here
});

//  5. REMOVE_DASHBOARD
//  => DELETE (dashboardId)
app.delete('/dashboard', (req,res)=>{
  // do database call here
});

/*PUT REQUESTS*/

//  6. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardId)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
app.put('/dashboard', (req,res)=>{
  // do database call here
});

//  8. UPDATE_GRAPH_TYPE
//  => PUT(graphType, graphID)
app.put('/graph', (req,res)=>{
  // do database call here
});


/* PHILLIP EXAMPLE OF DATABASE CALL
 db.getDashboardList()
    .then((list) => {
      res.json(list);
    })
    .catch((err) => console.error(err));
 */