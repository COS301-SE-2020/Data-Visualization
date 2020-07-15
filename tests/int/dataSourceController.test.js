/**
 * @jest-environment node
 */
const { DataSource } = require('../../controllers/controllers');

describe('Testing functions that retrieve data from an Odata source', () => {
	const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
	const entity = 'Products';

	test('Function that retrieves the entity list as JSON from a given Data Source', () => {
		return DataSource.getEntityList(sourceUrl).then((list) => {
			expect(list).toMatchSnapshot();
		});
	});

	test('Function that retrieves the metadata XML file for a given Odata source', () => {
		return DataSource.getMetaData(sourceUrl).then((xmlString) => {
			expect(xmlString).toMatchSnapshot();
		});
	});

	test('Function that retrieves entity-data as JSON from a given Odata source entity-url', () => {
		return DataSource.getEntityData(sourceUrl, entity).then((data) => {
			expect(data).toMatchSnapshot();
		});
	});
});
