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
    let query = `SELECT * FROM Dashboard;`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }

  async addDashboard(name, desc) {
    let query = `INSERT INTO Dashboard (Name,Description) VALUES ('${name}','${desc}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }

  async removeDashboard(dashboardID) {
    let query = `DELETE FROM Dashboard WHERE ( ID = '${dashboardID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }

  async updateDashboard(dashboardID, fields, data) {
    let query = `UPDATE Dashboard SET ${fieldUpdates(fields, data)} WHERE ( ID = '${dashboardID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }

  async getGraphList(dashboardID) {
    let query = `SELECT * FROM Graph WHERE ( dashboardID = '${dashboardID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }

  async addGraph(dashboardID, GraphTypeID) {
    let query = `INSERT INTO Graph (dashboardID, GraphTypeID) VALUES ('${dashboardID}','${GraphTypeID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }

  async removeGraph(GraphID) {
    let query = `DELETE FROM Graph WHERE ( ID = '${GraphID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }

  async updateGraph(GraphID, fields, data) {
    let query = `UPDATE Graph SET ${fieldUpdates(fields, data)} WHERE ( ID = '${GraphID}');`;
    let result = await this.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }
}

function fieldUpdates(fields, data) {
  let output = '';
  for (let i = 0; i < fields.length; i++) {
    output = output + ` ${fields[i]} = '${data[i]}'${i < fields.length - 1 ? ', ' : ''}`;
  }
  return output;
}

module.exports = Database;
