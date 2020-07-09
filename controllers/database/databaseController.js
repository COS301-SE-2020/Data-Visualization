require('dotenv').config();
const PRODUCTION = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? true : false;

const Pool = require('pg-pool');
const params = require('url').parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const bcrypt = require('bcryptjs');
const saltRounds = 12;

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
    if (!PRODUCTION) console.log(SQL_query);
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

  //==================USERS===============
  static async authenticate(email, password) {
    return new Promise((resolve, reject) => {
      console.log('==> AUTHENTICATING: ' + email);
      Database.sendQuery(`SELECT * FROM Users WHERE( email = '${email}');`).then((result) => {
        if (typeof result !== 'undefined' && result.command === 'SELECT') {
          if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
            console.log('==> AUTHENTICATION: succesful');
            delete result.rows[0].password;
            resolve(result.rows[0]);
          } else {
            console.log('==> AUTHENTICATION: failed');
            resolve(false);
          }
        } else {
          console.log('==> AUTHENTICATION: error');
          reject(result);
        }
      });
    }).catch((err) => reject(err));
  }

  static async register(fname, lname, email, password) {
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

    const apikey = new Date().toString();

    console.log('==> REGISTER: ' + email, apikey);
    return new Promise((resolve, reject) => {
      Database.sendQuery(
        `INSERT INTO Users (email,firstname,lastname,password) VALUES('${email}', '${fname}', '${lname}', '${password}', '${apikey}')`
      )
        .then((response) => {
          console.log('REGISTER RESPONSE');
          resolve(false);
        })
        .catch((err) => {
          if ('code' in err && err.code === '23505') {
            if ('table' in err && err.table === 'users') {
              if ('constraint' in err && err.constraint === 'users_pkey') {
                console.log('USER ALREADY EXISTS');
                resolve(true);
              }
            }
          }
          console.log('REGISTER ERROR');
          reject(err);
        });
    });
  }

  //==================DATA SOURCE===============
  static async getDataSourceList(email) {
    let query = `SELECT * FROM datasource WHERE ( email = '${email}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }

  static async addDataSource(email, sourceURL) {
    let query = `INSERT INTO datasource (email, sourceurl) VALUES ('${email}','${sourceURL}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }

  static async removeDataSource(email, dataSourceID) {
    let query = `DELETE FROM datasource WHERE ( email = '${email}') AND ( ID = '${dataSourceID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }

  //==================DASHBOARDS===============
  static async getDashboardList(email) {
    let query = `SELECT * FROM Dashboard WHERE (email = '${email}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'SELECT') resolve(result.rows);
      else reject(result);
    });
  }
  static async addDashboard(email, name, desc) {
    let query = `INSERT INTO Dashboard (Name,Description,email) VALUES ('${name}','${desc}','${email}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'INSERT') resolve(result);
      else reject(result);
    });
  }
  static async removeDashboard(email, dashboardID) {
    let query = `DELETE FROM Dashboard WHERE ( email = '${email}' ) AND ( ID = '${dashboardID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'DELETE') resolve(result);
      else reject(result);
    });
  }
  static async updateDashboard(email, dashboardID, fields, data) {
    console.log(fields, data);

    let index = -1;
    fields = fields.filter((field, i) => {
      if (field === 'email') {
        index = i;
        return false;
      } else return true;
    });
    if (index >= 0) data.splice(index, 1);

    console.log(fields, data);

    let query = `UPDATE Dashboard SET ${fieldUpdates(
      fields,
      data
    )} WHERE ( email = '${email}' ) AND ( ID = '${dashboardID}');`;
    let result = await Database.sendQuery(query);
    return new Promise((resolve, reject) => {
      if (result && result.command === 'UPDATE') resolve(result);
      else reject(result);
    });
  }

  //==================GRAPHS===============
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
