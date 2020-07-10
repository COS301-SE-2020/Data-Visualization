const axios = require('axios');

class Odata {
  static getMetaData(src) {
    return new Promise((resolve, reject) => {
      axios
        .get(formatMetaData(src))
        .then((res) => {
          const { data } = res;
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  }

  static getEntityList(src) {
    return new Promise((resolve, reject) => {
      axios
        .get(format(src))
        .then((res) => {
          const { EntitySets } = res.data.d;
          resolve(EntitySets);
        })
        .catch((err) => reject(err));
    });
  }

  static getEntityData(src, entity) {
    return new Promise((resolve, reject) => {
      axios
        .get(formatEntity(src, entity))
        .then((res) => {
          const { results } = res.data.d;
          resolve(results);
        })
        .catch((err) => reject(err));
    });
  }
}

function format(src) {
  return `${src}?$format=json`;
}

function formatEntity(src, entity) {
  console.log(`ODATA: ${src}/${entity}?$format=json`);
  return `${src}/${entity}?$format=json`;
}

function formatMetaData(src) {
  return `${src}/$metadata`;
}

module.exports = Odata;
