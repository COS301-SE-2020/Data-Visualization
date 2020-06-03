import { requestDataSourceList } from '../network';
import { MockDataSources, MockAPIresponseTime } from '../mock-data';

test('Requests a list of Data Sources from API', async () => {
  expect(await requestDataSourceList()).toEqual(MockDataSources());
});
