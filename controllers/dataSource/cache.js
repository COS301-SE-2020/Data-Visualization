/**
 * @file  cache.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 06/08/2020   Phillip Schulze     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a cache using the singleton pattern. This cache stores data the was previously
 * requested from external data sources, and thus can be accessed in the future without making additional requests to external sources.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

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
			if (this.entityData && this.entityData[src] && this.entityData[src][entity] && this.entityData[src][entity].data && Object.keys(this.entityData[src][entity].data).length > 0) {
				const data = this.entityData[src][entity].data;

				const prim = this.metaData[src].data.prims[entity];
				const res = data.map((item, i) => [item[prim], item[field]]);

				return res;
			}
			return null;
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
		 * @return {Cache} an object that stores data from previous requests.
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

const TEMP = {
	items: {
		Category: ['CategoryID', 'CategoryName', 'Description', 'Picture'],
		CustomerDemographic: ['CustomerTypeID', 'CustomerDesc'],
		Customer: ['CustomerID', 'CompanyName', 'ContactName', 'ContactTitle', 'Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone', 'Fax'],
		Employee: [
			'EmployeeID',
			'LastName',
			'FirstName',
			'Title',
			'TitleOfCourtesy',
			'BirthDate',
			'HireDate',
			'Address',
			'City',
			'Region',
			'PostalCode',
			'Country',
			'HomePhone',
			'Extension',
			'Photo',
			'Notes',
			'ReportsTo',
			'PhotoPath',
		],
		Order_Detail: ['OrderID', 'ProductID', 'UnitPrice', 'Quantity', 'Discount'],
		Order: [
			'OrderID',
			'CustomerID',
			'EmployeeID',
			'OrderDate',
			'RequiredDate',
			'ShippedDate',
			'ShipVia',
			'Freight',
			'ShipName',
			'ShipAddress',
			'ShipCity',
			'ShipRegion',
			'ShipPostalCode',
			'ShipCountry',
		],
		Product: ['ProductID', 'ProductName', 'SupplierID', 'CategoryID', 'QuantityPerUnit', 'UnitPrice', 'UnitsInStock', 'UnitsOnOrder', 'ReorderLevel', 'Discontinued'],
		Region: ['RegionID', 'RegionDescription'],
		Shipper: ['ShipperID', 'CompanyName', 'Phone'],
		Supplier: ['SupplierID', 'CompanyName', 'ContactName', 'ContactTitle', 'Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone', 'Fax', 'HomePage'],
		Territory: ['TerritoryID', 'TerritoryDescription', 'RegionID'],
		Alphabetical_list_of_product: [
			'ProductID',
			'ProductName',
			'SupplierID',
			'CategoryID',
			'QuantityPerUnit',
			'UnitPrice',
			'UnitsInStock',
			'UnitsOnOrder',
			'ReorderLevel',
			'Discontinued',
			'CategoryName',
		],
		Category_Sales_for_1997: ['CategoryName', 'CategorySales'],
		Current_Product_List: ['ProductID', 'ProductName'],
		Customer_and_Suppliers_by_City: ['City', 'CompanyName', 'ContactName', 'Relationship'],
		Invoice: [
			'ShipName',
			'ShipAddress',
			'ShipCity',
			'ShipRegion',
			'ShipPostalCode',
			'ShipCountry',
			'CustomerID',
			'CustomerName',
			'Address',
			'City',
			'Region',
			'PostalCode',
			'Country',
			'Salesperson',
			'OrderID',
			'OrderDate',
			'RequiredDate',
			'ShippedDate',
			'ShipperName',
			'ProductID',
			'ProductName',
			'UnitPrice',
			'Quantity',
			'Discount',
			'ExtendedPrice',
			'Freight',
		],
		Order_Details_Extended: ['OrderID', 'ProductID', 'ProductName', 'UnitPrice', 'Quantity', 'Discount', 'ExtendedPrice'],
		Order_Subtotal: ['OrderID', 'Subtotal'],
		Orders_Qry: [
			'OrderID',
			'CustomerID',
			'EmployeeID',
			'OrderDate',
			'RequiredDate',
			'ShippedDate',
			'ShipVia',
			'Freight',
			'ShipName',
			'ShipAddress',
			'ShipCity',
			'ShipRegion',
			'ShipPostalCode',
			'ShipCountry',
			'CompanyName',
			'Address',
			'City',
			'Region',
			'PostalCode',
			'Country',
		],
		Product_Sales_for_1997: ['CategoryName', 'ProductName', 'ProductSales'],
		Products_Above_Average_Price: ['ProductName', 'UnitPrice'],
		Products_by_Category: ['CategoryName', 'ProductName', 'QuantityPerUnit', 'UnitsInStock', 'Discontinued'],
		Sales_by_Category: ['CategoryID', 'CategoryName', 'ProductName', 'ProductSales'],
		Sales_Totals_by_Amount: ['SaleAmount', 'OrderID', 'CompanyName', 'ShippedDate'],
		Summary_of_Sales_by_Quarter: ['ShippedDate', 'OrderID', 'Subtotal'],
		Summary_of_Sales_by_Year: ['ShippedDate', 'OrderID', 'Subtotal'],
	},
	associations: {
		Category: ['Products'],
		CustomerDemographic: ['Customers'],
		Customer: ['Orders', 'CustomerDemographics'],
		Employee: ['Employees1', 'Employee1', 'Orders', 'Territories'],
		Order_Detail: ['Order', 'Product'],
		Order: ['Customer', 'Employee', 'Order_Details', 'Shipper'],
		Product: ['Category', 'Order_Details', 'Supplier'],
		Region: ['Territories'],
		Shipper: ['Orders'],
		Supplier: ['Products'],
		Territory: ['Region', 'Employees'],
		Alphabetical_list_of_product: [],
		Category_Sales_for_1997: [],
		Current_Product_List: [],
		Customer_and_Suppliers_by_City: [],
		Invoice: [],
		Order_Details_Extended: [],
		Order_Subtotal: [],
		Orders_Qry: [],
		Product_Sales_for_1997: [],
		Products_Above_Average_Price: [],
		Products_by_Category: [],
		Sales_by_Category: [],
		Sales_Totals_by_Amount: [],
		Summary_of_Sales_by_Quarter: [],
		Summary_of_Sales_by_Year: [],
	},
	sets: [
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
	],
	types: {
		Category: ['Edm.Int32', 'Edm.String', 'Edm.String', 'Edm.Binary'],
		CustomerDemographic: ['Edm.String', 'Edm.String'],
		Customer: ['Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String'],
		Employee: [
			'Edm.Int32',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.Binary',
			'Edm.String',
			'Edm.Int32',
			'Edm.String',
		],
		Order_Detail: ['Edm.Int32', 'Edm.Int32', 'Edm.Decimal', 'Edm.Int16', 'Edm.Single'],
		Order: [
			'Edm.Int32',
			'Edm.String',
			'Edm.Int32',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.Int32',
			'Edm.Decimal',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
		],
		Product: ['Edm.Int32', 'Edm.String', 'Edm.Int32', 'Edm.Int32', 'Edm.String', 'Edm.Decimal', 'Edm.Int16', 'Edm.Int16', 'Edm.Int16', 'Edm.Boolean'],
		Region: ['Edm.Int32', 'Edm.String'],
		Shipper: ['Edm.Int32', 'Edm.String', 'Edm.String'],
		Supplier: ['Edm.Int32', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String', 'Edm.String'],
		Territory: ['Edm.String', 'Edm.String', 'Edm.Int32'],
		Alphabetical_list_of_product: ['Edm.Int32', 'Edm.String', 'Edm.Int32', 'Edm.Int32', 'Edm.String', 'Edm.Decimal', 'Edm.Int16', 'Edm.Int16', 'Edm.Int16', 'Edm.Boolean', 'Edm.String'],
		Category_Sales_for_1997: ['Edm.String', 'Edm.Decimal'],
		Current_Product_List: ['Edm.Int32', 'Edm.String'],
		Customer_and_Suppliers_by_City: ['Edm.String', 'Edm.String', 'Edm.String', 'Edm.String'],
		Invoice: [
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.Int32',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.String',
			'Edm.Int32',
			'Edm.String',
			'Edm.Decimal',
			'Edm.Int16',
			'Edm.Single',
			'Edm.Decimal',
			'Edm.Decimal',
		],
		Order_Details_Extended: ['Edm.Int32', 'Edm.Int32', 'Edm.String', 'Edm.Decimal', 'Edm.Int16', 'Edm.Single', 'Edm.Decimal'],
		Order_Subtotal: ['Edm.Int32', 'Edm.Decimal'],
		Orders_Qry: [
			'Edm.Int32',
			'Edm.String',
			'Edm.Int32',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.DateTime',
			'Edm.Int32',
			'Edm.Decimal',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
			'Edm.String',
		],
		Product_Sales_for_1997: ['Edm.String', 'Edm.String', 'Edm.Decimal'],
		Products_Above_Average_Price: ['Edm.String', 'Edm.Decimal'],
		Products_by_Category: ['Edm.String', 'Edm.String', 'Edm.String', 'Edm.Int16', 'Edm.Boolean'],
		Sales_by_Category: ['Edm.Int32', 'Edm.String', 'Edm.String', 'Edm.Decimal'],
		Sales_Totals_by_Amount: ['Edm.Decimal', 'Edm.Int32', 'Edm.String', 'Edm.DateTime'],
		Summary_of_Sales_by_Quarter: ['Edm.DateTime', 'Edm.Int32', 'Edm.Decimal'],
		Summary_of_Sales_by_Year: ['Edm.DateTime', 'Edm.Int32', 'Edm.Decimal'],
	},
	prims: {
		Category: 'CategoryID',
		CustomerDemographic: 'CustomerTypeID',
		Customer: 'CustomerID',
		Employee: 'EmployeeID',
		Order_Detail: 'OrderID',
		Order: 'OrderID',
		Product: 'ProductID',
		Region: 'RegionID',
		Shipper: 'ShipperID',
		Supplier: 'SupplierID',
		Territory: 'TerritoryID',
		Alphabetical_list_of_product: 'ProductID',
		Category_Sales_for_1997: 'CategoryName',
		Current_Product_List: 'ProductID',
		Customer_and_Suppliers_by_City: 'CompanyName',
		Invoice: 'CustomerName',
		Order_Details_Extended: 'OrderID',
		Order_Subtotal: 'OrderID',
		Orders_Qry: 'OrderID',
		Product_Sales_for_1997: 'CategoryName',
		Products_Above_Average_Price: 'ProductName',
		Products_by_Category: 'CategoryName',
		Sales_by_Category: 'CategoryID',
		Sales_Totals_by_Amount: 'OrderID',
		Summary_of_Sales_by_Quarter: 'OrderID',
		Summary_of_Sales_by_Year: 'OrderID',
	},
};
