/**
 * @file forecaster.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 2/07/2020    Phillip Schulze     Original (14 Sept)
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

class Forecaster {
	static predict(dataset, count) {
		// console.log(dataset);

		return new Promise((resolve, reject) => {
			axios
				.post(Forecaster.remote, Forecaster.query(dataset, count))
				.then((res) => {
					const { forecast } = res.data;
					resolve(forecast);
				})
				.catch((err) => reject(err));
		});
	}

	static query(dataset, forecastCount) {
		return {
			series: dataset,
			count: forecastCount,
		};
	}
}
Forecaster.logging = false;
Forecaster.remote = 'https://trendapi.org/forecast';

module.exports = Forecaster;
