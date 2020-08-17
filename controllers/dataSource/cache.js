const CacheMaker = (function () {
	let instance = null;
	/**
	 * This class handles chache data requested from external data sources.
	 * Usage Instructions: metadata, entityList and fieldList of all data sources that where accessed recently are saved here.
	 * @author Phillip Schulze
	 */
	class Cache {
		constructor() {
			this.metaData = {}; //Meta => { 'src': {timestamp, data:{items, associations, sets, types }}}
			this.entityData = {}; //Data => { 'src': {'entity': {timestamp, data:{items, associations, sets, types }}}}
			this.maxTime = 1000 * 60 * 60 * 0.5; //ms => 30mins
		}

		getMetaData(src) {
			if (this.metaData && this.metaData[src]) return this.metaData[src].data;
			return null;
		}
		getEntityList(src) {
			if (this.metaData && this.metaData[src]) return this.metaData[src].data.items;
			return null;
		}

		getEntityData(src, entity, field) {
			if (this.entityData && this.entityData[src] && this.entityData[src][entity]) {
				const data = this.entityData[src][entity].data;

				//TODO: refactor this
				const prim = Object.keys(data[0])[1];
				// console.log('Keys:', Object.keys(data[0]));
				// console.log('Primary Key:', prim);

				const res = data.map((item, i) => [item[prim], item[field]]);

				// let res = [];
				// for (let i = 0; i < 3 /*data.length*/; ++i) {
				// 	const item = data[i];

				// 	if (i === 1) {
				// 		console.log(item, field, item[field], Object.keys(item));

				// 		let index = Object.keys(item).indexOf(field);
				// 		console.log('index:', index);
				// 	}

				// 	const primValue = item[prim];
				// 	const value = item[field];

				// 	res.push([primValue, value]);
				// }

				// console.log(res);

				return res;
			}
			return null;

			/*
			{
				__metadata: {
				uri: 'https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)',
				type: 'NorthwindModel.Product'
				},
				ProductID: 1,
				ProductName: 'Chai',
				SupplierID: 1,
				CategoryID: 1,
				QuantityPerUnit: '10 boxes x 20 bags',
				UnitPrice: '18.0000',
				UnitsInStock: 39,
				UnitsOnOrder: 0,
				ReorderLevel: 10,
				Discontinued: false,
				Category: { __deferred: [Object] },
				Order_Details: { __deferred: [Object] },
				Supplier: { __deferred: [Object] }
			}
			*/
		}

		validateMetadata(src) {
			if (this.metaData && this.metaData[src] && Object.keys(this.metaData[src]).length > 0) {
				if (Date.now() - this.metaData[src].timestamp >= this.maxTime) {
					this.onMetadataTimedout(src, this.metaData[src]);
					this.removeMetaData(src);
					return false;
				}
				return true;
			} else return false;
		}

		validateEntityData(src, entity) {
			if (this.entityData && this.entityData[src] && this.entityData[src][entity] && Object.keys(this.entityData[src][entity]).length > 0) {
				if (Date.now() - this.entityData[src][entity].timestamp >= this.maxTime) {
					this.onEntityDataTimedout(src, entity, this.entityData[src][entity]);
					this.removeEntityData(src, entity);
					return false;
				}

				return true;
			} else {
				return false;
			}
		}

		setMetaData(src, data) {
			if (!this.metaData) this.metaData = {};
			this.metaData[src] = {
				timestamp: Date.now(),
				data,
			};
		}

		setEntityData(src, entity, data) {
			if (!this.entityData) this.entityData = {};
			if (!this.entityData[src]) this.entityData[src] = {};

			this.entityData[src][entity] = {
				timestamp: Date.now(),
				data,
			};
		}

		removeMetaData(src) {
			this.metaData[src] = {};
		}
		removeEntityData(src, entity) {
			if (this.entityData && this.entityData[src]) {
				this.entityData[src][entity] = {};
				if (Object.keys(this.entityData[src]).length <= 0) {
					this.entityData[src] = {};
				}
			}
		}

		onMetadataTimedout(src, cdata) {
			console.log('Removed Meta data:', src);
		}
		onEntityDataTimedout(src, entity, cdata) {
			console.log('Removed Entity data:', src, entity);
		}
	}

	return {
		/**
		 * A function that returns a singleton object of the Cache type.
		 * @return {Cache} a controller that handles all graph suggestion requests.
		 */
		getInstance: function () {
			if (instance === null) {
				instance = new Cache();
				instance.constructor = null;
			}
			return instance;
		},
	};
})();

module.exports = CacheMaker.getInstance();
