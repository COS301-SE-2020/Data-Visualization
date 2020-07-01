const axios = require('axios');

class Odata {
  static getEntityList(src) {
    return new Promise((resolve, reject) => {
      axios
        .get(jsonFormat(src))
        .then((res) => {
          const { data } = res;
          const { EntitySets } = data.d;

          resolve(EntitySets);
        })
        .catch((err) => reject(err));
    });
  }
}

function jsonFormat(src) {
  return format(src, 'json');
}

function format(src, f) {
  return `https://services.odata.org/V2/${src}?$format=${f}`;
}

module.exports = Odata;
