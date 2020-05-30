require('dotenv').config();
const http = require('http');

const { PORT } = process.env;

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic('./data-visualisation-app/build/');

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8000);
