/**
 *   @file EditChart.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys           Original
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, {useEffect, useState, useRef, usePagination} from 'react';
import {Collapse, Input, Checkbox, Button, InputNumber, Space, message, Dropdown, Menu, Cascader} from 'antd';
import './EditChart.scss';
import ReactEcharts from 'echarts-for-react';
import * as constants from '../../globals/constants';
import Box from '@material-ui/core/Box';
import { useTable } from 'react-table';
import InputColor from 'react-input-color';
import request from '../../globals/requests';

/**
 *   @brief Component to edit charts data and metadata.
 *   @param props React property with options passed as child that is the options of the chart to be edited.
 */
function EditChart(props) {

    const [chartOptions, setChartOptions] = useState(props.options);
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
                    return 'Y-Axis';
                case 1:
                    return 'X-Axis';
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
        // if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis')) {
        //     if (optionsBuffer.current[+currentBuffer.current].xAxis.hasOwnProperty('data')) {
        //         /**
        //          *   Add xAxis row to data object.
        //          */
        //         prevGridData.current.grid.push({});
        //         prevGridData.current.grid[prevGridData.current.grid.length-1].push({ readOnly: true, value: 'X-Axis Labels', colSpan: 2 });
        //         for (let i = 0; i < COLUMNS.length-1 + optionsBuffer.current[+currentBuffer.current].xAxis.data.length; i++) {
        //             if (i < COLUMNS.length-1)
        //                 prevGridData.current.grid[prevGridData.current.grid.length-1].push({ value: '', readOnly: true });
        //             else
        //                 prevGridData.current.grid[prevGridData.current.grid.length-1].push({ value: optionsBuffer.current[+currentBuffer.current].xAxis.data[i - (COLUMNS.length-1)], pointers: [optionsBuffer.current[0].xAxis.data, optionsBuffer.current[1].xAxis.data], pointerOffset: i });
        //         }
        //     }
        // }

        /** Add series rows to data object. */
        if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
            for (let s = 0; s < optionsBuffer.current[+currentBuffer.current].series.length; s++) {
                if (optionsBuffer.current[+currentBuffer.current].series[s].hasOwnProperty('data')) {
                    /**
                     *   Add data row with "Series..." span over n data dimension.
                     */
                    if (optionsBuffer.current[+currentBuffer.current].series[s].data.length > 0) {
                        if (Array.isArray(optionsBuffer.current[+currentBuffer.current].series[s].data[0])) {
                            for (let dimension = 0; dimension < optionsBuffer.current[+currentBuffer.current].series[s].data[0].length; dimension++) {
                                prevGridData.current.grid.push({});
                                tmp = prevGridData.current.grid.length-1;

                                if (dimension === 0) {
                                    prevGridData.current.grid[tmp][keyLookup[0]] = 'Series ' + (s+1).toString();
                                    seriesProperty.push({name: 'Series ' + (s+1).toString()});
                                    prevGridData.current.grid[tmp]['rowspan'] = optionsBuffer.current[+currentBuffer.current].series[s].data[0].length;
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
                                        prevGridData.current.grid[tmp][keyLookup[i]] = optionsBuffer.current[+currentBuffer.current].series[s].data[i - (keyLookup.length-dataLength)][dimension];
                                        storedPointers.current[tmp + keyLookup[i]] = ['series', s, 'data', i - (keyLookup.length-dataLength), dimension];
                                    }
                                }
                            }
                        } else {
                            // todo: integrate code below
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
                        }
                    } else {
                        throw 'data is empty';
                    }

                } else if (optionsBuffer.current[+currentBuffer.current].series.hasOwnProperty('value')) {

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

        setChartOptions(optionsBuffer.current[+currentBuffer.current]);
        currentBuffer.current = !currentBuffer.current;
        optionsChanges.current.push([optionsBuffer.current[+currentBuffer.current], key, value]);

        setTimeout(flushChanges, 100);
    }

    function modifyChain(eventChain) {
        for (let ev = 0; ev < eventChain.length; ev++) {
            modifyAtomic(eventChain[ev].key, eventChain[ev].value);
            optionsChanges.current.push([optionsBuffer.current[+!currentBuffer.current], eventChain[ev].key, eventChain[ev].value]);
        }

        setChartOptions(optionsBuffer.current[+currentBuffer.current]);
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

        setChartOptions(optionsBuffer.current[+currentBuffer.current]);
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
                                        return <td rowSpan={2} className='datatable__spanning'>{cell.row.original.series}</td>;
                                    else
                                        return null;
                                } else if (cellIndex < 2) {
                                    return <td className={(i === 0 ? 'datatable__top' : 'datatable') + (cellIndex > 1 ? ' datatable__editable' : '')}>{cell.row.original.dimension}</td>;
                                } else {
                                    return <td {...cell.getCellProps()} className={(i === 0 ? 'datatable__top' : 'datatable') + (cellIndex > 1 ? ' datatable__editable' : '')}>{cell.render('Cell')}</td>;
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

            {/*<div style={{position: 'fixed', top: boxStart[1] + 'px', left: boxStart[0] + 'px', width: boxSize[0] + 'px', height: boxSize[1] + 'px', backgroundColor: 'black', opacity: '0.2', zIndex: '100'}}></div>*/}
            <div id='editCharts__header'>
                <Space size={9} align="center">
                    <Button >Undo</Button>
                    <Button >Redo</Button>
                </Space>
            </div>

            <Box height={600} width="100%">
            {/*<Grid container spacing={1} id='editCharts__container'>*/}
            {/*    <Grid item xs={3} style={{border: '1px solid green' }} >*/}
                    <Box style={{overflowY: 'scroll'}} mx={0.5} width={400} display='inline-block' height='100%' className='editCharts__container--box'>
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
                                            <td className='properties'><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'subtextStyle', 'fontSize'], parseInt(v));}} /></td>
                                        </tr>
                                        <tr className='properties'>
                                            <td className='properties'>Horizontal Alignment</td>
                                            <td className='properties'>
                                                <Cascader options={DEFAULT_PROPERTIES.LEGEND.HORIZONTAL_ALIGNMENT} onChange={v => {modify(['title', 'left'], v);}} value={['Auto']}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='properties'>Vertical  Alignment</td>
                                            <td className='properties'><InputNumber min={1} max={300} defaultValue={56} onChange={v => {modify(['title', 'subtextStyle', 'lineHeight'], parseInt(v));}} /></td>
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
                                                        <td className='properties'>Colour</td>
                                                        <td className='properties'>
                                                            <InputColor initialValue={s.color.hexvalue} onChange={v => {
                                                                modify(s.color.directory, v.rgba);
                                                            }} placement="right" />
                                                        </td>
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

                                                    </tbody>
                                                </table>
                                            </Collapse.Panel>;
                                        })}
                                    </Collapse>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    </Box>
                {/*</Grid>*/}
                {/*<Grid item xs={5} >*/}
                <Box style={{overflowY: 'scroll'}} mx={0.5} width={500} display='inline-block' height='100%' className='editCharts__container--box'>
                    <div className='box__title'>
                        Chart
                    </div>
                    <div className='box__content'>
                        <ReactEcharts option={chartOptions} />
                    </div>
                </Box>
                {/*</Grid>*/}
                {/*<Grid item xs={4} >*/}
                <Box style={{overflowY: 'scroll'}} mx={0.5} width={600} display='inline-block' height='100%' className='editCharts__container--box'>
                    <div className='box__title'>
                        Data
                    </div>
                    <div className='box__content'>
                        <div>
                            {/*<Table columns={columns} dataSource={data} />*/}

                            <Table columns={columns.current} data={data} updateMyData={updateData}/>
                        </div>
                        <div className='box__content'>
                            <Button onClick={
                                () => {
                                }
                            }>Update</Button>
                        </div>
                    </div>
                </Box>
            {/*     </Grid>*/}
            {/* </Grid>*/}
            </Box>
            <div id='editCharts__footer'>
                <Button style={{float: 'right'}} onClick={() => {
                    message.loading('Saving dashboard...');

                    // request.graph.update(props.dashboardID, request.cache.graph.list[r].id, fields, fielddata, function(result) {
                    //     // todo: handle error
                    //     resolve(true);
                    // });
                    //
                    // (async function() {
                    //     for (let r = 0; r < presentDashboard.chartNames.length; r++) {
                    //         await new Promise(function(resolve){
                    //             let fields = [];
                    //             let fielddata = [];
                    //             fielddata.push(presentDashboard.chartNames[r]);
                    //             fields.push('title');
                    //             if (currentLayout.current != null) {
                    //                 fields.push('metadata');
                    //                 fielddata.push({
                    //                     // lg: {
                    //                     w: currentLayout.current[r].w,
                    //                     h: currentLayout.current[r].h,
                    //                     x: currentLayout.current[r].x,
                    //                     y: currentLayout.current[r].y
                    //                     // },
                    //                     // md: [],
                    //                     // sm: [],
                    //                     // xs: [],
                    //                     // xxs: []
                    //                 });
                    //             }
                    //             request.graph.update(props.dashboardID, request.cache.graph.list[r].id, fields, fielddata, function(result) {
                    //                 // todo: handle error
                    //                 resolve(true);
                    //             });
                    //         } );
                    //     }
                    // })().then(function() {
                    //     message.success('Changes saved!');
                    //
                    //     setEditMode(!editMode);
                    // });
                }}>Save</Button>
            </div>
        </div>
    );
}

export default EditChart;
