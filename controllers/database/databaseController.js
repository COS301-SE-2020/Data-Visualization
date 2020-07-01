require('dotenv').config();
const Pool = require('pg-pool');
const params = require('url').parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: {
    rejectUnauthorized: false,
  },
};

class Database {
  static sendQuery(SQL_query) {
    // console.log(SQL_query);
    return new Promise((conResolve, conReject) => {
      Database.pg_pool
        .connect()
        .then((client) => {
          client
            .query(SQL_query)
            .then((res) => {
              client.release();
              if (typeof res === 'undefined') {
                conReject(new Error('DB Response is undefined! Query Sent: ' + SQL_query));
              }
              conResolve(res);
            })
            .catch((error) => {
              client.release();
              // conReject(new Error('DB Error: ' + error));
              conReject(error);
            });
        })
        .catch((err) => conReject(err));
    });
  }

  static addDataSource(dashboardID, dataSource, list) {
    console.log('new DataSource:', dashboardID, dataSource, list);

    return new Promise((resolve, reject) => resolve());

    /// TODO: Add row in DataSource table
    /// TODO: Add rows in DataSourceEntity table
  }

  static async getDashboardList() {
    let query = `SELECT * FROM Dashboard;`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }
  static async addDashboard(name, desc) {
    let query = `INSERT INTO Dashboard (Name,Description) VALUES ('${name}','${desc}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }
  static async removeDashboard(dashboardID) {
    let query = `DELETE FROM Dashboard WHERE ( ID = '${dashboardID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }
  static async updateDashboard(dashboardID, fields, data) {
    let query = `UPDATE Dashboard SET ${fieldUpdates(fields, data)} WHERE ( ID = '${dashboardID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }
  static async getGraphList(dashboardID) {
    let query = `SELECT g.id, g.dashboardID, g.graphtypeid, t.source
    FROM graph as g join graphtype as t on (g.graphtypeid=t.id)
    WHERE ( g.dashboardID = '${dashboardID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }
  static async addGraph(dashboardID, GraphTypeID) {
    let query = `INSERT INTO Graph (dashboardID, GraphTypeID) VALUES ('${dashboardID}','${GraphTypeID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }
  static async removeGraph(GraphID) {
    let query = `DELETE FROM Graph WHERE ( ID = '${GraphID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }
  static async updateGraph(GraphID, fields, data) {
    let query = `UPDATE Graph SET ${fieldUpdates(fields, data)} WHERE ( ID = '${GraphID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }
}
Database.pg_pool = new Pool(config);

function fieldUpdates(fields, data) {
  let output = '';
  for (let i = 0; i < fields.length; i++) {
    output = output + ` ${fields[i]} = '${data[i]}'${i < fields.length - 1 ? ', ' : ''}`;
  }
  return output;
}

module.exports = Database;