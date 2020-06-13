require('dotenv').config();
const http = require('http');
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;

const express = require('express');
const app = express();
const path = require('path');
const static_path = '/data-visualisation-app/build/';

app.use(express.static( __dirname + static_path ));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + static_path +'/index.html'))
});

let server = app.listen( PORT, function(){
  let port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});

