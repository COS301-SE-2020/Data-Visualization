const Database = require('../database');
const DataSource = require('../dataSource');
const { graphsSuggesterController } = require('../graphSuggester');
class RestController {
	static getDataSourceList(email, done, error) {
		Database.getDataSourceList(email)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}

	static addDataSource(email, dataSourceID, dataSourceURL, done, error) {
		Database.addDataSource(email, dataSourceID, dataSourceURL)
			.then(() => done())
			.catch((err) => error && error(err));
	}

	static removeDataSource(email, dataSourceID, done, error) {
		Database.removeDataSource(email, dataSourceID)
			.then(() => done())
			.catch((err) => error && error(err));
	}

	static getDashboardList(email, done, error) {
		Database.getDashboardList(email)
			.then((list) => done(list))
			.catch((err) => error && error(err));
	}

	static addDashboard(email, dashboardID, name, description, done, error) {
		Database.addDashboard(email, dashboardID, name, description)
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

	static addGraph(email, dashboardID, graphID, title, options, metadata, done, error) {
		Database.addGraph(email, dashboardID, graphID, title, options, metadata)
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
	static getSuggestions(src, done, error) {
		DataSource.getMetaData(src)
			.then((XMLString) => {
				const Meta = graphsSuggesterController.parseODataMetadata(XMLString);

				let randKey = Math.floor(Math.random() * Meta.sets.length); //generate a random index in the keyset
				const itemsKeys = Meta.items.keys(); //this is a list of the items keys
				let chosen = Meta.items[itemsKeys[randKey]]; //select the item at this index

				while (chosen != null && chosen.length === 0) {
					//check if the item with the selected key has data
					randKey = Math.floor(Math.random() * Meta.sets.length); //generate a new index to check in the key set
				}
				const randEntity = Meta.sets[randKey]; //select this entity for data source querying

				DataSource.getEntityData(src, randEntity)
					.then((Odata) => {
						const options = graphsSuggesterController.getSuggestions(Odata);
						if (options === null) RestController.getSuggestions(src, done, error);
						else done(options);
					})
					.catch((err) => error && error(err));
			})
			.catch((err) => error && error(err));
	}
}

module.exports = RestController;
