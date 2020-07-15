/**
 * @file dataSourceController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 2/07/2020    Phillip Schulze     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a data source that handles any data source requests.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const Odata = require('./Odata');
/**
 * Purpose: This class is responsible for getting DataSources.
 * Usage Instructions: Use the corresponding getters to retrieve class variables.
 * Class functionality should be accessed through restController.js.
 * @author Phillip Schulze
 */
class DataSource {
  /**
   * This function gets Odata.
   * @param src the source where this Odata must be retrieved from
   * @returns a promise of Odata
   */
  static getMetaData(src) {
    return Odata.getMetaData(src); //Returns a promise
  }
  /**
   * This function gets an entity list.
   * @param src the source where this entity list must be retrieved from
   * @returns a promise of the entity list
   */
  static getEntityList(src) {
    return Odata.getEntityList(src); //Returns a promise
  }
  /**
   * This function gets entity data.
   * @param src the source where the entity data must be retrieved from
   * @param entity the entity that we want data from
   * @returns a promise of the entities data
   */
  static getEntityData(src, entity) {
    return Odata.getEntityData(src, entity);
  }
}

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
