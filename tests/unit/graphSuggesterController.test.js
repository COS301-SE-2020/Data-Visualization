/**
 * @file graphSuggesterController.test.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -------------------------------------------------------------------------------
 * 06/08/2020   Marco Lombaard     Original
 * 14/09/2020   Marco Lombaard     Added test for addSeriesData
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a unit test to see if the suggester controller component is working properly.
 * This file calls a few functions in the suggester component to test their functionality
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
require('../../controllers/graphSuggester/graphSuggesterAI/graphSuggesterAI');
const graphSuggesterController = require('../../controllers/graphSuggester/graphSuggesterController/graphSuggesterController');
const chart = {
	'title': {
		'text': 'Summary_of_Sales_by_Year: Subtotal'
	},
	'dataset': {
		'source': [
			[
				'ShippedDate',
				'value'
			],
			[
				'Wed Jul 10 1996',
				440
			],
			[
				'Thu Jul 11 1996',
				1863.4
			],
			[
				'Fri Jul 12 1996',
				1552.6
			],
			[
				'Mon Jul 15 1996',
				4251.96
			],
			[
				'Tue Jul 16 1996',
				2001.42
			],
			[
				'Wed Jul 17 1996',
				2490.5
			],
			[
				'Mon Jul 22 1996',
				517.8
			],
			[
				'Tue Jul 23 1996',
				2734.78
			],
			[
				'Thu Jul 25 1996',
				1605.45
			],
			[
				'Mon Jul 29 1996',
				448
			],
			[
				'Tue Jul 30 1996',
				584
			],
			[
				'Wed Jul 31 1996',
				2569.43
			],
			[
				'Fri Aug 02 1996',
				1522.56
			],
			[
				'Tue Aug 06 1996',
				4637.8
			],
			[
				'Fri Aug 09 1996',
				2018.2
			],
			[
				'Mon Aug 12 1996',
				1504
			],
			[
				'Tue Aug 13 1996',
				2037.28
			],
			[
				'Wed Aug 14 1996',
				538.6
			],
			[
				'Fri Aug 16 1996',
				1912.6399999999999
			],
			[
				'Wed Aug 21 1996',
				1839.8
			],
			[
				'Fri Aug 23 1996',
				699.7
			],
			[
				'Mon Aug 26 1996',
				155.4
			],
			[
				'Tue Aug 27 1996',
				1414.8
			],
			[
				'Wed Aug 28 1996',
				2913.74
			],
			[
				'Fri Aug 30 1996',
				3835
			],
			[
				'Mon Sep 02 1996',
				80.1
			],
			[
				'Tue Sep 03 1996',
				2648.4
			],
			[
				'Wed Sep 04 1996',
				497.52
			],
			[
				'Thu Sep 05 1996',
				1296
			],
			[
				'Tue Sep 10 1996',
				2736.3
			],
			[
				'Wed Sep 11 1996',
				2592.2
			],
			[
				'Thu Sep 12 1996',
				2645
			],
			[
				'Fri Sep 13 1996',
				349.5
			],
			[
				'Tue Sep 17 1996',
				1363
			],
		]
	},
	'series': [
		{
			'type': 'line',
			'encode': {
				'x': 'ShippedDate',
				'y': 'value'
			}
		},
	],
	'xAxis': {
		'type': 'category',
		'name': 'ShippedDate',
		'nameLocation': 'center',
		'nameGap': 90,
		'nameTextStyle': {
			'fontSize': 15
		},
		'axisLabel': {
			'rotate': 330,
			'padding': [
				20,
				0,
				0,
				-20
			]
		},
		'grid': {
			'bottom': 110
		}
	},
	'yAxis': {
		'show': true
	},
	'tooltip': {
		'trigger': 'axis',
		'formatter': '{c}',
		'axisPointer': {
			'type': 'line'
		}
	}
};

const data = [
	[ '2018-01-20', 86.9183 ],
	[ '2018-01-21', 85.4605 ],
	[ '2018-01-22', 84.0028 ],
	[ '2018-01-23', 82.5451 ],
];

describe('Testing functions in the graphSuggesterController class', function () {
	test('Returns a null suggestion on null call to getSuggestion', () => {
		expect(graphSuggesterController.getSuggestions(null)).toBeNull();
	});

	test('Returns true when setting fitness chart to null', () => {
		expect(graphSuggesterController.setFittestEChart(null)).toBe(true);
	});

	test('Returns null when an invalid entity is requested for suggestions', () => {
		expect(graphSuggesterController.getSuggestions('Red')).toBeNull();
	});

	test('Successfully adds a series to an existing suggestion', () => {
		let compared = chart;
		let suggestion = graphSuggesterController.addSeriesData(compared, { data });
		console.log(compared);
		chart.series.push({
			type: 'line',
			data: data,
		});

		expect(suggestion).toMatchObject(chart);
	});
});