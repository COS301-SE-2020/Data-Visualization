const Database = require('../database');

class RestController {
  //CRUD DataSource
  /*
		ADD: Add to DB under Dashboard
		REMOVE: Add to DB under Dashboard
	*/

  //Log in\out\register Users

  //Request Graph Suggestions
  /*
		//

		//Get data sources of Dashboard from DB
		//get data from data sources
		//get suggestions from iga based on data from data sources
		//respond with suggestions
	*/

  static getDashboardList(done, error) {
    Database.getDashboardList()
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static addDashboard(name, description, done, error) {
    Database.addDashboard(name, description)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static updateDashboard(id, fields, data, done, error) {
    Database.updateDashboard(id, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeDashboard(id, done, error) {
    Database.removeDashboard(id)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static getGraphList(id, done, error) {
    Database.getGraphList(id)
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static updateGraph(id, fields, data, done, error) {
    Database.updateGraph(id, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static addGraph(graphTypeID, dashboardID, done, error) {
    Database.addGraph(dashboardID, graphTypeID)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeGraph(id, done, error) {
    Database.removeGraph(id)
      .then(() => done())
      .catch((err) => error && error(err));
  }
}

module.exports = RestController;
