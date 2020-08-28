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
import {Collapse, Input, Checkbox, Button, InputNumber, Space, message, Dropdown, Menu, Cascader, Divider} from 'antd';
import './EditChart.scss';
import ReactEcharts from 'echarts-for-react';
import * as constants from '../../globals/constants';
import Box from '@material-ui/core/Box';
import { useTable } from 'react-table';
import InputColor from 'react-input-color';
import request from '../../globals/requests';
import Grid from '@material-ui/core/Grid';
import useUndo from 'use-undo';

/**
 *   @brief Component to edit charts data and metadata.
 *   @param props React property with options passed as child that is the options of the chart to be edited.
 */
function EditChart(props) {

    const [chartOptions, setChartOptions] = useState(props.options);
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
    ] = useUndo(props.options);
    const { present: presentCurrentOptions } = currentOptions;

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
    function removeLeadingZeros(value) {
        while (value.substring(0, 1) === '0') {
            value = value.substring(1);
        }
        return value;
    }

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


        if (optionsBuffer.current[+currentBuffer.current].series.length > 0 && optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('encode') && optionsBuffer.current[+currentBuffer.current].series[0].encode.hasOwnProperty('itemName'))
            columns.current[1].columns.push({Header: 'Value', accessor: 'value'});
        else
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

            if (optionsBuffer.current[+currentBuffer.current].series.length > 0 && optionsBuffer.current[+currentBuffer.current].series[0].hasOwnProperty('encode') && optionsBuffer.current[+currentBuffer.current].series[0].encode.hasOwnProperty('x')) {
                let s = 0;
                for (let dimension = 0; dimension < 2; dimension++) {
                    prevGridData.current.grid.push({});
                    tmp = prevGridData.current.grid.length-1;

                    if (dimension === 0) {
                        prevGridData.current.grid[tmp][keyLookup[0]] = 'Series 1';
                        seriesProperty.push({name: 'Series 1'});
                        prevGridData.current.grid[tmp]['rowspan'] = 2;

                    }
                    for (let i = 1; i < dataLength+1; i++) {

                        if (i === 1) {
                            prevGridData.current.grid[tmp].dimension = dimensionName(dimension);
                        }

                        prevGridData.current.grid[tmp][keyLookup[i+1]] = (optionsBuffer.current[+currentBuffer.current].dataset.source[i][dimension] == null ? '' : optionsBuffer.current[+currentBuffer.current].dataset.source[i][dimension]);
                        storedPointers.current[tmp + keyLookup[i+1]] = ['dataset', 'source', i, dimension];
                    }
                }
            } else {
                for (let s = 1; s < optionsBuffer.current[+currentBuffer.current].dataset.source.length; s++) {
                    for (let dimension = 0; dimension < 2; dimension++) {
                        prevGridData.current.grid.push({});
                        tmp = prevGridData.current.grid.length - 1;

                        if (dimension === 0) {
                            prevGridData.current.grid[tmp][keyLookup[0]] = 'Series ' + s;
                            seriesProperty.push({name: 'Series ' + s});
                            prevGridData.current.grid[tmp]['rowspan'] = 2;
                        }

                        prevGridData.current.grid[tmp]['dimension'] = (dimension+1).toString();
                        prevGridData.current.grid[tmp]['value'] = (optionsBuffer.current[+currentBuffer.current].dataset.source[s][dimension] == null ? 'null' : optionsBuffer.current[+currentBuffer.current].dataset.source[s][dimension]);
                        storedPointers.current[tmp + 'value'] = ['dataset', 'source', s, dimension];
                    }
                }
            }

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

        setData(prevGridData.current.grid);
    }

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
            }
        }
    }

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

    return (
        <div id='editCharts'>
            <div id='editCharts__header'>
                <Space size={9} align="center">
                    <Button ghost onClick={() => {undoCurrentOptions();}} disabled={!canUndo}>
                        Undo
                    </Button>
                    <Button ghost onClick={() => {redoCurrentOptions();}} disabled={!canRedo}>
                        Redo
                    </Button>
                    <Button ghost style={{float: 'right'}} onClick={() => {
                        request.cache.suggestions.graph[props.directory[0]] = optionsBuffer.current[0];
                        props.mutablePointer[props.directory[0]] = optionsBuffer.current[+currentBuffer.current];
                        props.synchronizeChanges(props.directory[0]);
                    }}>Save</Button>
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

                        {/*<Collapse.Panel header="Series" key="4">*/}
                        {/*    <Collapse defaultActiveKey={['1']} ghost>*/}
                        {/*        {seriesProperty.map((s, seriesIndex) => {*/}
                        {/*            return <Collapse.Panel header={s.name} key={seriesIndex}>*/}
                        {/*                <table className='properties'>*/}
                        {/*                    <tbody>*/}
                        {/*                    <tr className='properties'>*/}
                        {/*                        <td className='properties'>Name</td>*/}
                        {/*                        <td className='properties'>*/}
                        {/*                            <Input onPressEnter={e => {*/}
                        {/*                                modifyChain([{key: ['legend', 'data', seriesIndex], value: e.target.value}, {key: s.label.directory, value: e.target.value}]);*/}
                        {/*                                let tmp = JSON.parse(JSON.stringify(seriesProperty[seriesIndex]));*/}
                        {/*                                tmp.label.value = e.target.value;*/}
                        {/*                                setSeriesProperty(seriesProperty.map((newSeries, newSeriesIndex) => {*/}
                        {/*                                    if (newSeriesIndex === seriesIndex) return tmp;*/}
                        {/*                                    else return newSeries;*/}
                        {/*                                }));*/}
                        {/*                            }} placeholder={s.label.value}/>*/}
                        {/*                        </td>*/}
                        {/*                    </tr>*/}
                        {/*                    <tr className='properties'>*/}
                        {/*                        <td className='properties'>Colour</td>*/}
                        {/*                        <td className='properties'>*/}
                        {/*                            <InputColor initialValue={s.color.hexvalue} onChange={v => {*/}
                        {/*                                modify(s.color.directory, v.rgba);*/}
                        {/*                            }} placement="right" />*/}
                        {/*                        </td>*/}
                        {/*                    </tr>*/}
                        {/*                    <tr className='properties'>*/}
                        {/*                        <td className='properties'>Type</td>*/}
                        {/*                        <td className='properties'>*/}
                        {/*                            <Cascader options={DEFAULT_PROPERTIES.LEGEND.TYPE} onChange={v => {*/}
                        {/*                                if (v.length > 0) {*/}
                        {/*                                    modify(s.type.directory, v[0]);*/}
                        {/*                                    let tmp = JSON.parse(JSON.stringify(seriesProperty));*/}
                        {/*                                    tmp[seriesIndex].type.value = v[0];*/}
                        {/*                                    setSeriesProperty(tmp);*/}
                        {/*                                }*/}
                        {/*                            }} value={[s.type.value]}/>*/}
                        {/*                        </td>*/}
                        {/*                    </tr>*/}

                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </Collapse.Panel>;*/}
                        {/*        })}*/}
                        {/*    </Collapse>*/}
                        {/*</Collapse.Panel>*/}

                    </Collapse>
                </div>


            </div>
            <div id='editCharts__stage' className='editCharts__container--box'>

                <div className='box__title'>
                    Chart
                </div>
                <div className='box__content'>
                    <ReactEcharts option={presentCurrentOptions} />
                </div>

                <div className='box__title'>
                    Data
                </div>

                <div className='box__content'>
                    <div style={{overflow: 'scroll'}}>
                        {/*<Table columns={columns} dataSource={data} />*/}

                        {renderAxisTable && <AxisTable columns={columnsAxisCaptions} data={dataAxisCaptions} updateMyData={updateAxisData}/>}

                        <Table columns={columns.current} data={data} updateMyData={updateData}/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default EditChart;
