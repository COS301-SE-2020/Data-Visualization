/**
 * @file sample.test.js
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
 * Functional Description: This file implements a sample test, to see if adding the numbers 1 to 2 is 3.
 *
 * Error Messages: "Error"
 * Assumptions: None.
 * Constraints: None.
 */
const asum = require('../helpers/sample');

test('adding 1 to 2 is then 3', () => {
    expect(asum(1, 2)).toBe(3);
});