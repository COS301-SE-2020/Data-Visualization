const Odata = require('./Odata');

class DataSource {
  static getMetaData(src, type) {
    return DataSource.sources[type].getMetaData(src); //Returns a promise
  }

  static getEntityList(src, type) {
    return DataSource.sources[type].getEntityList(src); //Returns a promise
  }

  static getEntityData(src, type, entity) {
    return DataSource.sources[type].getEntityData(src, entity);
  }
}
DataSource.sourceTypes = {
  Odata: 0,
};
DataSource.sources = {
  [DataSource.sourceTypes.Odata]: Odata,
};

const entityList = [
  'Categories',
  'CustomerDemographics',
  'Customers',
  'Employees',
  'Order_Details',
  'Orders',
  'Products',
  'Regions',
  'Shippers',
  'Suppliers',
  'Territories',
  'Alphabetical_list_of_products',
  'Category_Sales_for_1997',
  'Current_Product_Lists',
  'Customer_and_Suppliers_by_Cities',
  'Invoices',
  'Order_Details_Extendeds',
  'Order_Subtotals',
  'Orders_Qries',
  'Product_Sales_for_1997',
  'Products_Above_Average_Prices',
  'Products_by_Categories',
  'Sales_by_Categories',
  'Sales_Totals_by_Amounts',
  'Summary_of_Sales_by_Quarters',
  'Summary_of_Sales_by_Years',
];

module.exports = DataSource;
