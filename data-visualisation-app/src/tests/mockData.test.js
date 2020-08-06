/**
 * @file mockData.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 15/07/2020   Phillip Schulze    Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a test, to see if the mock data is returned properly.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
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
