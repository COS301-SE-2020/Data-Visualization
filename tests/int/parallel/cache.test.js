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
 * 17/08/2020   Phillip Schulze     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a unit test to see if the networking cache is working properly.
 * This test executes some commands to see if the commands are executed properly, if an error does occur it will stop execution, if it
 * was successful then the test would complete and success would occur.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
const Cache = require('../../../controllers/dataSource/cache');
const Odata = require('../../../controllers/dataSource/Odata');

const MAX_TIME = 10; //ms
const DEFAULT_MAX_TIME = Cache.maxTime;
const SRC_URL = 'https://services.odata.org/V2/Northwind/Northwind.svc';
const SRC_ENTITY = 'Products';
const SRC_FIELD = 'UnitPrice';
const SRC_FIELD_PRIM = 'ProductID';

describe('Testing Meta Data storage functionality', () => {
	let META = null;

	beforeAll((done) => {
		return Odata.getMetaData(SRC_URL)
			.then((data) => (META = Odata.parseODataMetadata(data)))
			.finally(() => done());
	});

	afterAll((done) => {
		Cache.removeMetaData(SRC_URL);
		done();
	});

	afterEach((done) => {
		Cache.maxTime = DEFAULT_MAX_TIME;
		done();
	});

	test('Testing the validation of metadata on an empty cache', () => {
		expect(Cache.validateMetadata(SRC_URL)).not.toBeTruthy();
	});

	test('Testing when storing the Meta Data of a Data Source', () => {
		Cache.setMetaData(SRC_URL, META);
		expect(Cache.validateMetadata(SRC_URL)).toBeTruthy();
		const meta = Cache.getMetaData(SRC_URL);
		expect(meta).toMatchObject(META);
	});

	test('Testing when retrieving valid Meta Data from the Cache', () => {
		expect(Cache.validateMetadata(SRC_URL)).toBeTruthy();
		const meta = Cache.getMetaData(SRC_URL);
		expect(meta).toMatchObject(META);
	});

	test('Testing when storing the Entity List of a Data Source', () => {
		Cache.setMetaData(SRC_URL, META);
		expect(Cache.validateMetadata(SRC_URL)).toBeTruthy();
		const list = Cache.getEntityList(SRC_URL);
		expect(list).toMatchObject(META.items);
	});

	test('Testing when retrieving valid Entity List from the Cache', () => {
		expect(Cache.validateMetadata(SRC_URL)).toBeTruthy();
		const list = Cache.getEntityList(SRC_URL);
		expect(list).toMatchObject(META.items);
	});

	test('Testing when retrieving expired Meta Data from the Cache', () => {
		Cache.maxTime = MAX_TIME;
		return Promise.all([
			//new Promise((resolve) => setTimeout(() => resolve(Cache.validateMetadata(SRC_URL)), 1)),
			new Promise((resolve) => setTimeout(() => resolve(Cache.validateMetadata(SRC_URL)), MAX_TIME * 2)),
		]).then((values) => {
			//expect(values[0]).toBeTruthy();
			expect(values[1]).not.toBeTruthy();
		});
	});

	test('Testing when removing Meta Data stored in the Cache', () => {
		Cache.setMetaData(SRC_URL, META);
		expect(Cache.validateMetadata(SRC_URL)).toBeTruthy();
		Cache.removeMetaData(SRC_URL);
		expect(Cache.validateMetadata(SRC_URL)).not.toBeTruthy();
	});
});

describe('Testing Meta Data storage functionality', () => {
	let DATA = null;
	let TEST_DATA = null;

	beforeAll((done) => {
		return Odata.getEntityData(SRC_URL, SRC_ENTITY)
			.then((data) => {
				DATA = data;
				TEST_DATA = DATA.map((item, i) => [item[SRC_FIELD_PRIM], item[SRC_FIELD]]);
			})
			.finally(() => done());
	});

	afterAll((done) => {
		Cache.removeEntityData(SRC_URL, SRC_ENTITY);
		done();
	});

	afterEach((done) => {
		Cache.maxTime = DEFAULT_MAX_TIME;
		done();
	});

	test('Testing the validation of Entity Data on an empty cache', () => {
		expect(Cache.validateEntityData(SRC_URL, SRC_ENTITY)).not.toBeTruthy();
	});

	test('Testing when storing the Entity Data of a Data Source', () => {
		Cache.setEntityData(SRC_URL, SRC_ENTITY, DATA);
		expect(Cache.validateEntityData(SRC_URL, SRC_ENTITY)).toBeTruthy();
		const data = Cache.getEntityData(SRC_URL, SRC_ENTITY, SRC_FIELD);
		expect(data).toMatchObject(TEST_DATA);
	});

	test('Testing when retrieving valid Entity Data from the Cache', () => {
		expect(Cache.validateEntityData(SRC_URL, SRC_ENTITY)).toBeTruthy();
		const data = Cache.getEntityData(SRC_URL, SRC_ENTITY, SRC_FIELD);
		expect(data).toMatchObject(TEST_DATA);
	});

	test('Testing when retrieving expired Entity Data from the Cache', () => {
		Cache.maxTime = MAX_TIME;
		return Promise.all([
			//new Promise((resolve) => setTimeout(() => resolve(Cache.validateEntityData(SRC_URL, SRC_ENTITY)), 1)),
			new Promise((resolve) => setTimeout(() => resolve(Cache.validateEntityData(SRC_URL, SRC_ENTITY)), MAX_TIME * 2)),
		]).then((values) => {
			//expect(values[0]).toBeTruthy();
			expect(values[1]).not.toBeTruthy();
		});
	});

	test('Testing when removing Entity Data stored in the Cache', () => {
		Cache.setEntityData(SRC_URL, SRC_ENTITY, DATA);
		expect(Cache.validateEntityData(SRC_URL, SRC_ENTITY)).toBeTruthy();
		Cache.removeEntityData(SRC_URL, SRC_ENTITY);
		expect(Cache.validateEntityData(SRC_URL, SRC_ENTITY)).not.toBeTruthy();
	});
});

afterAll((done) => {
	Cache.maxTime = DEFAULT_MAX_TIME;
	Cache.removeMetaData(SRC_URL);
	Cache.removeEntityData(SRC_URL, SRC_ENTITY);
	done();
});
