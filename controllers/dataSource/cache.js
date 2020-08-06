const CacheMaker = (function () {
	let instance = null;
	/**
	 * This class handles chache data requested from external data sources.
	 * Usage Instructions: metadata, entityList and fieldList of all data sources that where accessed recently are saved here.
	 * @author Phillip Schulze
	 */
	class Cache {
		constructor() {
			this.metadata = {};
			this.entityList = {};
			this.fieldList = {};
			this.maxTime = 1000 * 60 * 60 * 0.5; //30mins
		}

		validateMetadata(src) {
			if (this.metadata && this.metadata[src]) {
				if (Date.now() - this.metadata[src].timestamp >= this.maxTime) {
					this.onMetadataTimedout(src, this.metadata[src]);
					this.removeMetaData(src);
					return false;
				}
				return true;
			} else return false;
		}
		validateEntityList(src) {
			if (this.entityList && this.entityList[src]) {
				if (Date.now() - this.entityList[src].timestamp >= this.maxTime) {
					this.onEntityListTimedout(src, this.entityList[src]);
					this.removeEntityList(src);
					return false;
				}
				return true;
			} else return false;
		}
		validateFieldList(src, entity) {
			if (this.fieldList && this.fieldList[src] && this.fieldList[src][entity]) {
				if (Date.now() - this.fieldList[src][entity].timestamp >= this.maxTime) {
					this.onFieldListTimedout(src, entity, this.fieldList[src][entity]);
					this.removeFieldList(src, entity);
					return false;
				}
				return true;
			} else return false;
		}

		getMetaData(src) {
			if (this.metadata && this.metadata[src]) return this.metadata[src].data;
			return null;
		}
		getEntityList(src) {
			if (this.entityList && this.entityList[src]) return this.entityList[src].data;
			return null;
		}
		getFieldList(src, entity) {
			if (this.fieldList && this.fieldList[src] && this.fieldList[src][entity]) return this.fieldList[src][entity].data;
			return null;
		}

		setMetaData(src, data) {
			if (!this.metadata) this.metadata = {};
			this.metadata[src] = {
				timestamp: Date.now(),
				data,
			};
		}
		setEntityList(src, data) {
			if (!this.entityList) this.entityList = {};

			this.entityList[src] = {
				timestamp: Date.now(),
				data,
			};
		}
		setFieldList(src, entity, data) {
			if (!this.fieldList) this.fieldList = {};
			if (!this.fieldList[src]) this.fieldList[src] = {};

			this.fieldList[src][entity] = {
				timestamp: Date.now(),
				data,
			};
		}

		removeMetaData(src) {
			delete this.metadata[src];
		}
		removeEntityList(src) {
			delete this.entityList[src];
		}
		removeFieldList(src, entity) {
			if (this.fieldList && this.fieldList[src]) {
				delete this.fieldList[src][entity];
				if (Object.keys(this.fieldList[src]).length <= 0) {
					delete this.fieldList[src];
				}
			}
		}

		onMetadataTimedout(src, data) {}
		onEntityListTimedout(src, data) {}
		onFieldListTimedout(src, entity, data) {}
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
