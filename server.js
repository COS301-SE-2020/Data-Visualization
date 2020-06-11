require('dotenv').config();
const http = require('http');

const { PORT = 8000, HOST = '127.0.0.1' } = process.env;

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic('./data-visualisation-app/build/');

let server = http.createServer(function (req, res) {
  let done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(PORT, () => {
  console.log(
    `Data-Visualisation hosting server running at http://${HOST}:${PORT}`
  );
});
