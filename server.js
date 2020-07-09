require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const static_path = '/data-visualisation-app/build/';
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const { Database } = require('./controllers');
const { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRoute, loggedUsers } = require('./routes');

const {
  PORT = 8000,
  HOST = '127.0.0.1',
  SESS_NAME = 'sid',
  SESS_LIFETIME = 30 * 24 * 60 * 60 * 1000, //ms
  SESS_SECRET = 'my secret string',
} = process.env;
const PRODUCTION = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? true : false;

const app = express();
app.use(cors());
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
      maxAge: parseInt(SESS_LIFETIME),
      sameSite: PRODUCTION,
      secure: PRODUCTION,
    },
  })
);

app.use((req, res, next) => {
  if (!PRODUCTION) {
    console.log('=====================================');
    console.log(req.method);
    console.log(req.body);
    console.log(req.query);
    console.log('USERS', loggedUsers);
    console.log('=====================================');
  }
  next();
});

app.use('/users', UsersRoute);

app.use((req, res, next) => {
  if (req.body.apikey && loggedUsers && loggedUsers.hasOwnProperty(req.body.apikey)) {
    req.body.email = loggedUsers[req.body.apikey].email;
    console.log('auth-email', req.body.email);
    next();
  } else res.status(401).json({ message: 'User is not authenticated' });
});

app.use('/graphs', GraphsRoute);
app.use('/dashboards', DashboardsRoute);
app.use('/datasource', DataSourceRoute);
app.use('/graphSuggestions', DataSourceRoute);

let server = app.listen(PORT, function () {
  let port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + static_path + '/index.html'));
});

module.exports = server;
