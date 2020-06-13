class Database {
  constructor() {
    require('dotenv').config();
    const Pool = require('pg-pool');
    const url = require('url');
    const params = url.parse(process.env.DATABASE_URL);
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

    this.pg_pool = new Pool(config);
  }

  sendQuery(SQL_query) {
    // console.log(SQL_query);
    return new Promise((conResolve, conReject) => {
      this.pg_pool
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

  async getDashboardList() {
    var query = `SELECT * FROM Dashboard;`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }

  async addDashboard(name, desc) {
    var query = `INSERT INTO Dashboard (Name,Description) VALUES ('${name}','${desc}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }

  async removeDashboard(dashboardID) {
    var query = `DELETE FROM Dashboard WHERE ( ID = '${dashboardID}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }

  async updateDashboard(dashboardID, fields, data) {
    var query = `UPDATE Dashboard SET ${fieldUpdates(fields, data)} WHERE ( ID = '${dashboardID}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }

  async getGraphList(dashboardID) {
    var query = `SELECT * FROM Graph;`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }

  async addGraph(dashboardID, GraphTypeID) {
    var query = `INSERT INTO Graph (dashboardID, GraphTypeID) VALUES ('${dashboardID}','${GraphTypeID}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }

  async removeGraph(GraphID) {
    var query = `DELETE FROM Graph WHERE ( ID = '${GraphID}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }

  async updateGraph(GraphID, fields, data) {
    var query = `UPDATE Graph SET ${fieldUpdates(fields, data)} WHERE ( ID = '${GraphID}');`;
    var result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }
}

function fieldUpdates(fields, data) {
  var output = '';
  for (var i = 0; i < fields.length; i++) {
    output = output + ` ${fields[i]} = '${data[i]}'${i < fields.length - 1 ? ', ' : ''}`;
  }
  return output;
}

module.exports = Database;
