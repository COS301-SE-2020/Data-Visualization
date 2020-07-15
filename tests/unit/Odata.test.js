const rewire = require('rewire');
const Odata = rewire('../../controllers/dataSource/Odata.js');
const format = Odata.__get__('format');
const formatEntity = Odata.__get__('formatEntity');
const formatMetaData = Odata.__get__('formatMetaData');

const sourceUrl = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const entity = 'Products';
const sourceUrlJson = 'https://services.odata.org/V2/Northwind/Northwind.svc/?$format=json';
const sourceUrlEntity = 'https://services.odata.org/V2/Northwind/Northwind.svc/Products/?$format=json';
const sourceUrlMetaData = 'https://services.odata.org/V2/Northwind/Northwind.svc/$metadata';

describe('Testing different Odata url formatting functions', () => {
	test('Converts the Odata url to output JSON instead of XML', () => {
		expect(format(sourceUrl)).toBe(sourceUrlJson);
	});

	test('converts the Odata and entity to entity-url that outputs JSON instead of XML', () => {
		expect(formatEntity(sourceUrl, entity)).toBe(sourceUrlEntity);
	});

	test('converts the Odata url to odata-metada url', () => {
		expect(formatMetaData(sourceUrl)).toBe(sourceUrlMetaData);
	});
});
