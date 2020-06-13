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

/*POST REQUESTS*/

//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
app.post('/dashboard', (req,res)=>{
  const name = req.query.name;
  const description = req.query.description;
  const colour = req.query.colour;
  db.addDashboard({name: name, description: description, colour: colour})
  .then(() => {
      let toSend = {"message": "Successfully Added Dashboard"};
      res.status(200).send(toSend);
  })
  .catch((err) => {
      console.error(err);
      let toSend = {"message": "Error Occurred"};
      res.status(400).send(toSend);
  });
});

//  3. ADD_GRAPH_TO_DASHBOARD
// => POST (dashboardID, graphID)
app.post('/graph', (req,res)=>{
    const graphID = req.query.graphID;
    const dashboardID = req.query.dashboardID;
    db.addGraph({graphID: graphID, dashboardID: dashboardID})
    .then(() => {
        let toSend = {"message": "Successfully Added To Dashboard"};
        res.status(200).send(toSend);
    })
    .catch((err) => {
        console.error(err);
        let toSend = {"message": "Error Occurred"};
        res.status(400).send(toSend);
    });
});

/* DELETE REQUESTS */

//  4. DELETE_GRAPH_FROM_DASHBOARD
//  => DELETE (graphID)
app.delete('/graph', (req,res)=>{
    const id = req.query.graphID;
    db.removeGraph({graphID: id})
    .then(() => {
        let toSend = {"message": "Successfully Removed Graph"};
        res.status(200).send(toSend);
    })
    .catch((err) => {
        console.error(err);
        let toSend = {"message": "Error Occurred"};
        res.status(400).send(toSend);
    });
});

//  5. REMOVE_DASHBOARD
//  => DELETE (dashboardID)
app.delete('/dashboard', (req,res)=>{
    const id = req.query.dashboardID;
    db.removeGraph({dashboardID: id})
    .then(() => {
        let toSend = {"message": "Successfully Removed Dashboard"};
        res.status(200).send(toSend);
    })
    .catch((err) => {
        console.error(err);
        let toSend = {"message": "Error Occurred"};
        res.status(400).send(toSend);
    });
});

/*PUT REQUESTS*/

//  6. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardID)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
app.put('/dashboard', (req,res)=>{
    const id = req.query.dashboardID;
    let fields = [];
    for (let i of req.query.fields){
        fields.push(i);
    }
    let data = [];
    for (let i of req.query.data){
        fields.push(i);
    }

    db.updateDashbaord({dashboardID: id}, fields, data )
    .then(() => {
        let toSend = {"message": "Successfully Updated Dashboard"};
        res.status(200).send(toSend);
    })
    .catch((err) => {
        console.error(err);
        let toSend = {"message": "Error Occurred"};
        res.status(400).send(toSend);
    });
});

//  8. UPDATE_GRAPH_TYPE
//  => PUT(graphType, graphID)
app.put('/graph', (req,res)=>{
    const id = req.query.graphID;
    db.updateGraph({graphID: id})
    .then(() => {
        let toSend = {"message": "Successfully Updated Graph"};
        res.status(200).send(toSend);
    })
    .catch((err) => {
        console.error(err);
        let toSend = {"message": "Error Occurred"};
        res.status(400).send(toSend);
    });
});


/* PHILLIP EXAMPLE OF DATABASE CALL
 db.getDashboardList()
    .then((list) => {
      res.json(list);
    })
    .catch((err) => console.error(err));
 */