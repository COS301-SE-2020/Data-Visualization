require('dotenv').config();
const express = require('express');
const path = require('path');
const { PORT = 8000, HOST = '127.0.0.1' } = process.env;
const static_path = '/data-visualisation-app/build/';
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const { Database } = require('./controllers');
const { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRoute } = require('./routes');

const SESS_LIFETIME = 30 * 24 * 60 * 60 * 1000; //ms
const SESS_NAME = 'sid'; //ms

const SESS_SECRET = 'Elna maak baie errors ;)'; //ms
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + static_path));

app.use(
  session({
    store: new pgStore({
      pool: Database.pg_pool,
      tableName: 'session',
    }),
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: false, //PRODUCTION => true
      secure: false, //PRODUCTION => true
    },
  })
);

app.use((req, res, next) => {
  console.log('=====================================');
  console.log(req.method);
  console.log(req.body);
  console.log(req.query);
  console.log(req.session);
  console.log('=====================================');
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
