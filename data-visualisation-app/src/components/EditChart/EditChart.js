/**
 *   @file EditChart.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Gian Uys      Original
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, {useEffect, useState, useRef} from 'react';
import {Collapse, Input, Checkbox, Button, InputNumber, Space, message, Dropdown, Menu} from 'antd';
import './EditChart.scss';
import ReactEcharts from 'echarts-for-react';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import * as constants from '../../globals/constants';
import { DownOutlined } from '@ant-design/icons';
import Box from '@material-ui/core/Box';

/**
 *   @brief Component to edit charts data and metadata.
 *   @param props React property with options passed as child that is the options of the chart to be edited.
 */
function EditChart(props) {

    const [boxStart, setBoxStart] = useState([100, 100]);
    const [boxSize, setBoxSize] = useState([100, 100]);
    const [dropdownCaptions, setDropdownCaptions] = useState([]);
    const [chartOptions, setChartOptions] = useState(props.options);
    const [gridData, setGridData] = useState({
        grid: [
        ],
    });

    const prevGridData = useRef({
        grid: [
        ],
    });
    const boxStartImmediate  = useRef([100, 100]);
    const boxSizeImmediate  = useRef([100, 100]);
    const boxStartInitial  = useRef([100, 100]);
    const moving = useRef(false);
    const type = useRef('');
    const optionsBuffer = useRef([]);
    /**
     *   Currently mutable buffer index.
     */
    const currentBuffer = useRef(true);
    const optionsChanges = useRef([]);


    function onMouseDown(event) {
        boxStartImmediate.current = [event.clientX, event.clientY];
        boxStartInitial.current = [event.clientX, event.clientY];
        setBoxStart(boxStartImmediate.current);
        moving.current = true;
    }

    function onMouseDrag(event) {
        if (moving.current) {
            if (event.clientX < boxStartInitial.current[0]) {
                // change x of boxstart
                boxSizeImmediate.current[0] = boxStartInitial.current[0] - event.clientX;
                boxStartImmediate.current[0] = event.clientX;
            } else {
                boxSizeImmediate.current[0] = event.clientX - boxStartInitial.current[0];
                boxStartImmediate.current[0] = boxStartInitial.current[0];
            }

            if (event.clientY < boxStartInitial.current[1]) {
                // change y of boxstart
                boxSizeImmediate.current[1] = boxStartInitial.current[1] - event.clientY;
                boxStartImmediate.current[1] = event.clientY;

            } else {
                boxSizeImmediate.current[1] = event.clientY - boxStartInitial.current[1];
                boxStartImmediate.current[1] = boxStartInitial.current[1];
            }
            setBoxSize([boxSizeImmediate.current[0], boxSizeImmediate.current[1]]);
            setBoxStart(boxStartImmediate.current);
        }
    }

    function onMouseUp() {
        moving.current = false;
    }

    function generateData() {
        // todo: optimize to not recheck things

        prevGridData.current.grid = [];

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

        // use chart type
        if (type.current === constants.CHART_TYPES.LINE) {
            if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('xAxis')) {
                if (optionsBuffer.current[+currentBuffer.current].xAxis.hasOwnProperty('data')) {

                    // add generic header
                    prevGridData.current.grid.push([]);
                    prevGridData.current.grid[prevGridData.current.grid.length-1].push({ readOnly: true, value: '' });
                    for (let i = 0; i < optionsBuffer.current[+currentBuffer.current].xAxis.data.length; i++) {
                        prevGridData.current.grid[prevGridData.current.grid.length-1].push({ value: String.fromCharCode(65 + i), readOnly: true });
                    }


                    prevGridData.current.grid.push([]);
                    prevGridData.current.grid[prevGridData.current.grid.length-1].push({ readOnly: true, value: 1 });
                    for (let i = 0; i < optionsBuffer.current[+currentBuffer.current].xAxis.data.length; i++) {
                        prevGridData.current.grid[prevGridData.current.grid.length-1].push({value: optionsBuffer.current[+currentBuffer.current].xAxis.data[i], pointers: [optionsBuffer.current[0].xAxis.data, optionsBuffer.current[1].xAxis.data], pointerOffset: i});
                    }

                }
            } else {
                message.error('no xAxis');
            }
            if (optionsBuffer.current[+currentBuffer.current].hasOwnProperty('series')) {
                if (optionsBuffer.current[+currentBuffer.current].xAxis.hasOwnProperty('data')) {

                    prevGridData.current.grid.push([]);
                    prevGridData.current.grid[prevGridData.current.grid.length-1].push({ readOnly: true, value: 2 });
                    for (let i = 0; i < optionsBuffer.current[+currentBuffer.current].series[seriesHasType].data.length; i++) {
                        prevGridData.current.grid[prevGridData.current.grid.length-1].push({value: optionsBuffer.current[+currentBuffer.current].series[seriesHasType].data[i], pointers: [optionsBuffer.current[0].series[seriesHasType].data, optionsBuffer.current[1].series[seriesHasType].data], pointerOffset: i});
                    }

                }
            } else {
                message.error('no series');
            }
        }

        setGridData(prevGridData.current);
    }

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

        let currentDropdownNames = new Array(Object.keys(BUTTONS).length);
        for (let property in BUTTONS) {
            currentDropdownNames[BUTTONS[property]] = BUTTONS_CAPTIONS[property];
        }

        setDropdownCaptions(currentDropdownNames);
    }, []);

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
            }
        }
    }

    function modify(key, value) {
        addProperty(optionsBuffer.current[+currentBuffer.current], key[0]);
        let pointer = optionsBuffer.current[+currentBuffer.current][key[0]];
        for (let k = 1; k < key.length-1; k++) {
            addProperty(pointer, key[k]);
            pointer = pointer[key[k]];
        }
        addProperty(pointer, key[key.length-1]);
        pointer[key[key.length-1]] = value;

        setChartOptions(optionsBuffer.current[+currentBuffer.current]);
        optionsChanges.current.push([optionsBuffer.current[+!currentBuffer.current], key, value]);
        currentBuffer.current = !currentBuffer.current;

        setTimeout(flushChanges, 1000);
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

    function onCellChanged(changes) {
        const grid = gridData.grid.map(row => [...row]);
        changes.forEach(({ cell, row, col, value }) => {
            cell.pointers[+currentBuffer.current][cell.pointerOffset] = value;
            optionsChanges.current.push([cell.pointers[+!currentBuffer.current], [cell.pointerOffset], value]);
            grid[row][col] = { ...grid[row][col], value };
        });
        setGridData({ grid });
        setChartOptions(optionsBuffer.current[+currentBuffer.current]);
        currentBuffer.current = !currentBuffer.current;

        setTimeout(flushChanges, 1000);
    }

    const BUTTONS = {
        V_ALIGNMENT: 0,
        H_ALIGNMENT: 1
    };

    const BUTTONS_CAPTIONS = {
        V_ALIGNMENT: 'Auto',
        H_ALIGNMENT: 'Auto'
    };

    const DEFAULT_PROPERTIES = {
        TITLE: {
            HORIZONTAL_ALIGNMENT: (
                <Menu onClick={e => {
                    setDropdownCaptions(dropdownCaptions.map((d, i) => {return (i === BUTTONS.H_ALIGNMENT ? e.key.charAt(0).toUpperCase() + e.key.substr(1) : d);}));
                    modify(['title', 'left'], e.key);
                }}>
                    <Menu.Item key="auto" >
                        Auto
                    </Menu.Item>
                    <Menu.Item key="left">
                        Left
                    </Menu.Item>
                    <Menu.Item key="center">
                        Center
                    </Menu.Item>
                    <Menu.Item key="right">
                        Right
                    </Menu.Item>
                </Menu>
            ),
            VERTICAL_ALIGNMENT: (
                <Menu onClick={e => {
                    setDropdownCaptions(dropdownCaptions.map((d, i) => {return (i === BUTTONS.V_ALIGNMENT ? e.key.charAt(0).toUpperCase() + e.key.substr(1) : d);}));
                    modify(['title', 'top'], e.key);
                }}>
                    <Menu.Item key="auto" >
                        Auto
                    </Menu.Item>
                    <Menu.Item key="top">
                        Top
                    </Menu.Item>
                    <Menu.Item key="middle">
                        Middle
                    </Menu.Item>
                    <Menu.Item key="bottom">
                        Bottom
                    </Menu.Item>
                </Menu>
            )
        }
    };

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
                        <div  className='box__content'>
                            <Collapse defaultActiveKey={['1']}>
                                <Collapse.Panel header="Title" key="1">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Text</td>
                                            <td><Input onPressEnter={e => {modify(['title', 'text'], e.target.value);}}/></td>
                                        </tr>
                                        <tr>
                                            <td>Size</td>
                                            <td><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'textStyle', 'fontSize'], parseInt(v));}} /></td>
                                        </tr>
                                        <tr>
                                            <td>Bold</td>
                                            <td><Checkbox onClick={e => {modify(['title', 'textStyle', 'fontWeight'], (e.target.checked ? 'bold' : 'normal'));}} /></td>
                                        </tr>
                                        <tr>
                                            <td>Horizontal Alignment</td>
                                            <td>
                                                <Dropdown overlay={DEFAULT_PROPERTIES.TITLE.HORIZONTAL_ALIGNMENT}>
                                                    <Button>
                                                        {dropdownCaptions[BUTTONS.H_ALIGNMENT]} <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Vertical  Alignment</td>
                                            <td>
                                                <Dropdown overlay={DEFAULT_PROPERTIES.TITLE.VERTICAL_ALIGNMENT}>
                                                    <Button>
                                                        {dropdownCaptions[BUTTONS.V_ALIGNMENT]} <DownOutlined />
                                                    </Button>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Collapse.Panel>
                                <Collapse.Panel header="Link" key="2">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Text</td>
                                            <td><Input onPressEnter={e => {modify(['title', 'subtext'], e.target.value);}}/></td>
                                        </tr>
                                        <tr>
                                            <td>Size</td>
                                            <td><InputNumber min={1} max={72} defaultValue={24} onChange={v => {modify(['title', 'subtextStyle', 'fontSize'], parseInt(v));}} /></td>
                                        </tr>
                                        <tr>
                                            <td>Bold</td>
                                            <td><Checkbox onClick={e => {modify(['title', 'subtextStyle', 'fontWeight'], (e.target.checked ? 'bold' : 'normal'));}} /></td>
                                        </tr>
                                        <tr>
                                            <td>Top Margin</td>
                                            <td><InputNumber min={1} max={300} defaultValue={56} onChange={v => {modify(['title', 'subtextStyle', 'lineHeight'], parseInt(v));}} /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Collapse.Panel>
                                <Collapse.Panel header="Legend" key="3">
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
                            <ReactDataSheet
                                data={gridData.grid}
                                valueRenderer={cell => cell.value}
                                onCellsChanged={onCellChanged}
                            />
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

                }}>Save</Button>
            </div>
        </div>
    );
}

export default EditChart;
