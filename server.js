require('dotenv').config();
const express = require('express');
const path = require('path');
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;
const static_path = '/data-visualisation-app/build/';

const { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRoute } = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + static_path));

app.use((req, res, next) => {
  console.log(req.method, req.body, req.query);
  next();
});

app.use('/users', UsersRoute);
app.use('/graphs', GraphsRoute);
app.use('/dashboards', DashboardsRoute);
app.use('/datasource', DataSourceRoute);

let server = app.listen(PORT, function () {
  let port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + static_path + '/index.html'));
});

module.exports = server;
