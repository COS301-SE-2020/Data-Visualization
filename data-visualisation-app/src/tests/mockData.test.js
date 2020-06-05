import { MockDataSources, MockAPIresponseTime } from '../helpers/mockData';

test('Returns List of mock data-sources', () => {
    expect(MockDataSources()).toEqual([
        'Source A',
        'Source B',
        'Source C',
        'Source D',
    ]);
});

test('Returns a integer value representing a mock network response delay', () => {
    expect(MockAPIresponseTime()).toBe(1500);
});
