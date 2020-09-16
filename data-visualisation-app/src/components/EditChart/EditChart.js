/**
 *   @file EditChart.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/8/2020    Gian Uys           Original
 *   10/8/2020    Gian Uys          Added support for scatter and line charts.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, {useEffect, useState, useRef, usePagination} from 'react';
import {
    Collapse,
    Input,
    Checkbox,
    Button,
    InputNumber,
    Space,
    message,
    Dropdown,
    Menu,
    Cascader,
    Divider,
    Form, Tabs
} from 'antd';
import './EditChart.scss';
import ReactEcharts from 'echarts-for-react';
import * as constants from '../../globals/constants';
import Box from '@material-ui/core/Box';
import { useTable } from 'react-table';
import InputColor from 'react-input-color';
import request from '../../globals/requests';
import Grid from '@material-ui/core/Grid';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useUndo from 'use-undo';
import {EDITCHART_MODES} from '../../globals/constants';
import { Wizard, useWizardStep } from 'react-wizard-primitive';
import {PieChart} from '@styled-icons/feather/PieChart';
import {BarChart} from '@styled-icons/feather/BarChart';
import {ScatterPlot} from '@styled-icons/material-rounded/ScatterPlot';
import {LineChart} from '@styled-icons/boxicons-regular/LineChart';


/**
 *   @brief Component to edit charts data and metadata.
 *   @param props React property with options passed as child that is the options of the chart to be edited.
 */
function EditChart(props) {

    // const [chartOptions, setChartOptions] = useState(props.options);
    const [renderAxisTable, setRenderAxisTable] = useState(false);
    const [columnsAxisCaptions, setColumnsAxisCaptions] = useState([{
        Header: 'Axis',
        accessor: 'axis'
    }
    ]);
    const [dataAxisCaptions, setDataAxisCaptions] = useState([]);
    const columns = useRef([{
        Header: 'Name',
        columns: [{
            Header: 'Series',
            accessor: 'series',
        }, {
            Header: 'Dimension',
            accessor: 'dimension',
        }
        ]}, {
        Header: 'Data',
        columns: [
        ]
    },
    ]);
    const [data, setData] = useState([]);
    const [seriesProperty, setSeriesProperty] = useState([]);
    const [haveChosenChart, setHaveChosenChart] = useState(false);
    const [presetIndex, setPresetIndex] = useState(1);
    const [presetDataReady, setPresetDataReady] = useState(false);
    const [propertyHook, setPropertyHook] = useState([]);


    const prevGridData = useRef({
        grid: [
        ],
    });
    const type = useRef('');
    const optionsBuffer = useRef([]);
    /** Currently mutable buffer index. */
    const currentBuffer = useRef(true);
    const optionsChanges = useRef([]);
    const storedPointers = useRef({});
    const initializedData = useRef(false);
    const presetData = useRef([
        /** Line Charts */
        {
            tabTitle: <span className='chartTabTitle'><LineChart className='chartTabTitle__icon'/> Line</span>,
            charts: [
                {
                    semanticTitle: 'Basic Line Chart',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 820],
                            ['Tue', 932],
                            ['Wed', 901],
                            ['Thu', 934],
                            ['Fri', 1290],
                            ['Sat', 1330],
                            ['Sun', 1320]
                        ]
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        show: false,
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        encode: {x: 'days', y: 'values'},
                        type: 'line'
                    }]
                },
                {
                    semanticTitle: 'Area Line Chart',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 820],
                            ['Tue', 932],
                            ['Wed', 901],
                            ['Thu', 934],
                            ['Fri', 1290],
                            ['Sat', 1330],
                            ['Sun', 1320]
                        ]
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        encode: {x: 'days', y: 'values'},
                        type: 'line',
                        areaStyle: {opacity: 1}
                    }]
                },
                {
                    semanticTitle: 'Smooth Line Chart',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 820],
                            ['Tue', 932],
                            ['Wed', 901],
                            ['Thu', 934],
                            ['Fri', 1290],
                            ['Sat', 1330],
                            ['Sun', 1320]
                        ]
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        encode: {x: 'days', y: 'values'},
                        type: 'line',
                        smooth: true
                    }]
                }
            ]
        },
        /** Bar Charts */
        {
            tabTitle: <span className='chartTabTitle'><BarChart className='chartTabTitle__icon'/> Bar</span>,
            charts: [
                {
                    semanticTitle: 'Basic Bar Chart',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 120],
                            ['Tue', 200],
                            ['Wed', 150],
                            ['Thu', 80],
                            ['Fri', 70],
                            ['Sat', 110],
                            ['Sun', 130]
                        ]
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        encode: {x: 'days', y: 'values'},
                        type: 'bar'
                    }]
                },
                {
                    semanticTitle: 'Basic Background Chart',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 120],
                            ['Tue', 200],
                            ['Wed', 150],
                            ['Thu', 80],
                            ['Fri', 70],
                            ['Sat', 110],
                            ['Sun', 130]
                        ]
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        encode: {x: 'days', y: 'values'},
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    }]
                },
                {
                    semanticTitle: 'Basic Line Chart2',
                    dataset: {
                        source: [
                            ['days', 'values'],
                            ['Mon', 18203],
                            ['Tue', 23489],
                            ['Wed', 29034],
                            ['Thu', 29034],
                            ['Fri', 104970],
                            ['Sat', 110],
                            ['Sun', 630230]
                        ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                }
            ]
        },

        /** Pie Charts */
        {
            tabTitle: <span className='chartTabTitle'><PieChart className='chartTabTitle__icon'/> Pie</span>,
            charts: [
                {
                    semanticTitle: 'Basic Pie Chart',
                    dataset: {
                        source: [
                            ['Animals', 'values'],
                            ['Dolphins', 335],
                            ['Dogs', 310],
                            ['Cats', 234],
                            ['Bats', 135],
                            ['Mouses', 1548],
                            ['Mammals', 110]
                        ]
                    },
                    title: {
                        show: false,
                        text: 'Animals',
                        left: 'center'
                    },
                    tooltip: {
                        show: false,
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        show: false,
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            encode: {
                                itemName: 'Animals',
                                value : 'values'
                            },
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '40%'],
                            itemStyle: {normal: {label: {show: true}, labelLine: {show : false}}},
                            emphasis: {
                                show: true,
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                {
                    semanticTitle: 'Donut Pie Chart',
                    dataset: {
                        source: [
                            ['Animals', 'values'],
                            ['Dolphins', 335],
                            ['Dogs', 310],
                            ['Cats', 234],
                            ['Bats', 135],
                            ['Mouses', 1548],
                            ['Mammals', 110]
                        ]
                    },
                    title: {
                        show: false,
                        text: 'Animals',
                        left: 'center'
                    },
                    tooltip: {
                        show: false,
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        show: false,
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            encode: {
                                itemName: 'Animals',
                                value : 'values'
                            },
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '50%'],
                            center: ['50%', '40%'],
                            itemStyle: {normal: {label: {show: true}, labelLine: {show : false}}},
                            emphasis: {
                                show: true,
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
            ]
        },
        /** Scatter Plot Charts */
        {
            tabTitle: <span className='chartTabTitle'><ScatterPlot className='chartTabTitle__icon'/> Scatter</span>,
            charts: [
                {
                    semanticTitle: 'Basic Line Chart5',
                    xAxis: {},
                    yAxis: {},
                    series: [{
                        symbolSize: 20,
                        data: [
                            [10.0, 8.04],
                            [8.0, 6.95],
                            [13.0, 7.58],
                            [9.0, 8.81],
                            [11.0, 8.33],
                            [14.0, 9.96],
                            [6.0, 7.24],
                            [4.0, 4.26],
                            [12.0, 10.84],
                            [7.0, 4.82],
                            [5.0, 5.68]
                        ],
                        type: 'scatter'
                    }]
                },
                {
                    semanticTitle: 'Basic Line Chart6',
                    xAxis: {
                        scale: true
                    },
                    yAxis: {
                        scale: true
                    },
                    series: [{
                        type: 'effectScatter',
                        symbolSize: 20,
                        data: [
                            [172.7, 105.2],
                            [153.4, 42]
                        ]
                    }, {
                        type: 'scatter',
                        data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                            [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                            [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                            [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                            [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                            [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                            [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                            [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                            [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                            [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                            [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                            [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                            [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                            [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                            [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                            [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                            [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                            [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                            [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                            [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                            [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                            [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                            [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                            [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                            [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                            [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                            [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                            [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                            [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                            [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                            [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                        ],
                    }]
                }
            ]
        }

    ]);

    const [
        currentOptions,
        {
            set: setCurrentOptions,
            reset: resetCurrentOptions,
            undo: undoCurrentOptions,
            redo: redoCurrentOptions,
            canUndo,
            canRedo
        }
    ] = useUndo((props.mode === EDITCHART_MODES.EDIT ? props.options : null));
    const { present: presentCurrentOptions } = currentOptions;
    const matches = useMediaQuery('(max-width:1600px)');

    /** @remark Reserve below code when mouse click and drag functionality is needed. */
    // const [boxStart, setBoxStart] = useState([100, 100]);
    // const [boxSize, setBoxSize] = useState([100, 100]);
    // const boxStartImmediate  = useRef([100, 100]);
    // const boxSizeImmediate  = useRef([100, 100]);
    // const boxStartInitial  = useRef([100, 100]);
    // const moving = useRef(false);

    /**
     *   Event Functions
     */
    // function onMouseDown(event) {
    //     boxStartImmediate.current = [event.clientX, event.clientY];
    //     boxStartInitial.current = [event.clientX, event.clientY];
    //     setBoxStart(boxStartImmediate.current);
    //     moving.current = true;
    // }
    //
    // function onMouseDrag(event) {
    //     if (moving.current) {
    //         if (event.clientX < boxStartInitial.current[0]) {
    //             // change x of boxstart
    //             boxSizeImmediate.current[0] = boxStartInitial.current[0] - event.clientX;
    //             boxStartImmediate.current[0] = event.clientX;
    //         } else {
    //             boxSizeImmediate.current[0] = event.clientX - boxStartInitial.current[0];
    //             boxStartImmediate.current[0] = boxStartInitial.current[0];
    //         }
    //
    //         if (event.clientY < boxStartInitial.current[1]) {
    //             // change y of boxstart
    //             boxSizeImmediate.current[1] = boxStartInitial.current[1] - event.clientY;
    //             boxStartImmediate.current[1] = event.clientY;
    //
    //         } else {
    //             boxSizeImmediate.current[1] = event.clientY - boxStartInitial.current[1];
    //             boxStartImmediate.current[1] = boxStartInitial.current[1];
    //         }
    //         setBoxSize([boxSizeImmediate.current[0], boxSizeImmediate.current[1]]);
    //         setBoxStart(boxStartImmediate.current);
    //     }
    // }
    //
    // function onMouseUp() {
    //     moving.current = false;
    // }

    /**
     *   Helper Functions
     */


    /** Removes all leading zeros and returns the result
     *
     *   @param value String value with leading zeros to be removed
     */
    function removeLeadingZeros(value) {
        while (value.substring(0, 1) === '0') {
            value = value.substring(1);
        }
        return value;
    }

    /** Parses and converts an RGB or RGBA data type into a hexadecimal colour type.
     *
     *   @param value String value that is either of type RBH or RGBA
     */
    function parseRGBToHex(value) {
        if (typeof value === 'undefined' || value === '') {
            return '#c23531';
        } if (value.substring(0, 1) === '#') {
            return value;
        } else if (value.substring(0, 1) === 'r') {
            value = value.substring(value.indexOf('(')+1);
            let num = Number(value.substring(0, value.indexOf(',')));
            let result = '#';
            result += removeLeadingZeros(num.toString(16));
            value = value.substring(value.indexOf(',')+1);
            num = Number(value.substring(0, value.indexOf(',')));
            result += removeLeadingZeros(num.toString(16));

            value = value.substring(value.indexOf(',')+1);
            num = Number(value.substring(0, value.indexOf(',')));
            result += removeLeadingZeros(num.toString(16));

            if (value.indexOf(',') > -1) {
                value = value.substring(value.indexOf(',')+1);
                num = Number(value.substring(0, value.indexOf(',')));
                result += removeLeadingZeros(num.toString(16));

                value = value.substring(0, value.indexOf(')'));
                num = Number(value) * 256;
                result += removeLeadingZeros(num.toString(16));
            } else {
                value = value.substring(0, value.indexOf(')'));
                num = Number(value);
                result += removeLeadingZeros(num.toString(16));
            }
            return result;
        }
    }

    /** Generates data used by front-end components for chart's data manipulation
     */
    function generateData() {

        function dimensionName(dimension) {
            switch(dimension) {
                case 0:
                    return 'X-Axis';
                case 1:
                    return 'Y-Axis';
                default:
                    return 'Dataset ' + dimension.toString();
            }
        }

        function determineDataLength() {
            if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis')) {
                if (optionsBuffer.current[+currentBuffer.current].xAxis.hasOwnProperty('data')) {
                    return optionsBuffer.current[+currentBuffer.current].xAxis.data.length;
                }
            }

            if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
                for (let s = 0; s < optionsBuffer.current[+currentBuffer.current].series.length; s++) {
                    if (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('data')) {
                        return optionsBuffer.current[+currentBuffer.current].series[s].data.length;
                    } else if (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('encode')) {
                        if (optionsBuffer.current[+currentBuffer.current].dataset.hasOwnProperty('source')) {
                            return optionsBuffer.current[+currentBuffer.current].dataset.source.length-1;
                        }
                    }
                }
            }
        }

        function dimensionComponent(dimension) {
            switch(dimension) {
                case 2:
                    return <div className='button__changeColour'>Change Colour</div>;
                case 3:
                    return <Cascader options={[{value: 'line', label: 'Line'}, {value: 'bar', label: 'Bar'}, {value: 'pie', label: 'Pie'}]} onChange={v => {modify(['title', 'left'], v);}} placeholder='Auto'/>;
                default:
                    return 'Dataset ' + dimension.toString();
            }
        }

        // todo: optimize to not recheck things

        // determine char type
        let seriesHasType = -1;
        if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
            for (let i = 0; i < optionsBuffer.current[+currentBuffer.current].series.length; i++) {
                if (optionsBuffer.current[+currentBuffer.current].series[i].hasOwnProperty('type')) {
                    seriesHasType = i;
                    switch(optionsBuffer.current[+currentBuffer.current].series[i].type) {
                        case constants.CHART_TYPES.LINE:
                            type.current = constants.CHART_TYPES.LINE;
                            break;
                        default:
                            type.current = constants.CHART_TYPES.LINE;
                    }

                    break;
                }
            }

            if (seriesHasType !== -1) {
                // determine type manually

                if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis') && optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis')) {
                    // is line chart

                }
            }
        }

        /** Construct data object. */
        prevGridData.current.grid = [];

        let tmp, dataLength = determineDataLength();


        // if (optionsBuffer.current[+currentBuffer.current].series.length > 0 && optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('encode') && optionsBuffer.current[+currentBuffer.current].series[0].encode.hasOwnProperty('itemName'))
        //     columns.current[1].columns.push({Header: 'Value', accessor: 'value'});
        // else
        if (!initializedData.current)
            for (let d = 1; d <= dataLength; d++)
                columns.current[1].columns.push({Header: d.toString(), accessor: d.toString()});

        let keyLookup = [];
        for (let d = 0; d < columns.current.length; d++) {
            if (columns.current[d].hasOwnProperty('accessor')) {
                keyLookup.push(columns.current[d].accessor);
            } else if (columns.current[d].hasOwnProperty('columns')) {
                for (let c = 0; c < columns.current[d].columns.length; c++) {
                    if (columns.current[d].columns[c].hasOwnProperty('accessor'))
                        keyLookup.push(columns.current[d].columns[c].accessor);
                }
            }
        }

        // todo: add xaxis label table
        if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis')) {
            if (optionsBuffer.current[+currentBuffer.current].xAxis.hasOwnProperty('data')) {
                /**
                 *   Add xAxis row to data object.
                 */
                let tempColumns = [{
                    Header: 'Axis',
                    accessor: 'axis'
                }];
                let tempData = [{
                    axis: 'X'
                }];
                // tempData.push({});
                // tempData[tempData.length-1]['axis'] = 'X-Axis';
                for (let i = 0; i < optionsBuffer.current[+currentBuffer.current].xAxis.data.length; i++) {
                    tempColumns.push({
                        Header: 'Caption ' + i,
                        accessor: i.toString()
                    });
                    tempData[0][i.toString()] = optionsBuffer.current[+currentBuffer.current].xAxis.data[i];
                    // prevGridData.current.grid[prevGridData.current.grid.length-1][i.toString()] = optionsBuffer.current[+currentBuffer.current].xAxis.data[i];
                    //, pointers: [optionsBuffer.current[0].xAxis.data, optionsBuffer.current[1].xAxis.data], pointerOffset: i });
                    storedPointers.current['0' + i.toString()] = ['xAxis', 'data', i];
                }
                setColumnsAxisCaptions(tempColumns);
                setDataAxisCaptions(tempData);
                setRenderAxisTable(true);
            }
        }

        if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('dataset')) {


            let isArray = true;
            let isValue = false;

            let newSeriesProperty = [];

            // if (optionsBuffer.current[+currentBuffer.current].series.length > 0 && optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('encode') && optionsBuffer.current[+currentBuffer.current].series[0].encode.hasOwnProperty('x')) {
                let s = 0;
                for (let dimension = 0; dimension < 2; dimension++) {
                    prevGridData.current.grid.push({});
                    tmp = prevGridData.current.grid.length-1;

                    if (dimension === 0) {
                        prevGridData.current.grid[tmp][keyLookup[0]] = 'Series 1';
                        seriesProperty.push({name: 'Series 1'});
                        prevGridData.current.grid[tmp]['rowspan'] = 2;

                        let ECHART_DEFAULT_COLOURS = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

                        if (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('encode') && optionsBuffer.current[+currentBuffer.current].series[0].encode.hasOwnProperty('itemName')) {

                            optionsBuffer.current[+currentBuffer.current].series[0].color = optionsBuffer.current[+currentBuffer.current].dataset.source.filter((data, dataIndex) => {return dataIndex > 0;}).map((data, dataIndex) => {return (ECHART_DEFAULT_COLOURS.length > 1 ? ECHART_DEFAULT_COLOURS.pop() : ECHART_DEFAULT_COLOURS[0]);});
                            optionsBuffer.current[+!currentBuffer.current].series[0].color = optionsBuffer.current[+currentBuffer.current].dataset.source.filter((data, dataIndex) => {return dataIndex > 0;}).map((data, dataIndex) => {return (ECHART_DEFAULT_COLOURS.length > 1 ? ECHART_DEFAULT_COLOURS.pop() : ECHART_DEFAULT_COLOURS[0]);});

                            newSeriesProperty.push({
                                name: optionsBuffer.current[+currentBuffer.current].dataset.source[0][0],
                                label: {
                                    value: optionsBuffer.current[+currentBuffer.current].series[0].name,
                                    directory: ['series', 0, 'name']
                                },
                                color: optionsBuffer.current[+currentBuffer.current].dataset.source.filter((data, dataIndex) => {return dataIndex > 0;}).map((data, dataIndex) => {return {hexvalue: optionsBuffer.current[+!currentBuffer.current].series[0].color[dataIndex], directory: ['series', 0, 'color', dataIndex]};}),
                                type: {
                                    value: optionsBuffer.current[+currentBuffer.current].series[0].type,
                                    directory: ['series', 0, 'type']
                                }
                            });
                        } else {

                            optionsBuffer.current[+currentBuffer.current].series[0].color = '#c23531';
                            newSeriesProperty.push({
                                name: optionsBuffer.current[+currentBuffer.current].dataset.source[0][0],
                                label: {
                                    value: optionsBuffer.current[+currentBuffer.current].series[0].name,
                                    directory: ['series', 0, 'name']
                                },
                                color: {
                                    hexvalue: '#c23531',
                                    directory: ['series', 0, 'color']
                                },
                                type: {
                                    value: optionsBuffer.current[+currentBuffer.current].series[0].type,
                                    directory: ['series', 0, 'type']
                                }
                            });
                        }
                        if (optionsBuffer.current[+currentBuffer.current].series[0].type === 'line') {
                            newSeriesProperty[newSeriesProperty.length-1].areaOption = {
                                directory: ['series', 0, 'areaStyle', 'opacity'],
                                value: optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('areaStyle')
                            };
                            newSeriesProperty[newSeriesProperty.length-1].smooth = {
                                directory: ['series', 0, 'smooth'],
                                value: (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('smooth') ? optionsBuffer.current[+currentBuffer.current].series[0].smooth : false)
                            };
                        } else if (optionsBuffer.current[+currentBuffer.current].series[0].type === 'pie') {

                            console.debug('it isi pie itemStyle')
                            console.debug('optionsBuffer.current[+currentBuffer.current].series[0]', optionsBuffer.current[+currentBuffer.current].series[0])
                            if (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('itemStyle')) {
                                console.debug('fouunnddd itemStyle')
                                if (!optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.hasOwnProperty('normal')) {
                                    optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal = {label: {show: false}};
                                } else if (!optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal.hasOwnProperty('label')) {
                                    optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal.label = {show: false};
                                } else if (!optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal.label.hasOwnProperty('show')) {
                                    optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal.label.show = false;
                                }
                                newSeriesProperty[newSeriesProperty.length-1].itemStyle = {
                                    show: {
                                        directory: ['series', 0, 'itemStyle', 'normal', 'label', 'show'],
                                        value: optionsBuffer.current[+currentBuffer.current].series[0].itemStyle.normal.label.show
                                    }
                                };
                            }
                        }

                        addProperty(optionsBuffer.current[+currentBuffer.current], 'showBackground');
                        addProperty(optionsBuffer.current[+currentBuffer.current], 'backgroundStyle');
                        addProperty(optionsBuffer.current[+!currentBuffer.current], 'showBackground');
                        addProperty(optionsBuffer.current[+!currentBuffer.current], 'backgroundStyle');

                        setPropertyHook([true].concat(propertyHook.filter((a, index) => {return index > 0})));
                        newSeriesProperty[newSeriesProperty.length-1].background = {
                            have: {
                                directory: ['series', 0, 'showBackground'],
                                value: true
                            },
                            directory: ['series', 0, 'backgroundStyle', 'color'],
                            hexvalue: (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('backgroundStyle') && optionsBuffer.current[+currentBuffer.current].series[0].backgroundStyle.hasOwnProperty('color') ? parseRGBToHex(optionsBuffer.current[+currentBuffer.current].series[0].backgroundStyle.color) : ECHART_DEFAULT_COLOURS[0])
                        };
                        console.debug('newSeriesProperty is', newSeriesProperty)
                        setSeriesProperty(newSeriesProperty);
                    }
                    for (let i = 1; i < dataLength+1; i++) {

                        if (i === 1) {
                            prevGridData.current.grid[tmp].dimension = dimensionName(dimension);
                        }

                        prevGridData.current.grid[tmp][keyLookup[i+1]] = (optionsBuffer.current[+currentBuffer.current].dataset.source[i][dimension] == null ? '' : optionsBuffer.current[+currentBuffer.current].dataset.source[i][dimension]);
                        storedPointers.current[tmp + keyLookup[i+1]] = ['dataset', 'source', i, dimension];
                    }
                }
            // }
                // else {
            //     for (let s = 1; s < optionsBuffer.current[+currentBuffer.current].dataset.source.length; s++) {
            //         for (let dimension = 0; dimension < 2; dimension++) {
            //             prevGridData.current.grid.push({});
            //             tmp = prevGridData.current.grid.length - 1;
            //
            //             if (dimension === 0) {
            //                 prevGridData.current.grid[tmp][keyLookup[0]] = 'Series ' + s;
            //                 seriesProperty.push({name: 'Series ' + s});
            //                 prevGridData.current.grid[tmp]['rowspan'] = 2;
            //
            //                 optionsBuffer.current[+currentBuffer.current].series[0].color = '#c23531';
            //
            //                 newSeriesProperty.push({
            //                     name: optionsBuffer.current[+currentBuffer.current].dataset.source[0][0],
            //                     label: {
            //                         value: optionsBuffer.current[+currentBuffer.current].series[0].name,
            //                         directory: ['series', 0, 'name']
            //                     },
            //                     color: {
            //                         hexvalue: '#c23531',
            //                         directory: ['series', 0, 'color']
            //                     },
            //                     type: {
            //                         value: optionsBuffer.current[+currentBuffer.current].series[0].type,
            //                         directory: ['series', 0, 'type']
            //                     }
            //                 });
            //                 setSeriesProperty(newSeriesProperty);
            //             }
            //
            //             prevGridData.current.grid[tmp]['dimension'] = (dimension+1).toString();
            //             prevGridData.current.grid[tmp]['value'] = (optionsBuffer.current[+currentBuffer.current].dataset.source[s][dimension] == null ? 'null' : optionsBuffer.current[+currentBuffer.current].dataset.source[s][dimension]);
            //             storedPointers.current[tmp + 'value'] = ['dataset', 'source', s, dimension];
            //         }
            //     }
            // }

            // isValue = optionsBuffer.current[+currentBuffer.current].series[s].data[0].hasOwnProperty('value');

            // if (Array.isArray(optionsBuffer.current[+currentBuffer.current].series[s].data[0])) {
            // if (!isArray && optionsBuffer.current[+currentBuffer.current].series[s].data[0].hasOwnProperty('value')) {
            //
            // } else
        } else {
            /** Add series rows to data object. */
            if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
                for (let s = 0; s < optionsBuffer.current[+currentBuffer.current].series.length; s++) {
                    if (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('data')) {
                        /** Add data row with "Series..." span over n data dimension. */
                        if (optionsBuffer.current[+currentBuffer.current].series[s].data.length > 0) {
                            let isArray = Array.isArray(optionsBuffer.current[+currentBuffer.current].series[s].data[0]);
                            let isValue = false;
                            if (!isArray)
                                isValue = optionsBuffer.current[+currentBuffer.current].series[s].data[0].hasOwnProperty('value');
                            // if (Array.isArray(optionsBuffer.current[+currentBuffer.current].series[s].data[0])) {
                            // if (!isArray && optionsBuffer.current[+currentBuffer.current].series[s].data[0].hasOwnProperty('value')) {
                            //
                            // } else
                            for (let dimension = 0; dimension < (isArray ? optionsBuffer.current[+currentBuffer.current].series[s].data[0].length : 1); dimension++) {


                                prevGridData.current.grid.push({});
                                tmp = prevGridData.current.grid.length-1;

                                if (dimension === 0) {
                                    prevGridData.current.grid[tmp][keyLookup[0]] = 'Series ' + (s+1).toString();
                                    seriesProperty.push({name: 'Series ' + (s+1).toString()});
                                    prevGridData.current.grid[tmp]['rowspan'] = (isArray ? optionsBuffer.current[+currentBuffer.current].series[s].data[0].length : 1);
                                    /** Construct seriesProperty. */

                                    /** Add color property. */
                                    addProperty(optionsBuffer.current[+currentBuffer.current].series[s], 'itemStyle');
                                    addProperty(optionsBuffer.current[+!currentBuffer.current].series[s], 'itemStyle');
                                    if (!optionsBuffer.current[+currentBuffer.current].series[s].itemStyle.hasOwnProperty('color')) {
                                        addProperty(optionsBuffer.current[+currentBuffer.current].series[s].itemStyle, 'color');
                                        addProperty(optionsBuffer.current[+!currentBuffer.current].series[s].itemStyle, 'color');
                                    }

                                    seriesProperty[seriesProperty.length-1].color = {
                                        hexvalue: parseRGBToHex(optionsBuffer.current[+currentBuffer.current].series[s].itemStyle.color),
                                        directory: ['series', s, 'itemStyle', 'color']
                                    };

                                    /** Add name property. */
                                    seriesProperty[seriesProperty.length-1].label = {
                                        value: (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('name') ? '' : optionsBuffer.current[+currentBuffer.current].series[s].name),
                                        directory: ['series', s, 'name']
                                    };
                                    /** Add type property. */
                                    seriesProperty[seriesProperty.length-1].type = {
                                        value: (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('type') ? optionsBuffer.current[+currentBuffer.current].series[s].type : 'Line'),
                                        directory: ['series', s, 'type']
                                    };
                                }
                                for (let i = 1; i < keyLookup.length; i++) {

                                    if (i === 1) {
                                        prevGridData.current.grid[tmp][keyLookup[i]] = dimensionName(dimension);
                                    } else {
                                        prevGridData.current.grid[tmp][keyLookup[i]] = (isArray ? optionsBuffer.current[+currentBuffer.current].series[s].data[i - (keyLookup.length-dataLength)][dimension] : (isValue ? optionsBuffer.current[+currentBuffer.current].series[s].data[dimension].value : optionsBuffer.current[+currentBuffer.current].series[s].data[i - (keyLookup.length-dataLength)]));
                                        storedPointers.current[tmp + keyLookup[i]] = (isArray ? ['series', s, 'data', i - (keyLookup.length-dataLength), dimension] : (isValue ? ['series', s, 'data', i - (keyLookup.length-dataLength), 'value'] : ['series', s, 'data', i - (keyLookup.length-dataLength)]));
                                    }
                                }
                            }

                            /** @remark Below code still to be integrated. */
                            // } else {
                            // prevGridData.current.grid[tmp][keyLookup[0]] = 'Series ' + (s+1).toString();
                            // for (let i = 0; i < COLUMNS.length + optionsBuffer.current[+currentBuffer.current].series[s].data.length; i++) {
                            //     if (i === 0)
                            //         prevGridData.current.grid[tmp][keyLookup[i]] = 'X-Axis';
                            //     else if (i < COLUMNS.length)
                            //         prevGridData.current.grid[tmp][keyLookup[i]] = '';
                            //     else
                            //         prevGridData.current.grid[tmp][keyLookup[i]] = optionsBuffer.current[+currentBuffer.current].series[s].data[i - COLUMNS.length];
                            //     //, pointers: [optionsBuffer.current[0].series[seriesHasType].data, optionsBuffer.current[1].series[seriesHasType].data], pointerOffset: i - COLUMNS.length });
                            // }
                            //
                            // prevGridData.current.grid.push({});
                            // tmp = prevGridData.current.grid.length-1;
                            // prevGridData.current.grid[tmp][keyLookup[0]] = '';
                            // // prevGridData.current.grid[tmp].push({ readOnly: true, value: 'Series ' + (s+1).toString() });
                            //
                            // for (let i = 0; i < COLUMNS.length + optionsBuffer.current[+currentBuffer.current].series[s].data.length; i++) {
                            //     if (i === 0)
                            //         prevGridData.current.grid[tmp][keyLookup[0]] = 'Y-Axis';
                            //     else if (i < COLUMNS.length)
                            //         prevGridData.current.grid[tmp][keyLookup[0]] = '';
                            //     else
                            //         prevGridData.current.grid[tmp][keyLookup[0]] = optionsBuffer.current[+currentBuffer.current].series[s].data[i - COLUMNS.length];
                            //             //, pointers: [optionsBuffer.current[0].series[seriesHasType].data, optionsBuffer.current[1].series[seriesHasType].data], pointerOffset: i - COLUMNS.length });
                            // }
                            // }
                        } else {
                            throw 'data is empty';
                        }

                    } else if (optionsBuffer.current[+currentBuffer.current].series.hasOwnProperty('value')) {

                    }
                }
            }
        }
        initializedData.current = true;
        setData(prevGridData.current.grid);
    }

    const CHECKED_PROPERTIES = [
        {property: 'xAxis', unchangeMethod: 'change', changes: [{directory: ['show'], value: false}, {directory: ['splitLine'], value: {show: false}}], unchanges: [{directory: ['show'], value: true}, {directory: ['splitLine'], value: {show: true}}]},
        {property: 'yAxis', unchangeMethod: 'change', changes: [{directory: ['show'], value: false}, {directory: ['splitLine'], value: {show: false}}], unchanges: [{directory: ['show'], value: true}, {directory: ['splitLine'], value: {show: true}}]},
        {property: 'legend', unchangeMethod: 'change', changes: [{directory: ['show'], value: false}], unchanges: [{directory: ['show'], value: false}]},
        {property: 'series', unchangeMethod: 'change', changes: [{directory: ['itemStyle'], value: {normal: {label: {show: false}, labelLine: {show : false}}}}], unchanges: [{directory: ['itemStyle', 'normal', 'label', 'show'], value: true}]}
    ];

    function processPresetData() {

        let tmpPointer = null;

        for (let t = 0; t < presetData.current.length; t++) {
            for (let c = 0; c < presetData.current[t].charts.length; c++) {

                for (let p = 0; p < CHECKED_PROPERTIES.length; p++) {
                    if (presetData.current[t].charts[c].hasOwnProperty(CHECKED_PROPERTIES[p].property)) {

                        let prefixIsArray = Array.isArray(presetData.current[t].charts[c][CHECKED_PROPERTIES[p].property]);
                        let stepPointer = (step) => {return (prefixIsArray ? presetData.current[t].charts[c][CHECKED_PROPERTIES[p].property][step] : presetData.current[t].charts[c][CHECKED_PROPERTIES[p].property])};

                        let mutateFlatObject = (stepValue) => {

                            for (let change = 0; change < CHECKED_PROPERTIES[p].changes.length; change++) {
                                tmpPointer = stepPointer(stepValue);
                                if (CHECKED_PROPERTIES[p].changes[change].directory.length > 1) {
                                    for (let dir = 0; dir < CHECKED_PROPERTIES[p].changes.length-1; dir++) {

                                        tmpPointer = stepPointer(stepValue)[CHECKED_PROPERTIES[p].changes[change].directory[dir]];
                                        tmpPointer = {};
                                        tmpPointer[CHECKED_PROPERTIES[p].changes[change].directory[dir]] = {};
                                        tmpPointer[CHECKED_PROPERTIES[p].changes[change].directory[dir]][CHECKED_PROPERTIES[p].changes[change].directory[dir+1]] = null;

                                    }
                                }
                                tmpPointer[CHECKED_PROPERTIES[p].changes[change].directory[CHECKED_PROPERTIES[p].changes[change].directory.length-1]] = CHECKED_PROPERTIES[p].changes[change].value;
                            }
                        };

                        if (prefixIsArray) {
                            for (let seriesIndex = 0; seriesIndex < presetData.current[t].charts[c].series.length; seriesIndex++) {
                                mutateFlatObject(seriesIndex);
                            }
                        } else {
                            mutateFlatObject(0);
                        }

                    }
                }
            }
        }

        setPresetDataReady(true);
    }

    function stripChartAxisHideProperties(EChartJSON) {

        let result = JSON.parse(JSON.stringify(EChartJSON));

        let tmpPointer = null;

        for (let p = 0; p < CHECKED_PROPERTIES.length; p++) {
            if (result.hasOwnProperty(CHECKED_PROPERTIES[p].property)) {

                let prefixIsArray = Array.isArray(result[CHECKED_PROPERTIES[p].property]);
                let stepPointer = (step) => {return (prefixIsArray ? result[CHECKED_PROPERTIES[p].property][step] : result[CHECKED_PROPERTIES[p].property])};

                let mutateFlatObject = (stepValue) => {

                    let functionString = 'unchanges';

                    for (let change = 0; change < CHECKED_PROPERTIES[p][functionString].length; change++) {
                        tmpPointer = stepPointer(stepValue);
                        if (CHECKED_PROPERTIES[p][functionString][change].directory.length > 1 && CHECKED_PROPERTIES[p].unchangeMethod === 'change') {
                            for (let dir = 0; dir < CHECKED_PROPERTIES[p][functionString][change].directory.length-1; dir++) {
                                if (dir === 0)
                                    tmpPointer = stepPointer(stepValue)[CHECKED_PROPERTIES[p][functionString][change].directory[dir]];
                                if (!tmpPointer.hasOwnProperty(CHECKED_PROPERTIES[p][functionString][change].directory[dir+1])) {
                                    tmpPointer[CHECKED_PROPERTIES[p][functionString][change].directory[dir+1]] = {};
                                }
                                if (dir < CHECKED_PROPERTIES[p][functionString][change].directory.length-2)
                                    tmpPointer = tmpPointer[CHECKED_PROPERTIES[p][functionString][change].directory[dir+1]];
                            }
                        }
                        if (CHECKED_PROPERTIES[p].unchangeMethod === 'delete') {
                            delete tmpPointer[CHECKED_PROPERTIES[p][functionString][change].directory[CHECKED_PROPERTIES[p][functionString][change].directory.length-1]];
                        } else {
                            tmpPointer[CHECKED_PROPERTIES[p][functionString][change].directory[CHECKED_PROPERTIES[p][functionString][change].directory.length-1]] = CHECKED_PROPERTIES[p][functionString][change].value;
                        }

                    }
                };

                if (prefixIsArray) {
                    for (let seriesIndex = 0; seriesIndex < result.series.length; seriesIndex++) {
                        mutateFlatObject(seriesIndex);
                    }
                } else {
                    mutateFlatObject(0);
                }

            }
        }


        // const AXIS_TYPES = ['xAxis', 'yAxis'];
        // for (let axis = 0; axis < AXIS_TYPES.length; axis++) {
        //     if (result.hasOwnProperty(AXIS_TYPES[axis])) {
        //         delete result[AXIS_TYPES[axis]].show;
        //         delete result[AXIS_TYPES[axis]].splitLine;
        //     }
        // }
        return result;
    }

    /**  If property does not exist inside EChart's JSON object. The property is created with the
     *   appropriate objects.
     *
     *   @param object JSON object needing property .
     *   @param property String value of missing property.
     */
    function addProperty(object, property) {
        if (!object.hasOwnProperty(property)) {
            // eslint-disable-next-line default-case
            switch (property) {
                case 'title':
                    object[property] = {
                        text: '',
                        textAlign: 'auto',
                        textVerticalAlign: 'auto',
                        textStyle: {
                            fontSize: 18,
                            fontStyle: '',
                            fontWeight: 'normal'
                        },
                        left: 'auto',
                        top: 'auto',
                        subtext: '',
                        subtextStyle: {
                            color: '#aaa',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: 12,
                            lineHeight: 56
                        }
                    };
                    break;
                case 'legend':
                    object[property] = {
                        show: false,
                        left: 'auto',
                        top: 'auto',
                        orient: 'horizontal',
                        textStyle: {
                            padding: 4
                        },
                        selectorItemGap: 7,
                        width: 'auto',
                        height: 'auto',
                        data: getLegendData()
                    };
                    break;
                case 'itemStyle':
                    object[property] = {
                    };
                    break;
                case 'text':
                    object[property] = '';
                    break;
                case 'textAlign':
                    object[property] = 'auto';
                    break;
                case 'textVerticalAlign':
                    object[property] = 'auto';
                    break;
                case 'textStyle':
                    object[property] = {
                        fontSize: 18,
                        fontStyle: '',
                        fontWeight: 'normal'
                    };
                    break;
                case 'left':
                    object[property] = 'auto';
                    break;
                case 'top':
                    object[property] = 'auto';
                    break;
                case 'subtext':
                    object[property] = '';
                    break;
                case 'subtextStyle':
                    object[property] = {
                        color: '#aaa',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 12,
                        lineHeight: 56
                    };
                    break;
                case 'orient':
                    object[property] = 'horizontal';
                    break;
                case 'areaStyle':
                    object[property] = {opacity: 1};
                    break;
                case 'smooth':
                    object[property] = false;
                    break;
                case 'showBackground':
                    object[property] = false;
                    object['backgroundStyle'] = {color: 'rgba(220, 220, 220, 0.8)'};
                    break;
                case 'backgroundStyle':
                    object[property] = {color: 'rgba(220, 220, 220, 0.8)'};
                    break;
            }
        }
    }

    /**  Modify a single value inside the current EChart JSON object used.
     *
     *   @param key Array indicating the directory required to locate object inside root echart object
     *   @param value New value of the found key property.
     */
    function modifyAtomic(key, value) {
        addProperty(optionsBuffer.current[+currentBuffer.current], key[0]);
        let pointer = optionsBuffer.current[+currentBuffer.current][key[0]];
        for (let k = 1; k < key.length-1; k++) {
            addProperty(pointer, key[k]);
            pointer = pointer[key[k]];
        }
        addProperty(pointer, key[key.length-1]);
        pointer[key[key.length-1]] = value;
    }

    function modify(key, value) {
        modifyAtomic(key, value);

        // setChartOptions(optionsBuffer.current[+currentBuffer.current]);
        setCurrentOptions(JSON.parse(JSON.stringify(optionsBuffer.current[+currentBuffer.current])));
        currentBuffer.current = !currentBuffer.current;
        optionsChanges.current.push([optionsBuffer.current[+currentBuffer.current], key, value]);

        setTimeout(flushChanges, 100);
    }

    function modifyChain(eventChain) {
        for (let ev = 0; ev < eventChain.length; ev++) {
            modifyAtomic(eventChain[ev].key, eventChain[ev].value);
            optionsChanges.current.push([optionsBuffer.current[+!currentBuffer.current], eventChain[ev].key, eventChain[ev].value]);
        }

        // setChartOptions(optionsBuffer.current[+currentBuffer.current]);
        setCurrentOptions(JSON.parse(JSON.stringify(optionsBuffer.current[+currentBuffer.current])));
        currentBuffer.current = !currentBuffer.current;
        setTimeout(flushChanges, 100);
    }

    /**  Updates any object using above modify function.
     *
     *   @param object Object to be modified.
     *   @param offset Array indicating the directory required to locate object inside root echart object
     *   @param value New value of the found key property.
     */
    function update([object, offset, value]) {
        // todo: consider changing object instead of creating new var
        let pointer = object;
        for (let k = 0; k < offset.length-1; k++) {
            addProperty(pointer, offset[k]);
            pointer = pointer[offset[k]];
        }

        addProperty(pointer, offset[offset.length-1]);
        pointer[offset[offset.length-1]] = value;
    }

    function flushChanges() {
        while (optionsChanges.current.length > 0) {
            update(optionsChanges.current.pop());
        }
    }

    /**  Generates required data for editing legend.
     */
    function getLegendData() {
        let data = [];
        if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
            if (optionsBuffer.current[+currentBuffer.current].series.length > 0) {
                if (!optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('name')) {
                    optionsBuffer.current[+currentBuffer.current].series[0].name = 'Legend Value 1';
                    optionsBuffer.current[+!currentBuffer.current].series[0].name = 'Legend Value 1';
                    if (seriesProperty.length > 0 && seriesProperty[0].hasOwnProperty('label') && seriesProperty[0].label.hasOwnProperty('value')) {
                        let tmp = JSON.parse(JSON.stringify(seriesProperty[0]));
                        tmp.label.value = 'Legend Value 1';
                        setSeriesProperty([tmp]);
                    }
                }
                data.push(optionsBuffer.current[+currentBuffer.current].series[0].name);
                return data;
            }
        } else {
            addProperty(optionsBuffer.current[+currentBuffer.current], 'series');
            addProperty(optionsBuffer.current[+!currentBuffer.current], 'series');

            optionsBuffer.current[+currentBuffer.current].series.push([{name: 'Legend Value 1'}]);
            optionsBuffer.current[+!currentBuffer.current].series.push([{name: 'Legend Value 1'}]);
        }
        data.push('Legend Value 1');
        return data;
    }

    /**
     *   React Hooks function.
     */
    useEffect(() => {

        if (props.mode === EDITCHART_MODES.EDIT) {
            // window.addEventListener('mousedown', onMouseDown);
            // window.addEventListener('mousemove', onMouseDrag);
            // window.addEventListener('mouseup', onMouseUp);

            optionsBuffer.current[+currentBuffer.current] = JSON.parse(JSON.stringify(props.options));
            currentBuffer.current = !currentBuffer.current;
            optionsBuffer.current[+currentBuffer.current] = JSON.parse(JSON.stringify(props.options));

            // setChartOptions(optionsBuffer.current[+currentBuffer.current]);
            resetCurrentOptions(JSON.parse(JSON.stringify(optionsBuffer.current[+currentBuffer.current])));
            currentBuffer.current = !currentBuffer.current;

            generateData();
        } else {
            processPresetData();
        }

    }, []);

    /**
     *   Constants
     */

    const DEFAULT_PROPERTIES = {
        TITLE: {
            HORIZONTAL_ALIGNMENT: [{
                value: 'auto',
                label: 'Auto'
            }, {
                value: 'left',
                label: 'Left'
            }, {
                value: 'center',
                label: 'Center'
            }, {
                value: 'right',
                label: 'Right'
            }],
            VERTICAL_ALIGNMENT: [{
                value: 'auto',
                label: 'Auto'
            }, {
                value: 'top',
                label: 'Top'
            }, {
                value: 'middle',
                label: 'Middle'
            }, {
                value: 'bottom',
                label: 'Bottom'
            }]
        },
        LEGEND: {
            HORIZONTAL_ALIGNMENT: [{
                value: 'auto',
                label: 'Auto'
            }, {
                value: 'left',
                label: 'Left'
            }, {
                value: 'center',
                label: 'Center'
            }, {
                value: 'right',
                label: 'Right'
            }],
            TYPE: [{
                value: 'line',
                label: 'Line'
            }, {
                value: 'bar',
                label: 'Bar'
            }, {
                value: 'pie',
                label: 'Pie'
            }, {
                value: 'scatter',
                label: 'Scatter'
            }],
            ORIENT: [{
                value: 'horizontal',
                label: 'Horizontal'
            }, {
                value: 'vertical',
                label: 'Vertical'
            }]
        }
    };


    /**  Updates table data inside component.
     *
     *   @param rowIndex Index of the row with the value to be updated.
     *   @param columnId ID of the column with the value to be updated.
     *   @param value New value of the found key property.
     */
    function updateData(rowIndex, columnId, value) {

        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    }

    /**  Updates data within axis.
     *
     *   @param rowIndex Index of the row with the value to be updated.
     *   @param columnId ID of the column with the value to be updated.
     *   @param value New value of the found key property.
     */
    function updateAxisData(rowIndex, columnId, value) {

        setDataAxisCaptions(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    }


    /**  React component for individual cell values within table component.
     */
    function EditableCell({value: initialValue, row: { index }, column: { id }, updateMyData}) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value);
        }

        function onBlur() {
            updateMyData(index, id, value);
            modify(storedPointers.current[index + id], value);
        }

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return <input className='EditableCell' value={value} onChange={onChange} onBlur={onBlur} style={{borderStyle: 'none'}} />;
    }

    const defaultColumn = {
        Cell: EditableCell,
    };

    function Table({ columns, data, updateMyData }) {

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            rows,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize },
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
                autoResetPage: false,
                updateMyData
            },
            usePagination
        );

        return (
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className='datatable'>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, cellIndex) => {

                                if (cellIndex === 0) {
                                    if (cell.row.original.hasOwnProperty('series'))
                                        return <td rowSpan={2} className='datatable__spanning' key={i + cellIndex.toString()}>{cell.row.original.series}</td>;
                                    else
                                        return null;
                                } else if (cellIndex < 2) {
                                    return <td className={(i === 0 ? (cell.row.original.rowspan === 1 ? 'datatable__single' : 'datatable__top') : 'datatable')} key={i + cellIndex.toString()}>{cell.row.original.dimension}</td>;
                                } else {
                                    // return <td {...cell.getCellProps()} className={(i === 0 ? (cell.row.original.rowspan === 1 ? (cellIndex === row.cells.length-1 ? 'datatable__single--last ' : '') + 'datatable__single' : 'datatable__top') : 'datatable') + (cellIndex > 1 ? ' datatable__editable' : '')} key={i + cellIndex.toString()}>{cell.render('Cell')}</td>;
                                    return <td {...cell.getCellProps()} className={(cellIndex === row.cells.length-1 ? 'datatable__single--last ' : '') + (i === 0 ? (cell.row.original.rowspan === 1 ?  'datatable__single' : 'datatable__top') : 'datatable') + (cellIndex > 1 ? ' datatable__editable' : '')} key={i + cellIndex.toString()}>{cell.render('Cell')}</td>;
                                }
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }

    function AxisTable({ columns, data, updateMyData }) {

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            rows,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize },
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
                autoResetPage: false,
                updateMyData
            },
            usePagination
        );

        return (
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className='datatable'>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, cellIndex) => {

                                if (cellIndex < 1) {
                                    return <td className={(i === 0 ? (cell.row.original.rowspan === 1 ? 'datatable__single' : 'datatable__top') : 'datatable')}>{cell.render('Cell')}</td>;
                                } else {
                                    return <td {...cell.getCellProps()} className={(i === 0 ? (cell.row.original.rowspan === 1 ? (cellIndex === row.cells.length-1 ? 'datatable__single--last ' : '') + 'datatable__single' : 'datatable__top') : 'datatable') + (cellIndex > 0 ? ' datatable__editable' : '')}>{cell.render('Cell')}</td>;
                                }
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }

    function ChartTypeNavigation() {

        const selectedCSS = {
            backgroundColor: 'white',
            color: 'black'
        };
        const deselectedCSS = {
            backgroundColor: 'black',
            color: 'white'
        };

        return (
            <div>
                <div className='chartType' style={(presetIndex === 0 ? selectedCSS : deselectedCSS)} onClick={() => {setPresetIndex(0);}}>Line</div>
                <div className='chartType' style={(presetIndex === 1 ? selectedCSS : deselectedCSS)} onClick={() => {setPresetIndex(1);}}>Bar</div>
                <div className='chartType' style={(presetIndex === 2 ? selectedCSS : deselectedCSS)} onClick={() => {setPresetIndex(2);}}>Pie</div>
                <div className='chartType' style={(presetIndex === 3 ? selectedCSS : deselectedCSS)} onClick={() => {setPresetIndex(3);}}>Scatter</div>
            </div>
        );
    }

    function ChartBrowser() {
        return (
            <div>
                {presetData.current[presetIndex].map((dataOptions, index) => {
                    return <Grid item xs={12} md={6} lg={3} key={index} className='chartItem'>
                        <ReactEcharts option={dataOptions}/>
                    </Grid>;
                })}
            </div>
        );
    }

    function SelectChartType(props) {

        const { isActive, nextStep } = useWizardStep();

        return (isActive ?
                <div>
                    <div className='chartType' onClick={nextStep}>Line</div>
                    <div onClick={nextStep}>Bar</div>
                    <div onClick={nextStep}>Pie</div>
                    <div onClick={nextStep}>Scatter</div>
                </div>
            : null
        );
    }

    function SelectChart() {
        const { isActive, nextStep } = useWizardStep();
        return isActive ? <div onClick={nextStep}>Second Step</div> : null;
    }

    return (
        <div id='editCharts'>
            {(props.mode === EDITCHART_MODES.CREATE && !haveChosenChart) &&
                <>
                    {
                        (matches ?
                                <Wizard>
                                    <SelectChartType />
                                    {/* a step doesn't need to be a direct child of the wizard. It can be nested inside of html or react components, too!*/}
                                    <div>
                                        <SelectChart />
                                    </div>
                                </Wizard>
                                :
                                <>
                                    <div className='chooseChartModel'>

                                        {presetDataReady &&
                                        <Tabs defaultActiveKey="0" tabPosition='left' style={{ height: 220 }}>

                                            {presetData.current.map((presetCharts, presetChartsIndex) => {
                                                console.debug('finalfianlresult  presetData', presetData.current)
                                                return <Tabs.TabPane tab={presetCharts.tabTitle} key={presetChartsIndex}>
                                                    <Grid container>
                                                        {presetCharts.charts.map((presetChart, presetChartIndex) => {
                                                            return <Grid item xs={12} md={6} lg={3} key={presetChartIndex} className='chartItem' key={presetChartIndex}>
                                                                <div className='chartItem__inner' onClick={() => {
                                                                    optionsBuffer.current[+currentBuffer.current] = stripChartAxisHideProperties(presetChart);
                                                                    currentBuffer.current = !currentBuffer.current;
                                                                    optionsBuffer.current[+currentBuffer.current] = stripChartAxisHideProperties(presetChart);

                                                                    // setChartOptions(optionsBuffer.current[+currentBuffer.current]);
                                                                    resetCurrentOptions(JSON.parse(JSON.stringify(optionsBuffer.current[+currentBuffer.current])));
                                                                    currentBuffer.current = !currentBuffer.current;

                                                                    generateData();

                                                                    setHaveChosenChart(true);
                                                                }}>
                                                                    <ReactEcharts  style={{height: '200px'}} className='chartItem__echart' option={presetChart}/>
                                                                    <div className='chartItem__inner--title'>{`${presetChart.semanticTitle}`}</div>
                                                                </div>
                                                            </Grid>;
                                                        })}
                                                    </Grid>
                                                </Tabs.TabPane>;
                                            })}

                                            {/*<Tabs.TabPane tab={<><PieChart/> Pie</>} key={1}>*/}
                                            {/*    {}*/}
                                            {/*</Tabs.TabPane>*/}
                                            {/*<Tabs.TabPane tab={'Tab-1'} key={2}>*/}
                                            {/*    asdfasf*/}
                                            {/*</Tabs.TabPane>*/}
                                            {/*<Tabs.TabPane tab={'Tab-2'} key={3}>*/}
                                            {/*    Cqweqwe*/}
                                            {/*</Tabs.TabPane>*/}
                                        </Tabs>}


                                        {/*<div className='chooseChartModel__container'>*/}
                                        {/*    <div  className='chartNavigator--desktop'>*/}
                                        {/*        <ChartTypeNavigation />*/}
                                        {/*    </div>*/}
                                        {/*    <div className='chartBrowser--desktop'>*/}



                                        {/*        /!*<div> {`what is: ${presetDataReady}`}</div>*!/*/}
                                        {/*        {presetDataReady &&*/}
                                        {/*            <Grid container>*/}
                                        {/*                {presetData.current[presetIndex].map((dataOptions, index) => {*/}
                                        {/*                    // if (index === 1 && presetIndex === 1) {*/}
                                        {/*                    //     console.debug('dataOptions of 0', dataOptions);*/}
                                        {/*                    //     return <div>whasssuppp</div>;*/}
                                        {/*                    //*/}
                                        {/*                    // } else*/}

                                        {/*                    console.debug('rendering dataOptions index of ', index, ' with ', dataOptions);*/}

                                        {/*                    let resultPointer;*/}
                                        {/*                    let result = <Grid item xs={12} md={6} lg={3} key={index} className='chartItem'>*/}
                                        {/*                        /!*<div className='chartItem__inner'>*!/*/}
                                        {/*                        <ReactEcharts ref={(e) => {resultPointer = e;}} style={{height: '200px'}} className='chartItem__echart' option={dataOptions}/>*/}
                                        {/*                        <div className='chartItem__inner--title'>{`${dataOptions.semanticTitle}`}</div>*/}
                                        {/*                        /!*</div>*!/*/}
                                        {/*                    </Grid>;*/}

                                        {/*                    console.debug('resultPointer', resultPointer)*/}
                                        {/*                    // resultPointer = resultPointer.getEchartsInstance();*/}
                                        {/*                    // resultPointer.refresh();*/}

                                        {/*                    return result;*/}
                                        {/*                })}*/}
                                        {/*            </Grid>*/}
                                        {/*        }*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className='chooseChartModel__background'></div>
                                </>
                        )
                    }
                </>
            }
            <div id='editCharts__header'>
                <Space size={9} align="center">
                    <Button ghost onClick={() => {undoCurrentOptions();}} disabled={!canUndo}>
                        Undo
                    </Button>
                    <Button ghost onClick={() => {redoCurrentOptions();}} disabled={!canRedo}>
                        Redo
                    </Button>
                    <Button ghost style={{float: 'right'}} onClick={() => {
                        if (props.mode === EDITCHART_MODES.EDIT) {
                            request.cache.suggestions.graph[props.directory[0]] = optionsBuffer.current[0];
                            props.mutablePointer[props.directory[0]] = optionsBuffer.current[+currentBuffer.current];
                            props.synchronizeChanges(props.directory[0]);
                        }
                    }}>Save</Button>
                    <Button ghost onClick={() => {setHaveChosenChart(false);}} >
                        Change Chart Option
                    </Button>
                </Space>
            </div>
            <div id='editCharts__properties' className='editCharts__container--box'>
                <div className='box__title'>
                    Properties
                </div>
                <div className='box__content'>
                    <Collapse defaultActiveKey={['1']}>
                        <Collapse.Panel header="Title" key="1">
                            <table className='properties'>
                                <tbody>
                                <tr className='properties'>
                                    <td className='properties'>Text</td>
                                    <td className='properties'><Input onPressEnter={e => {modify(['title', 'text'], e.target.value);}}/></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Size</td>
                                    <td className='properties'><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'textStyle', 'fontSize'], parseInt(v));}} /></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Bold</td>
                                    <td className='properties'><Checkbox onClick={e => {modify(['title', 'textStyle', 'fontWeight'], (e.target.checked ? 'bold' : 'normal'));}} /></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Horizontal Alignment</td>
                                    <td className='properties'>
                                        <Cascader options={DEFAULT_PROPERTIES.TITLE.HORIZONTAL_ALIGNMENT} onChange={v => {modify(['title', 'left'], v[0]);}} defaultValue={[DEFAULT_PROPERTIES.TITLE.HORIZONTAL_ALIGNMENT[0].label]} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='properties'>Vertical  Alignment</td>
                                    <td className='properties'>
                                        <Cascader options={DEFAULT_PROPERTIES.TITLE.VERTICAL_ALIGNMENT} onChange={v => {modify(['title', 'top'], v[0]);}} defaultValue={[DEFAULT_PROPERTIES.TITLE.VERTICAL_ALIGNMENT[0].label]} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Collapse.Panel>
                        <Collapse.Panel header="Link" key="2">
                            <table className='properties'>
                                <tbody>
                                <tr className='properties'>
                                    <td className='properties'>Text</td>
                                    <td className='properties'><Input onPressEnter={e => {modify(['title', 'subtext'], e.target.value);}}/></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Size</td>
                                    <td className='properties'><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'subtextStyle', 'fontSize'], parseInt(v));}} /></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Bold</td>
                                    <td><Checkbox onClick={e => {modify(['title', 'subtextStyle', 'fontWeight'], (e.target.checked ? 'bold' : 'normal'));}} /></td>
                                </tr>
                                <tr>
                                    <td className='properties'>Top Margin</td>
                                    <td className='properties'><InputNumber min={1} max={300} defaultValue={56} onChange={v => {modify(['title', 'subtextStyle', 'lineHeight'], parseInt(v));}} /></td>
                                </tr>
                                </tbody>
                            </table>
                        </Collapse.Panel>
                        <Collapse.Panel header="Legend" key="3">
                            <table className='properties'>
                                <tbody>
                                <tr className='properties'>
                                    <td className='properties'>Show Legend</td>
                                    <td><Checkbox onClick={e => {modify(['legend', 'show'], e.target.checked);}} /></td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Orientation</td>
                                    {/*<td className='properties'><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'subtextStyle', 'fontSize'], parseInt(v));}} /></td>*/}
                                    <td>
                                        <Cascader options={DEFAULT_PROPERTIES.LEGEND.ORIENT} onChange={v => {modify(['legend', 'orient'], v[0]);}} defaultValue={[DEFAULT_PROPERTIES.LEGEND.ORIENT[0].label]} />
                                    </td>
                                </tr>
                                <tr className='properties'>
                                    <td className='properties'>Horizontal Alignment</td>
                                    <td className='properties'>
                                        <Cascader options={DEFAULT_PROPERTIES.LEGEND.HORIZONTAL_ALIGNMENT} onChange={v => {modify(['legend', 'left'], v[0]);}} defaultValue={['Auto']}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='properties'>Vertical  Alignment</td>
                                    <td className='properties'>
                                        <Cascader options={DEFAULT_PROPERTIES.TITLE.VERTICAL_ALIGNMENT} onChange={v => {modify(['legend', 'top'], v[0]);}} defaultValue={['Auto']}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Collapse.Panel>

                        <Collapse.Panel header="Series" key="4">
                            <Collapse defaultActiveKey={['1']} ghost>
                                {seriesProperty.map((s, seriesIndex) => {
                                    return <Collapse.Panel header={s.name} key={seriesIndex}>
                                        <table className='properties'>
                                            <tbody>
                                                <tr className='properties'>
                                                    <td className='properties'>Name</td>
                                                    <td className='properties'>
                                                        <Input onPressEnter={e => {
                                                            modifyChain([{key: ['legend', 'data', seriesIndex], value: e.target.value}, {key: s.label.directory, value: e.target.value}]);
                                                            let tmp = JSON.parse(JSON.stringify(seriesProperty[seriesIndex]));
                                                            tmp.label.value = e.target.value;
                                                            setSeriesProperty(seriesProperty.map((newSeries, newSeriesIndex) => {
                                                                if (newSeriesIndex === seriesIndex) return tmp;
                                                                else return newSeries;
                                                            }));
                                                        }} placeholder={s.label.value}/>
                                                    </td>
                                                </tr>
                                                <tr className='properties'>

                                                   { Array.isArray(s.color) ?
                                                       <td>
                                                           {s.color.map((data, dataIndex) => {
                                                               return <table className='properties' key={dataIndex}>
                                                                   <tbody>
                                                                       <tr>
                                                                           <td>
                                                                               <InputColor initialValue={data.hexvalue} onChange={v => {
                                                                                   modify(data.directory, v.rgba);
                                                                               }} placement="right" />
                                                                            </td>
                                                                       </tr>
                                                                   </tbody>
                                                               </table>;
                                                           })}
                                                       </td>
                                                   :
                                                   <React.Fragment>
                                                        <td className='properties'>Colour</td>
                                                        <td className='properties'>
                                                            <InputColor initialValue={s.color.hexvalue} onChange={v => {
                                                                modify(s.color.directory, v.rgba);
                                                            }} placement="right" />
                                                        </td>
                                                    </React.Fragment>}



                                                </tr>
                                                <tr className='properties'>
                                                    <td className='properties'>Type</td>
                                                    <td className='properties'>
                                                        <Cascader options={DEFAULT_PROPERTIES.LEGEND.TYPE} onChange={v => {
                                                            if (v.length > 0) {
                                                                modify(s.type.directory, v[0]);
                                                                let tmp = JSON.parse(JSON.stringify(seriesProperty));
                                                                tmp[seriesIndex].type.value = v[0];
                                                                setSeriesProperty(tmp);
                                                            }
                                                        }} value={[s.type.value]}/>
                                                    </td>
                                                </tr>

                                                {s.hasOwnProperty('areaOption') &&

                                                <tr className='properties'>
                                                    <td className='properties'>Area Chart</td>
                                                    <td className='properties'>
                                                        <Checkbox defaultChecked={s.areaOption.value} onClick={e => {modify(s.areaOption.directory, (e.target.checked ? 1 : 0));}} />
                                                    </td>
                                                </tr>
                                                }
                                                {s.hasOwnProperty('smooth') &&

                                                <tr className='properties'>
                                                    <td className='properties'>Smooth</td>
                                                    <td className='properties'>
                                                        <Checkbox defaultChecked={s.smooth.value} onClick={e => {modify(s.smooth.directory, (e.target.checked ? 1 : 0));}} />
                                                    </td>
                                                </tr>
                                                }

                                                <tr className='properties'>
                                                    <td className='properties'>Enable Background</td>
                                                    <td className='properties'>
                                                        <Checkbox defaultChecked={s.background.have.value} onClick={e => {modify(s.background.have.directory, e.target.checked);}} />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <Collapse defaultActiveKey={['1']} ghost>
                                                            <Collapse.Panel header={'Background Settings'} key={seriesIndex}>

                                                                <table className='properties'>
                                                                    <tbody>
                                                                    <tr className='properties'>
                                                                        <td className='properties'>Colour</td>
                                                                        <td>
                                                                            <InputColor initialValue={s.background.hexvalue} onChange={v => {
                                                                                modify(s.background.directory, v.rgba);
                                                                            }} placement="right" />
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    </td>
                                                </tr>

                                                {s.hasOwnProperty('itemStyle') &&
                                                <tr>
                                                    <td>
                                                        <Collapse defaultActiveKey={['1']} ghost>
                                                            <Collapse.Panel header={'Item Style'} key={seriesIndex}>

                                                                <table className='properties'>
                                                                    <tbody>
                                                                    <tr className='properties'>
                                                                        <td className='properties'>Show</td>
                                                                        <td>
                                                                            <Checkbox defaultChecked={s.itemStyle.show.value} onClick={e => {modify(s.itemStyle.show.directory, (e.target.checked ? 1 : 0));}} />
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    </td>
                                                </tr>
                                                }

                                            </tbody>
                                        </table>
                                    </Collapse.Panel>;
                                })}
                            </Collapse>
                        </Collapse.Panel>

                    </Collapse>
                </div>


            </div>
            <div id='editCharts__stage' className='editCharts__container--box'>

                <div className='box__title'>
                    Chart
                </div>
                <div className='box__content'>
                    {(props.mode === EDITCHART_MODES.EDIT || (props.mode === EDITCHART_MODES.CREATE && haveChosenChart)) &&
                        <ReactEcharts option={presentCurrentOptions}/>
                    }
                </div>

                <div className='box__title'>
                    Data
                </div>

                <div className='box__content'>
                    <div style={{overflow: 'scroll'}}>
                        {/*<Table columns={columns} dataSource={data} />*/}
                        {renderAxisTable && <AxisTable columns={columnsAxisCaptions} data={dataAxisCaptions} updateMyData={updateAxisData}/>}
                        {(props.mode === EDITCHART_MODES.EDIT || (props.mode === EDITCHART_MODES.CREATE && haveChosenChart)) &&
                            <Table columns={columns.current} data={data} updateMyData={updateData}/>
                        }

                    </div>
                </div>
            </div>

        </div>
    );
}

export default EditChart;