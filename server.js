require('dotenv').config();
const http = require('http');
const Database = require('./database');
const express = require('express');
const app = express();
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;
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
    res.status(200);
    res.json(list);
  })
  .catch((err) => console.error(err));
});

//  1. GET_GRAPHS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
app.get('/graphs', (req, res) =>{
    const dashboardID = req.query.dashboardID;
    db.getGraphList(dashboardID)
        .then((list) => {
            res.status(200);
            res.json(list);
        })
        .catch((err) => console.error(err));
});

/*POST REQUESTS*/
//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
app.post('/dashboard', (req,res)=>{
  const name = req.query.name;
  const description = req.query.description;
  const colour = req.query.colour;
  db.addDashboard(name,description)
  .then(() => {
      res.status(200).json({"message": "Successfully Added Dashboard"});
  })
  .catch((err) => {
      console.error(err);
      res.status(400).json({"message": "Error Occurred"});
  });
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
app.post('/graph', (req,res)=>{
    const graphTypeID = req.query.graphTypeID;
    const dashboardID = req.query.dashboardID;
    db.addGraph(dashboardID,graphTypeID)
    .then(() => {
        res.status(200).json({"message": "Successfully Added To Dashboard"});
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({"message": "Error Occurred"});
    });
});

/* DELETE REQUESTS */

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
app.delete('/graph', (req,res)=>{
    const id = req.query.graphID;
    db.removeGraph(id)
    .then(() => {
        res.status(200).json({"message": "Successfully Removed Graph"});
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({"message": "Error Occurred"});
    });
});

//  5. REMOVE_DASHBOARD
//  => DELETE (dashboardID)
app.delete('/dashboard', (req,res)=>{
    const id = req.query.dashboardID;
    db.removeDashboard(id)
    .then(() => {
        res.status(200).json({"message": "Successfully Removed Dashboard"});
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({"message": "Error Occurred"});
    });
});
/*PUT REQUESTS*/

//  6. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardID)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
app.put('/dashboard', (req,res)=>{
    const id = req.query.dashboardID;
    db.updateDashboard(id, req.query.fields, req.query.data )
    .then(() => {
        res.status(200).json({"message": "Successfully Updated Dashboard"});
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({"message": "Error Occurred"});
    });
});

//  8. UPDATE_GRAPH_TYPE
//  => PUT(graphType, graphID)
app.put('/graph', (req,res)=>{
    const id = req.query.graphID;
    db.updateGraph( id, req.query.fields, req.query.data)
    .then(() => {
        res.status(200).json({"message": "Successfully Updated Graph"});
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({"message": "Error Occurred"});
    });
});

/* PHILLIP EXAMPLE OF DATABASE CALL
 db.getDashboardList()
    .then((list) => {
      res.json(list);
    })
    .catch((err) => console.error(err));
 */

