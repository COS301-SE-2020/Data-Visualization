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
    Form, Tabs, Slider
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
import {Wizard, useWizardStep, WizardStep} from 'react-wizard-primitive';
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
                    semanticTitle: 'Basic Scatter Chart',
                    dataset: {
                        source: [
                            ['Height', 'Diameter'],
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
                        ]
                    },
                    xAxis: {},
                    yAxis: {},
                    series: [{
                        encode: {x: 'Height', y: 'Diameter'},
                        symbolSize: 5,
                        type: 'scatter'
                    }]
                },
                {
                    semanticTitle: 'Basic Scatter Chart',
                    dataset: {
                        source: [
                            ['Height', 'Diameter'],
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
                        ]
                    },
                    xAxis: {},
                    yAxis: {},
                    series: [{
                        encode: {x: 'Height', y: 'Diameter'},
                        symbolSize: 5,
                        type: 'effectScatter'
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

    function percentageStringToInt(percent) {
        if (percent.substring(percent.length-1, percent.length) === '%') {
            return Number(percent.substring(0, percent.length-1));
        } else {
            return Number(percent);
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

                            if (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('itemStyle')) {
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

                            if (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('radius')) {

                                newSeriesProperty[newSeriesProperty.length-1].innerRadius = {
                                    directory: ['series', 0, 'radius', 0],
                                    value: percentageStringToInt(optionsBuffer.current[+currentBuffer.current].series[0].radius[0])
                                };
                                newSeriesProperty[newSeriesProperty.length-1].outerRadius = {
                                    directory: ['series', 0, 'radius', 1],
                                    value: percentageStringToInt(optionsBuffer.current[+currentBuffer.current].series[0].radius[1])
                                };

                            } else {
                                // addProperty(optionsBuffer.current[+currentBuffer.current], 'radius');
                                // addProperty(optionsBuffer.current[+!currentBuffer.current], 'radius');
                            }

                        } else if (optionsBuffer.current[+currentBuffer.current].series[0].type === 'effectScatter') {
                            if (!optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('symbolSize'))
                                optionsBuffer.current[+currentBuffer.current].series[0].symbolSize = 5;
                            newSeriesProperty[newSeriesProperty.length-1].symbolSize = {
                                directory: ['series', 0, 'symbolSize'],
                                value: optionsBuffer.current[+currentBuffer.current].series[0].symbolSize
                            };
                        }

                        addProperty(optionsBuffer.current[+currentBuffer.current], 'showBackground');
                        addProperty(optionsBuffer.current[+currentBuffer.current], 'backgroundStyle');
                        addProperty(optionsBuffer.current[+!currentBuffer.current], 'showBackground');
                        addProperty(optionsBuffer.current[+!currentBuffer.current], 'backgroundStyle');

                        setPropertyHook([true].concat(propertyHook.filter((a, index) => {return index > 0;})));
                        newSeriesProperty[newSeriesProperty.length-1].background = {
                            have: {
                                directory: ['series', 0, 'showBackground'],
                                value: true
                            },
                            directory: ['series', 0, 'backgroundStyle', 'color'],
                            hexvalue: (optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('backgroundStyle') && optionsBuffer.current[+currentBuffer.current].series[0].backgroundStyle.hasOwnProperty('color') ? parseRGBToHex(optionsBuffer.current[+currentBuffer.current].series[0].backgroundStyle.color) : ECHART_DEFAULT_COLOURS[0])
                        };
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
                case 'itemStyle':
                    object[property] = {normal: {label: {show: false}, labelLine: {show : false}}};
                    break;
                case 'symbolSize':
                    object[property] = 5;
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


    return (
        <div id='editCharts'>
            {(props.mode === EDITCHART_MODES.CREATE && !haveChosenChart) &&
                <>
                    {
                        (matches ?
                                <Wizard>
                                    {({ activeStepIndex, nextStep, previousStep }) => (
                                        <div className="App">
                                            <div>

                                                <WizardStep >
                                                    {({ isActive, index }) =>
                                                        isActive &&
                                                        <div className='chartType--mobile'>
                                                            <div className='chartSelection--mobile chartSelection__topBottom--mobile' onClick={() => {setPresetIndex(0); nextStep();}} ><span className='chartTabTitle--mobile'><LineChart className='chartTabTitle__icon--mobile'/> Line</span></div>
                                                            <div className='chartSelection--mobile chartSelection__topBottom--mobile' onClick={() => {setPresetIndex(1); nextStep();}} ><span className='chartTabTitle--mobile'><BarChart className='chartTabTitle__icon--mobile'/> Bar</span></div>
                                                            <div className='chartSelection--mobile chartSelection__topBottom--mobile' onClick={() => {setPresetIndex(2); nextStep();}} ><span className='chartTabTitle--mobile'><PieChart className='chartTabTitle__icon--mobile'/> Pie</span></div>
                                                            <div className='chartSelection--mobile' onClick={() => {setPresetIndex(3); nextStep();}} ><span className='chartTabTitle--mobile'><ScatterPlot className='chartTabTitle__icon--mobile '/> Scatter</span></div>
                                                        </div>
                                                    }
                                                </WizardStep>
                                                <WizardStep >
                                                    {({ isActive, index }) =>
                                                        isActive &&
                                                        <div className='chartBroweser--mobile' onClick={nextStep}>
                                                            <Grid container>
                                                                {presetData.current[presetIndex].charts.map((presetCharts, presetChartsIndex) => {
                                                                    return <Grid item xs={12} md={6} lg={3} key={presetChartsIndex} className='chartItem' >
                                                                        <div className='chartItem__inner' onClick={() => {
                                                                            optionsBuffer.current[+currentBuffer.current] = stripChartAxisHideProperties(presetCharts);
                                                                            currentBuffer.current = !currentBuffer.current;
                                                                            optionsBuffer.current[+currentBuffer.current] = stripChartAxisHideProperties(presetCharts);

                                                                            // setChartOptions(optionsBuffer.current[+currentBuffer.current]);
                                                                            resetCurrentOptions(JSON.parse(JSON.stringify(optionsBuffer.current[+currentBuffer.current])));
                                                                            currentBuffer.current = !currentBuffer.current;

                                                                            generateData();

                                                                            setHaveChosenChart(true);
                                                                        }}>
                                                                            <ReactEcharts  style={{height: '200px'}} className='chartItem__echart' option={presetCharts}/>
                                                                            <div className='chartItem__inner--title'>{`${presetCharts.semanticTitle}`}</div>
                                                                        </div>
                                                                    </Grid>;
                                                                })}
                                                            </Grid>
                                                        </div>
                                                    }
                                                </WizardStep>
                                            </div>
                                        </div>
                                    )}
                                    {/*<SelectChartType />*/}
                                    {/*<SelectChart />*/}
                                </Wizard>
                                :
                                <>
                                    <div className='chooseChartModel'>

                                        {presetDataReady &&
                                        <Tabs defaultActiveKey="0" tabPosition='left' style={{ height: 220 }}>

                                            {presetData.current.map((presetCharts, presetChartsIndex) => {
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
                        } else {
                            let akey = 123;
                            message.loading({ content: 'Saving new chart to dashboard....', akey});
                            request.graph.add(props.dashboardID, (presentCurrentOptions.title != null && presentCurrentOptions.title.text === '' ? presentCurrentOptions.title.text : 'Custom Chart'), presentCurrentOptions, {}, function(response) {
                                if (response === constants.RESPONSE_CODES.SUCCESS) {
                                    message.success({ content: 'Chart was successfully saved!', akey, duration: 2 });

                                    props.synchronizeChanges();
                                }

                            });
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

                                                {s.hasOwnProperty('symbolSize') &&

                                                <tr className='properties'>
                                                    <td className='properties'>Symbol Size</td>
                                                    <td className='properties'>
                                                        <Slider defaultValue={s.symbolSize.value} onChange={v => {modify(s.symbolSize.directory, v);}}/>
                                                        {/*<Checkbox defaultChecked={s.smooth.value} onChange={e => {modify(s.smooth.directory, (e.target.checked ? 1 : 0));}} />*/}
                                                    </td>
                                                </tr>
                                                }

                                                {s.hasOwnProperty('innerRadius') &&

                                                <tr className='properties'>
                                                    <td className='properties'>Inner Radius</td>
                                                    <td className='properties'>
                                                        <Slider defaultValue={s.innerRadius.value} onChange={v => {modify(s.innerRadius.directory, v);}}/>
                                                        {/*<Checkbox defaultChecked={s.smooth.value} onChange={e => {modify(s.smooth.directory, (e.target.checked ? 1 : 0));}} />*/}
                                                    </td>
                                                </tr>
                                                }
                                                {s.hasOwnProperty('outerRadius') &&

                                                <tr className='properties'>
                                                    <td className='properties'>Outer Radius</td>
                                                    <td className='properties'>
                                                        <Slider defaultValue={s.outerRadius.value} onChange={v => {modify(s.outerRadius.directory, v);}}/>
                                                        {/*<Checkbox defaultChecked={s.smooth.value} onChange={e => {modify(s.smooth.directory, (e.target.checked ? 1 : 0));}} />*/}
                                                    </td>
                                                </tr>
                                                }

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