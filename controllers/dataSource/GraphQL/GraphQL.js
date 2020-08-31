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
 * Functional Description: This file implements a GraphQL class that gets GraphQL and formats this data
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const axios = require('axios');
// const PRODUCTION = !!(process.env.NODE_ENV && process.env.NODE_ENV === 'production');
/**
 * Purpose: This class is responsible for getting GraphQL.
 * Usage Instructions: Use the corresponding getters to retrieve class variables. And use the format to format this GraphQL
 * @author Phillip Schulze
 */
class GraphQL {
	/**
	 * This function gets GraphQL.
	 * @param src the source where this GraphQL must be retrieved from
	 * @returns a promise of GraphQL
	 */
	static getMetaData(src) {
		if (GraphQL.logging) console.log('GraphQL: ', src);
		return new Promise((resolve, reject) => {
			axios
				.post(src, GraphQL.query(GraphQL.metadataStr()))
				.then((res) => {
					const { __schema: schema } = res.data.data;
					resolve(schema);
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * This function gets entity data.
	 * @param src the source where the entity data must be retrieved from
	 * @param entity the entity that we want data from
	 * @returns a promise of the entities data
	 */
	static getEntityData(src, entity) {
		if (GraphQL.logging) console.log('GraphQL: ', GraphQL.formatEntity(src, entity));
		return new Promise((resolve, reject) => {
			axios
				.get(GraphQL.formatEntity(src, entity))
				.then((res) => {
					const { results } = res.data.d;
					resolve(results);
				})
				.catch((err) => reject(err));
		});
	}

	static prunseMetaNullTypes(meta) {
		if (meta && meta.types && Array.isArray(meta.types)) {
			for (let t = 0; t < meta.types.length; t++) {
				if (meta.types[t] && meta.types[t].fields && Array.isArray(meta.types[t].fields)) {
					for (let i = 0; i < meta.types[t].fields.length; ++i) {
						if (meta.types[t].fields[i] && meta.types[t].fields[i].type) {
							while (typeof meta.types[t].fields[i].type.name !== 'undefined' && meta.types[t].fields[i].type.name == null) {
								meta.types[t].fields[i].type = meta.types[t].fields[i].type.ofType;
							}
							delete meta.types[t].fields[i].type.ofType;
						}
					}
				}
			}
		}

		return meta;
	}

	/*
	"fields": [{
              "name": "users",
              "type": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "LIST",
                  "name": null,
                  "ofType": {
                    "kind": "NON_NULL",
                    "name": null,
                    "ofType": {
                      "kind": "OBJECT",
                      "name": "users",
                      "ofType": null
                    }
                  }
                }
              }
            }]
	*/

	/**
	 * This function parses the metadata which is received in XML format and passes it to the suggester
	 * so it knows what it can suggest. It passes the properties(treated as terminal nodes) and the
	 * navigation properties(so it can go to deeper layers) via the setMetadata function.
	 * @param xmlData the metadata in XML format.
	 * @returns an object containing the parsed items and associated tables as well as the item sets and data-types in each "table"
	 */
	static parseMetadata(meta) {
		if (!meta || meta == null) return null; //eslint-disable-line
		meta = GraphQL.prunseMetaNullTypes(meta);

		let entityMap = {};
		meta.types.forEach((type) => (entityMap[type.name] = type));

		const pruneNames = ['Query', '__Schema', '__Type', '__Field', '__InputValue', '__EnumValue', '__Directive'];
		let sets = meta.types.filter((type) => type.kind === 'OBJECT' && !pruneNames.includes(type.name)).map((type) => type.name);

		let items = {};
		let associations = {}; //associated tables - used in suggestion generation
		let types = {}; //the data types of the fields

		sets.forEach((entity) => {
			items[entity] = entityMap[entity].fields.map((field) => field.name);
			types[entity] = entityMap[entity].fields.map((field) => field.type.name);
		});

		sets.forEach((entity) => {
			associations[entity] = entityMap[entity].fields.filter((field) => field.type.kind === 'OBJECT').map((field) => field.name);
		});

		return { items, associations, sets, types };
	}

	static query(strQuery) {
		return { query: strQuery };
	}

	static metadataStr() {
		return GraphQL.fragmentFullType() + GraphQL.fragmentInputValue() + GraphQL.fragmentTypeRef() + GraphQL.queryIntrospection();
	}

	static fragmentFullType() {
		return `
		fragment FullType on __Type {
			kind name
			fields{ name args { ...InputValue } type { ...TypeRef } }
			enumValues { name }
			possibleTypes { ...TypeRef }
		}
		`;
	}

	static fragmentInputValue() {
		return 'fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue }';
	}

	static fragmentTypeRef(lvls = 8) {
		const fields = 'kind name';
		const min = 1;
		if (lvls < min) lvls = min;
		let str = fields;
		for (let i = min; i < lvls; ++i) str = fields + ' ofType { ' + str + ' }';
		return 'fragment TypeRef on __Type { ' + str + '}';
	}

	static queryIntrospection() {
		return `  
		  query IntrospectionQuery {
			__schema {
			  types {
				...FullType
			  }
			}
		  }
		`;
	}
}
GraphQL.logging = false;

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
};

module.exports = GraphQL;
