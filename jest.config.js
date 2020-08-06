/**
 * @file jest.config.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 29/06/2020   Phillip Schulze     Original
 * 30/06/2020   Phillip Schulze     Added more root modules
 *
 * Test Cases: none
 *
 * Functional Description: This file just configures jest to use it for testing.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
module.exports = {
	verbose: true,
	modulePathIgnorePatterns: ['data-visualisation-app'],
	setupFilesAfterEnv: ['./jest.setup.js'],
	testEnvironment: 'node',
};
