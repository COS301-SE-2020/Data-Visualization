/**
 * @file databaseController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Phillip Schulze     Original
 * 12/07/2020   Phillip Schulze    	Added more functionality for graph suggestions
 * 15/07/2020   Phillip Schulze	 	Modified all the functions
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a database controller that handles any database requests.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
require('dotenv').config();
// const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production');

const Pool = require('pg-pool');
const params = require('url').parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const bcrypt = require('bcryptjs');
// const { off } = require('process');
const saltRounds = 12;
const config = {
	user: auth[0],
	password: auth[1],
	host: params.hostname,
	port: params.port,
	database: params.pathname.split('/')[1],
	hostnossl: true,
	ssl: {
		rejectUnauthorized: false, //@todo check this
	},
};

/**
 * Purpose: This class is responsible for doing any database related requests.
 * Usage Instructions: Use the corresponding functions to add/update/delete/remove to the database.
 * Class functionality should be accessed through restController.js.
 * @author Phillip Schulze
 */
class Database {
	/**
	 * This function sends queries to the database.
	 * @param querySql the query that needs to be executed in the database
	 * @returns a promise
	 */
	static sendQuery(querySql, values) {
		// if (!PRODUCTION) console.log(querySql);
		// console.log(querySql, values);
		return new Promise((conResolve, conReject) => {
			Database.pgPool
				.connect()
				.then((client) => {
					client
						.query(querySql, values)
						.then((res) => {
							client.release();
							if (typeof res === 'undefined') conReject(DBerror(UndefinedResponseFromDBerror(querySql)));
							else conResolve(res);
						})
						.catch((err) => {
							client.release();
							conReject(DBerror(err));
						});
				})
				.catch((err) => conReject(DBerror(err)));
		});
	}

	/*==================USERS===============*/
	/**
	 * This function authenticates a user.
	 * @param email the users email
	 * @param password the users password
	 * @returns a promise
	 */

	static authenticate(email, password) {
		return new Promise((resolve, reject) => {
			// if (!PRODUCTION) console.log('==> AUTHENTICATING: ' + email);
			Database.sendQuery('SELECT * FROM Users WHERE( email = $1);', [email])
				.then((result) => {
					if (typeof result !== 'undefined' && result.command === 'SELECT') {
						if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
							// if (!PRODUCTION) console.log('==> AUTHENTICATION: succesful');
							delete result.rows[0].password;
							result.rows[0].apikey = generateApiKey();
							resolve(result.rows[0]);
						} else {
							// if (!PRODUCTION) console.log('==> AUTHENTICATION: failed');
							resolve(false);
						}
					} else {
						// if (!PRODUCTION) console.log('==> AUTHENTICATION: error');
						reject(result);
					}
				})
				.catch((err) => reject(err));
		});
	}
	/**
	 * This function registers a user.
	 * @param fname the users first name
	 * @param lname the users last name
	 * @param email the users email
	 * @param password the users password
	 * @returns a promise
	 */
	static register(fname, lname, email, password) {
		password = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

		// if (!PRODUCTION) console.log('==> REGISTER: ' + email + ' |' + apikey);

		return new Promise((resolve, reject) => {
			Database.sendQuery('INSERT INTO Users (email,firstname,lastname,password) VALUES($1,$2,$3,$4) RETURNING email,firstname,lastname;', [email, fname, lname, password])
				.then((response) => {
					// if (!PRODUCTION) console.log('REGISTER RESPONSE');
					if (response.rows.length > 0) {
						response.rows[0].apikey = generateApiKey();
						resolve(response.rows[0]);
					} else reject(response);
				})
				.catch((err) => {
					// console.log(err);
					reject(DBerror(err));
				});
		});
	}

	static async deregister(email, password) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('SELECT * FROM Users WHERE( email = $1);', [email])
				.then((result) => {
					if (typeof result !== 'undefined' && result.command === 'SELECT') {
						if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
							Database.sendQuery('DELETE FROM Users WHERE( email = $1);', [email])
								.then(() => resolve())
								.catch((err) => reject(err));
						} else resolve();
					} else reject(result);
				})
				.catch((err) => reject(err));
		});
	}

	/*==================DATA SOURCE===============*/
	/**
	 * This function is to get a list of data sources
	 * @param email the users email
	 * @returns a promise
	 */
	static async getDataSourceList(email) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('SELECT * FROM datasource WHERE ( email = $1);', [email])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function is to add a data source
	 * @param email the users email
	 * @param sourceID the sources ID that needs to be added
	 * @param sourceURL the data source url to add
	 * @returns a promise
	 */
	static async addDataSource(email, sourceURL) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('INSERT INTO datasource (email, sourceurl) VALUES ($1,$2) RETURNING *;', [email, sourceURL])
				.then((result) => {
					if (result.rows.length > 0) resolve(result.rows[0]);
					else reject(result);
				})
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function is to remove a data source
	 * @param email the users email
	 * @param dataSourceID the data source id
	 * @returns a promise
	 */
	static async removeDataSource(email, dataSourceID) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('DELETE FROM datasource WHERE ( email = $1) AND ( ID = $2);', [email, dataSourceID])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}

	/*==================DASHBOARDS===============*/
	/**
	 * This function is to get a dashboard list
	 * @param email the users email
	 * @returns a promise
	 */
	static async getDashboardList(email) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('SELECT * FROM Dashboard WHERE (email = $1);', [email])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function adds a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param name the dashboards name
	 * @param desc the description of the dashbaord
	 * @returns a promise
	 */
	static async addDashboard(email, name, desc, metadata) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('INSERT INTO Dashboard (Name,Description,metadata,email) VALUES ($1,$2,$3,$4) RETURNING *;', [name, desc, metadata, email])
				.then((result) => {
					// console.log(result);
					if (result.rows.length > 0) resolve(result.rows[0]);
					else reject(result);
				})
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function removes a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @returns a promise
	 */
	static async removeDashboard(email, dashboardID) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('DELETE FROM Dashboard WHERE ( email = $1 ) AND ( ID = $2);', [email, dashboardID])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function update a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param fields the fields that need to be updated
	 * @param data data that is used to update the fields
	 * @returns a promise
	 */
	static async updateDashboard(email, dashboardID, fields, data) {
		return new Promise((resolve, reject) => {
			Database.sendQuery(`UPDATE Dashboard SET ${fieldUpdates(fields, data, 2)} WHERE ( email = $1 ) AND ( ID = $2);`, [email, dashboardID, ...data])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}

	/*==================GRAPHS===============*/
	/**
	 * This function is used to get a list of graphs.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @returns a promise
	 */
	static async getGraphList(email, dashboardID) {
		return new Promise((resolve, reject) => {
			Database.sendQuery('SELECT g.* from graph as g join (SELECT * from dashboard as d WHERE (d.email = $1) AND (d.id = $2)) as de on (g.dashboardid=de.id);', [email, dashboardID])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function is used to add a graph to a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @param title the title of the graph
	 * @param options the options is a JSON object that stores the options and data of the graph
	 * @param metadata the metadata is a JSON object that stores the presentation data of the graph
	 * @returns a promise
	 */
	static async addGraph(email, dashboardID, title, options, metadata) {
		let query =
			'INSERT INTO GRAPH as g (dashboardid, title, metadata, options) (SELECT $1,$2,$3,$4 WHERE EXISTS (SELECT $5 FROM dashboard AS d WHERE (d.email = $5) AND (d.ID = $1)) ) RETURNING g.*';
		return new Promise((resolve, reject) => {
			Database.sendQuery(query, [dashboardID, title, JSON.stringify(metadata), JSON.stringify(options), email])
				.then((result) => {
					console.log(result.rows);
					if (result.rows.length > 0) resolve(result.rows[0]);
					else reject(result);
				})
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function is used to remove a graph from a dashboard
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @returns a promise
	 */
	static async removeGraph(email, dashboardID, graphID) {
		let query = 'DELETE FROM Graph as g WHERE (g.dashboardid in ( SELECT d.id from dashboard as d WHERE (d.email = $1) AND (d.id = $2))) AND (g.ID = $3);';
		return new Promise((resolve, reject) => {
			Database.sendQuery(query, [email, dashboardID, graphID])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
	/**
	 * This function is used to remove a graph from a dashboard
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @returns a promise
	 */
	static async updateGraph(email, dashboardID, graphID, fields, data) {
		data = data.map((item, i) => (i < fields.length && (fields[i] === 'metadata' || fields[i] === 'options') ? JSON.stringify(item) : item));

		let query = `UPDATE Graph as g SET ${fieldUpdates(fields, data, 3)} WHERE (
      g.dashboardid in ( SELECT d.id from dashboard as d WHERE (d.email = $1) AND (d.id = $2))
	) AND (g.ID = $3);`;

		return new Promise((resolve, reject) => {
			Database.sendQuery(query, [email, dashboardID, graphID, ...data])
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result));
		});
	}
}
Database.pgPool = new Pool(config);
/**
 * This function is used to convert lists of fields and data into comma seperated field=data pairs
 * @param fields
 * @param data
 * @returns a string
 */
function fieldUpdates(fields, data, offset) {
	offset = offset || 0;
	let index = -1;
	fields = fields.filter((field, i) => {
		if (field === 'email') {
			index = i;
			return false;
		} else return true;
	});
	if (index >= 0) data.splice(index, 1);

	let output = '';
	for (let i = 0; i < fields.length && i < data.length; i++) {
		const d = i + offset + 1;
		output = output + ' ' + fields[i] + ' = $' + d + (i < fields.length - 1 && i < data.length - 1 ? ', ' : '');
	}
	return output;
}
/**
 * This function is used to generate an api key, represented as a random alpha-numeric string of length 20
 * @returns an apikey
 */
function generateApiKey() {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < 20; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
/**
 * This function is used to format an error to be displayed.
 * @returns a javascript object of the error.
 */
function DBerror(err) {
	let { table, code, routine, hint, detail } = err;
	if (code === '23505' || code === '23503') routine = 'userAlreadyExists';
	if (typeof hint === 'undefined') hint = detail;
	return { origin: 'database', table, code, error: routine, hint };
}
/**
 * This function is used to return a error if any custom errors occurs.
 * @returns a JSON object of the error to be displayed.
 */
function UndefinedResponseFromDBerror(querySql) {
	return {
		table: undefined,
		code: undefined,
		routine: 'undefinedResponseFromDatabase',
		hint: undefined,
		detail: 'Query Sent: ' + querySql,
	};
}

/*
undefinedResponseFromDatabase
errorMissingColumn
userAlreadyExists
*/

module.exports = Database;
