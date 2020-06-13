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
      ssl: true,
    };

    this.pg_pool = new Pool(config);
  }

  sendQuery(SQL_query) {
    // console.log(SQL_query);
    return new Promise((conResolve, conReject) => {
      this.pg_pool.connect().then((client) => {
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
      });
    });
  }

  async getDashboardList() {
    return ['AAA', 'CCC', 'BBB'];

    // var query = `Select * from Dashboards;`;
    // var result = await this.sendQuery(query);
    // if (result && result.command === 'SELECT') {
    //   return new Promise((resolve, reject) => {
    //     resolve(this.formatRooms(result.rows));
    //   });
    // } else {
    //   return new Promise((resolve, reject) => {
    //     reject(result);
    //   });
    // }
  }

  async addDashboard() {
    return true;
    // var result = await this.sendQuery(
    //   `Insert into bookedtimeslots (datetime, roomnumber, studentnumber) values('${this.catDateTime(
    //     date,
    //     time
    //   )}','${roomNumber}','${studentNumber}');`
    // );
    // if (result && result.command === 'INSERT') {
    //   return new Promise((resolve, reject) => {
    //     this.getDashboardList(date)
    //       .then((select) => resolve(select))
    //       .catch((err) => reject(err));
    //   });
    // } else {
    //   return new Promise((resolve, reject) => {
    //     reject(result);
    //   });
    // }
  }

  async removeDashbaord() {
    return true;
    //   var result = await this.sendQuery(
    //     `Delete from bookedtimeslots Where (studentnumber = '${studentNumber}') AND (roomnumber = '${roomNumber}') AND (datetime = '${this.catDateTime(
    //       date,
    //       time
    //     )}')`
    //   );
    //   if (result && result.command === 'DELETE') {
    //     return new Promise((resolve, reject) => {
    //       this.getDashboardList(date)
    //         .then((select) => resolve(select))
    //         .catch((err) => reject(err));
    //     });
    //   } else {
    //     return new Promise((resolve, reject) => {
    //       reject(result);
    //     });
    //   }
  }
}

function q(value) {
  if (Array.isArray(value) && value.length > 0) {
    var array = [];
    for (var i = 0; i < value.length; i++) {
      array[i] = "'" + value[i] + "'";
    }
    return array;
  } else if (typeof value === 'string' || value instanceof String) {
    return "'" + value + "'";
  } else {
    return value;
  }
}

module.exports = Database;
