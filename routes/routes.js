const { router: UsersRoute, loggedUsers } = require('./users.js');
const DashboardsRoute = require('./dashboards.js');
const GraphsRoute = require('./graphs.js');
const DataSourceRoute = require('./dataSource.js');
const Suggestions = require('./suggestions.js');

module.exports = { UsersRoute, DashboardsRoute, GraphsRoute, DataSourceRoute, Suggestions, loggedUsers };
