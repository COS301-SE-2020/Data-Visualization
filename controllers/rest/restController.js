const Database = require('../database');
const DataSource = require('../dataSource');

class RestController {
  //CRUD DataSource
  /*
		ADD: Add to DB under Dashboard
		REMOVE: Add to DB under Dashboard
	*/

  static getDataSourceList(email, done, error) {
    Database.getDataSourceList(email)
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static addDataSource(email, dataSourceURL, done, error) {
    Database.addDataSource(email, dataSourceURL)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeDataSource(email, dataSourceID, done, error) {
    Database.removeDataSource(email, dataSourceID)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  //Request Graph Suggestions
  /*
        //

        //Get data sources of Dashboard from DB
        //get data from data sources
        //get suggestions from iga based on data from data sources
        //respond with suggestions
    */

  static getDashboardList(email, done, error) {
    Database.getDashboardList(email)
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static addDashboard(email, name, description, done, error) {
    Database.addDashboard(email, name, description)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static updateDashboard(email, id, fields, data, done, error) {
    Database.updateDashboard(email, id, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeDashboard(email, id, done, error) {
    Database.removeDashboard(email, id)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static getGraphList(email, dashboardID, done, error) {
    Database.getGraphList(email, dashboardID)
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static updateGraph(email, dashboardID, graphID, fields, data, done, error) {
    Database.updateGraph(email, dashboardID, graphID, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static addGraph(email, dashboardID, title, options, metadata, done, error) {
    Database.addGraph(email, dashboardID, title, options, metadata)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeGraph(email, dashboardID, graphID, done, error) {
    Database.removeGraph(email, dashboardID, graphID)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static loginUser(userName, password, done, error) {
    Database.authenticate(userName, password)
      .then((user) => done(user))
      .catch((err) => error && error(err));
  }

  static registerUser(userName, userSurname, userEmail, userPassword, done, error) {
    Database.register(userName, userSurname, userEmail, userPassword)
      .then((user) => done(user))
      .catch((err) => error && error(err));
  }

  static getMetaData(src, type, done, error) {
    DataSource.getMetaData()
      .then((user) => done(user))
      .catch((err) => error && error(err));
  }

  static getEntityList(src, type, done, error) {
    DataSource.getEntityList()
      .then((user) => done(user))
      .catch((err) => error && error(err));
  }
  static getEntityData(src, type, entity, done, error) {
    DataSource.getEntityData()
      .then((user) => done(user))
      .catch((err) => error && error(err));
  }
}

module.exports = RestController;
