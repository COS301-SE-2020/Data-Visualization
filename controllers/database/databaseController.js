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
require('dotenv').config()
const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production')

const Pool = require('pg-pool')
const params = require('url').parse(process.env.DATABASE_URL)
const auth = params.auth.split(':')

const bcrypt = require('bcryptjs')
const saltRounds = 12

const config = {
	user: auth[0],
	password: auth[1],
	host: params.hostname,
	port: params.port,
	database: params.pathname.split('/')[1],
	ssl: {
		rejectUnauthorized: false,
	},
}

/**
 * Purpose: This class is responsible for doing any database related requests.
 * Usage Instructions: Use the corresponding functions to add/update/delete/remove to the database.
 * Class functionality should be accessed through restController.js.
 * @author Phillip Schulze
 */
class Database {
	/**
	 * This function sends queries to the database.
	 * @param SQL_query the query that needs to be executed in the database
	 * @returns a promise
	 */
	static sendQuery(SQL_query) {
		if (!PRODUCTION) console.log(SQL_query)
		return new Promise((conResolve, conReject) => {
			Database.pg_pool
				.connect()
				.then((client) => {
					client
						.query(SQL_query)
						.then((res) => {
							client.release()
							if (typeof res === 'undefined') conReject(DBerror(UndefinedResponseFromDBerror()))
							else conResolve(res)
						})
						.catch((err) => {
							client.release()
							conReject(DBerror(err))
						})
				})
				.catch((err) => conReject(DBerror(err)))
		})
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
			if (!PRODUCTION) console.log('==> AUTHENTICATING: ' + email)
			Database.sendQuery(`SELECT * FROM Users WHERE( email = '${email}');`)
				.then((result) => {
					if (typeof result !== 'undefined' && result.command === 'SELECT') {
						if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
							if (!PRODUCTION) console.log('==> AUTHENTICATION: succesful')
							delete result.rows[0].password
							resolve(result.rows[0])
						} else {
							if (!PRODUCTION) console.log('==> AUTHENTICATION: failed')
							resolve(false)
						}
					} else {
						if (!PRODUCTION) console.log('==> AUTHENTICATION: error')
						reject(result)
					}
				})
				.catch((err) => reject(err))
		})
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
		password = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds))

		const apikey = generateApiKey()
		if (!PRODUCTION) console.log('==> REGISTER: ' + email + ' |' + apikey)

		return new Promise((resolve, reject) => {
			Database.sendQuery(
				`INSERT INTO Users (email,firstname,lastname,password,apikey) VALUES('${email}', '${fname}', '${lname}', '${password}', '${apikey}')`
			)
				.then((response) => {
					if (!PRODUCTION) console.log('REGISTER RESPONSE')
					resolve({ apikey })
				})
				.catch((err) => {
					// console.log(err);
					reject(DBerror(err))
				})
		})
	}

	static async unregister(email, password) {
		return new Promise((resolve, reject) => {
			Database.sendQuery(`SELECT * FROM Users WHERE( email = '${email}');`)
				.then((result) => {
					if (typeof result !== 'undefined' && result.command === 'SELECT') {
						if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
							Database.sendQuery(`DELETE FROM Users WHERE( email = '${email}');`)
								.then((result) => {
									resolve(true)
								})
								.catch((err) => reject(err))
						} else resolve(false)
					} else reject(result)
				})
				.catch((err) => reject(err))
		})
	}

	/*==================DATA SOURCE===============*/
	/**
	 * This function is to get a list of data sources
	 * @param email the users email
	 * @returns a promise
	 */
	static async getDataSourceList(email) {
		let query = `SELECT * FROM datasource WHERE ( email = '${email}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function is to add a data source
	 * @param email the users email
	 * @param sourceID the sources ID that needs to be added
	 * @param sourceURL the data source url to add
	 * @returns a promise
	 */
	static async addDataSource(email, sourceID, sourceURL) {
		let query = `INSERT INTO datasource (id, email, sourceurl) VALUES ('${sourceID}','${email}','${sourceURL}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function is to remove a data source
	 * @param email the users email
	 * @param dataSourceID the data source id
	 * @returns a promise
	 */
	static async removeDataSource(email, dataSourceID) {
		let query = `DELETE FROM datasource WHERE ( email = '${email}') AND ( ID = '${dataSourceID}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}

	/*==================DASHBOARDS===============*/
	/**
	 * This function is to get a dashboard list
	 * @param email the users email
	 * @returns a promise
	 */
	static async getDashboardList(email) {
		let query = `SELECT * FROM Dashboard WHERE (email = '${email}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function adds a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param name the dashboards name
	 * @param desc the description of the dashbaord
	 * @returns a promise
	 */
	static async addDashboard(email, dashboardID, name, desc) {
		let query = `INSERT INTO Dashboard (id,Name,Description,email) VALUES ('${dashboardID}','${name}','${desc}','${email}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function removes a dashboard.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @returns a promise
	 */
	static async removeDashboard(email, dashboardID) {
		let query = `DELETE FROM Dashboard WHERE ( email = '${email}' ) AND ( ID = '${dashboardID}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
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
		console.log(fields, data)

		let index = -1
		fields = fields.filter((field, i) => {
			if (field === 'email') {
				index = i
				return false
			} else return true
		})
		if (index >= 0) data.splice(index, 1)

		console.log(fields, data)

		let query = `UPDATE Dashboard SET ${fieldUpdates(
			fields,
			data
		)} WHERE ( email = '${email}' ) AND ( ID = '${dashboardID}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}

	/*==================GRAPHS===============*/
	/**
	 * This function is used to get a list of graphs.
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @returns a promise
	 */
	static async getGraphList(email, dashboardID) {
		let query = ` SELECT g.* from graph as g join (
      SELECT * from dashboard as d WHERE (d.email = '${email}') AND (d.id = '${dashboardID}')
    ) as de on (g.dashboardid=de.id);`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
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
	static async addGraph(email, dashboardID, graphID, title, options, metadata) {
		options = JSON.stringify(options)
		metadata = JSON.stringify(metadata)
		let query = `INSERT INTO GRAPH (id, dashboardid, title, metadata, options)
    SELECT '${graphID}', '${dashboardID}', '${title}', '${metadata}','${options}'
    WHERE EXISTS (SELECT '${email}' FROM dashboard AS d WHERE (d.email = '${email}') AND (d.ID = '${dashboardID}'))`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function is used to remove a graph from a dashboard
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @returns a promise
	 */
	static async removeGraph(email, dashboardID, graphID) {
		let query = `DELETE FROM Graph as g WHERE (
      g.dashboardid in ( SELECT d.id from dashboard as d WHERE (d.email = '${email}') AND (d.id = '${dashboardID}'))
    ) AND (g.ID = '${graphID}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
	/**
	 * This function is used to remove a graph from a dashboard
	 * @param email the users email
	 * @param dashboardID the dashboards id
	 * @param graphID the graphs id
	 * @returns a promise
	 */
	static async updateGraph(email, dashboardID, graphID, fields, data) {
		data = data.map((item, i) =>
			i < fields.length && (fields[i] === 'metadata' || fields[i] === 'options') ? JSON.stringify(item) : item
		)
		let query = `UPDATE Graph as g SET ${fieldUpdates(fields, data)} WHERE (
      g.dashboardid in ( SELECT d.id from dashboard as d WHERE (d.email = '${email}') AND (d.id = '${dashboardID}'))
    ) AND (g.ID = '${graphID}');`
		return new Promise((resolve, reject) => {
			Database.sendQuery(query)
				.then((result) => resolve(result.rows))
				.catch((result) => reject(result))
		})
	}
}
Database.pg_pool = new Pool(config)
/**
 * This function is used to remove a graph from a dashboard
 * @param fields
 * @param data
 * @returns a promise
 */
function fieldUpdates(fields, data) {
	let output = ''
	for (let i = 0; i < fields.length; i++) {
		output = output + ` ${fields[i]} = '${data[i]}'${i < fields.length - 1 ? ', ' : ''}`
	}
	return output
}
/**
 * This function is used to generate a api key
 * @returns a apikey
 */
function generateApiKey() {
	let result = ''
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charactersLength = characters.length
	for (let i = 0; i < 20; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}
/**
 * This function is used to format the error to be displayed, if one does occur.
 * @returns a javascript object of the error.
 */
function DBerror(err) {
	let { table, code, routine, hint, detail } = err
	if (code === '23505') routine = 'userAlreadyExists'
	if (typeof hint === 'undefined') hint = detail
	return { origin: 'database', table, code, error: routine, hint }
}
/**
 * This function is used to return a error if any custom errors occurs.
 * @returns a JSON object of the error to be displayed.
 */
function UndefinedResponseFromDBerror() {
	return {
		table: undefined,
		code: undefined,
		routine: 'undefinedResponseFromDatabase',
		hint: undefined,
		detail: 'Query Sent: ' + SQL_query,
	}
}

/*
undefinedResponseFromDatabase
errorMissingColumn
userAlreadyExists
*/

module.exports = Database
