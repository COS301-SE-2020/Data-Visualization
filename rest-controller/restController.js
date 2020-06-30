const Database = require('../database');
const db = new Database();

class RestController {
  //Get Dashboard List
  //Get Graph List

  //CRUD Dashbroad/Graph

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
    db.getDashboardList()
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static addDashboard(name, description, done, error) {
    db.addDashboard(name, description)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static updateDashboard(id, fields, data, done, error) {
    db.updateDashboard(id, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static removeDashboard(id, done, error) {
    db.removeDashboard(id)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static getGraphList(id, done, error) {
    db.getGraphList(id)
      .then((list) => done(list))
      .catch((err) => error && error(err));
  }

  static updateGraph(id, fields, data, done, error) {
    db.updateGraph(id, fields, data)
      .then(() => done())
      .catch((err) => error && error(err));
  }

  static addGraph(graphTypeID,dashboardID,done,error) {
    db.addGraph(dashboardID, graphTypeID)
        .then(() => done())
        .catch((err) => error && error(err));
  }

  static removeGraph(id, done,error) {
    db.removeGraph(id)
        .then(() => done())
        .catch((err) => error && error(err));
  }
}

module.exports = RestController;
