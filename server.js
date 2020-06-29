require('dotenv').config();
const express = require('express');
const path = require('path');
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;
const static_path = '/data-visualisation-app/build/';

const users = require('./routes/users.js');
const dashboards = require('./routes/dashboards.js');
const graphs = require('./routes/graphs.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + static_path));

app.use('/users', users);
app.use('/graphs', graphs);
app.use('/dashboards', dashboards);
app.use((req, res, next) => {
  console.log(req.body, req.query);
  next();
});

let server = app.listen(PORT, function () {
  let port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + static_path + '/index.html'));
});

module.exports = server;