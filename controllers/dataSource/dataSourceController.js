const Odata = require('./Odata');

class DataSource {
  static getEntityList(src) {
    //if src type is Odata
    return Odata.getEntityList(src); //Returns a promise
  }
}

module.exports = DataSource;
