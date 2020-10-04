/**
 *   @file AddConnectionDialog.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   14/7/2020   Byron Tominson      Original
 *
 *   Test Cases: data-visualisation-app/src/tests/AddConnectionDialog.test.js
 *
 *   Functional Description:
 *   Modal for adding a connection
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */


/**
 * Imports
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Modal, Input, Select, Typography, Divider, Checkbox, Cascader, Result, message, Space} from 'antd';
import { Form } from 'antd';
import {useTable, usePagination} from 'react-table';
import './AddConnectionDialog.scss';
import { CSVReader } from 'react-papaparse';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import fileIcon from './../../assets/svg/file.svg';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';
import {useDropzone} from 'react-dropzone';
import Papa from 'papaparse';

/**
 * @param props passed from DataConnection class.
 * @return React Component
 */

const AddConnectionDialog = (props) => {

    const { Option } = Select;

    /** -------------- State, Reference, Memo Variables -------------- */

    const [visible, setVisible] = useState(true);
    const [importDataMode, setImportDataMode] = useState(false);
    const [inspectColumnsOnly, setInspectColumnsOnly] = useState(false);
    const [acceptableData, setAcceptableData] = useState(false);

    const [currentData, setCurrentData] = useState([]);
    const [currentColumns, setCurrentColumns] = useState([]);


    const [skipPageReset, setSkipPageReset] = useState(false);


    const {getRootProps, getInputProps, open, acceptedFiles, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'application/xml', 'text/xml', 'text/*', '.csv'],
        noClick: true,
        noKeyboard: true,
        onDropAccepted: function (droppedFiles) {

            setLoading(true);

            let extension = droppedFiles[0].name.split('.').pop();

            if (extension === 'csv') {
                Papa.parse(droppedFiles[0], {

                    complete: function (results, file) {
                        let dataResult = [];
                        for (let r = 0; r < results.data.length; r++) {
                            dataResult.push({
                                data: results.data[r],
                                errors: []
                            });
                        }
                        setInspectColumnsOnly(false);
                        onLoadedCSVFile(dataResult, file);
                    }
                });

            } else if (extension === 'xml' || extension === 'json') {
                let fileReader = new FileReader();
                fileReader.onload = function () {

                    let dataFields = (extension === 'xml' ? getXMLFields(fileReader.result) : getJSONFields(JSON.parse(fileReader.result)));

                    if (dataFields.length === 0) {

                        setFileError({
                            title: 'Invalid Format',
                            description: 'The fields from the given file could not be detected.'
                        });

                        setLoading(false);

                        setImportError(true);
                    } else {

                        setNonCSVFileFields(dataFields);
                        setNonCSVFileTypes(dataFields.map(() => {return 'string';}));
                        setNonCSVPrimaryKey(dataFields[0]);

                        setImportDataMode(true);
                        setInspectColumnsOnly(true);

                        importedFileObject.current = droppedFiles[0];
                        importedFileStringContents.current = fileReader.result;
                        alignContainer(false);
                    }
                };
                fileReader.readAsText(droppedFiles[0]);
            }
        }
    });
    const styleDropzone = useMemo(() => ({
        ...(isDragActive ? {borderColor: 'black'} : {}),
        ...(isDragAccept ? {borderColor: '#52c41a'} : {}),
        ...(isDragReject ? {borderColor: '#FF4D4F'} : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const [originalData] = useState(currentData);
    const dataBuffer = useRef([]);
    /** Currently mutable buffer index. */
    const currentBuffer = useRef(true);
    const storedPointers = useRef({});
    const dataChanges = useRef([]);


    const primaryColumns = useRef([]);
    const [selectablePrimaryColumns, setSelectablePrimaryColumns] = useState([{
        value: 'Select Column',
        label: 'default'
    }]);
    const currentPrimarySelection = useRef('default');
    const [primaryMessage, setPrimaryMessage] = useState('');
    const proposedTypes = useRef();
    const [importError, setImportError] = useState(false);
    const [fileError, setFileError] = useState(null);
    const refCSVReader = useRef(null);
    const [entityName, setEntityName] = useState('');
    const colNames = useRef([]);
    const selectedTypes = useRef([]);
    const [nonCSVFileFields, setNonCSVFileFields] = useState([]);
    const [nonCSVFileTypes, setNonCSVFileTypes] = useState([]);
    const [nonCSVPrimaryKey, setNonCSVPrimaryKey] = useState('');
    const [loading, setLoading] = useState(false);
    const importedFileObject = useRef();
    const importedFileStringContents = useRef('');
    const containerComponentRef = useRef(null);
    const [containerComponentStyles, setContainerComponentStyles] = useState({});

    /** --------------------------------------------- */


    /** -------------- Constants -------------- */

    const DATA_TYPES = {
        BOOLEAN: 0,
        INTEGER: 1,
        FLOAT: 2,
        STRING: 3,
        DATE: 4
    };

    const DATA_TYPES_STRINGS = [
        'boolean',
        'int',
        'float',
        'string',
        'date'
    ];

    const DATA_TYPE_REGEX = {
        boolean: /^(true|false|0|1)$/,
        integer: /^-?\d{1,8}$/,
        float: /^-?\d{1,23}\.\d{1,8}$/
    };

    const ERROR_TYPES = {
        TYPE: {
            message: '',
            validate: function () {

            }
        },
        PRIMARY_KEY: {
            message: '',
            validate: function () {

            }
        },
        QUOTES: {
            message: '',
            validate: function () {

            }
        }
    };

    const COMPONENT_DATA_TYPES = [{
        value: 'BOOLEAN',
        label: 'Boolean'
    }, {
        value: 'INTEGER',
        label: 'Integer'
    }, {
        value: 'FLOAT',
        label: 'Float'
    }, {
        value: 'STRING',
        label: 'String'
    }, {
        value: 'DATE',
        label: 'Date'
    }];

    const INVALID_FILE_ERROR = {
        EMPTY_FILE: {
            title: 'Empty File',
            description: 'Please upload a CSV file with at least one row of data.'
        },
        NO_DATA: {
            title: 'No Data',
            description: 'Please upload a CSV file with at least one data value.'
        }
    };
    /** --------------------------------------------- */

    /** -------------- Functions -------------- */

    function alignContainer(addMargin) {
        setContainerComponentStyles({marginLeft: (-0.5*containerComponentRef.current.offsetWidth + (addMargin ? -100 : 0)) + 'px'});
    }

    function getXMLFields(data){
        let fields = [];

        try {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, 'text/xml');
            if (!xmlDoc || !xmlDoc.childNodes) {
                return fields;
            }
            let level = xmlDoc;
            while (level.children && level.children[0] && !level.children[0].data) {
                level = level.children[0];
            }
            let parents = xmlDoc.getElementsByTagName(level.parentNode.tagName);
            // console.log(parents);
            if (parents && parents.length !== 0) {
                for (let i = 0; i < parents.length; i++) {
                    for (let j = 0; j < parents[i].childNodes.length; j++) {
                        // console.log(parents[i]);
                        let child = parents[i].childNodes[j].tagName;
                        if (child && !fields.includes(child)) {
                            fields.push(child);
                        }
                    }
                }
            } else {
                let children = xmlDoc.childNodes;
                for (let i = 0; i < children.length; i++) {
                    if (children[i]) {
                        let child = children[i].tagName;
                        if (child && !fields.includes(child)) {
                            fields.push(child);
                        }
                    }
                }
            }
            return fields;
        } catch (e) {
            //Invalid XML file
            console.log('Invalid XML format');
            // console.log(e);
            return [];
        }
    }

    function getJSONFields(data) {
        let fields = [];
        for (let i = 0; i < data.length; i++) {
            let temp = data[i];
            let keys = Object.keys(temp);
            fields = [...new Set([...fields, ...keys])];
        }
        return fields;
    }


    /**  Modify a single value inside the current EChart JSON object used.
     *
     *   @param key Array indicating the directory required to locate object inside root echart object
     *   @param value New value of the found key property.
     */
    function modifyAtomic([key, value]) {
        dataBuffer.current[+currentBuffer.current][key[0]][key[1]] = value;
    }

    function modify(key, value) {

        modifyAtomic([key, value]);

        setCurrentData(dataBuffer.current[+currentBuffer.current]);

        currentBuffer.current = !currentBuffer.current;
        dataChanges.current.push([key, value]);

        setTimeout(flushChanges, 100);
    }

    function flushChanges() {
        while (dataChanges.current.length > 0) {
            modifyAtomic(dataChanges.current.pop());
        }
    }

    function getStringDataType(stringValue) {
        /** Determine type of string value. */

        if (stringValue.match(DATA_TYPE_REGEX.boolean)) {
            return DATA_TYPES.BOOLEAN;
        } else if (stringValue.match(DATA_TYPE_REGEX.integer)) {
            return DATA_TYPES.INTEGER;
        } else if (stringValue.match(DATA_TYPE_REGEX.float)) {
            return DATA_TYPES.FLOAT;
        } else {
            /** Check if value is date. */
            if (!isNaN(Date.parse(stringValue))) {
                return DATA_TYPES.DATE;
            } else {
                /** Else value is string. */
                return DATA_TYPES.STRING;
            }
        }
    }

    function onLoadedCSVFile(data, fileInformation) {
        setEntityName(fileInformation.name);

        if (importError)
            setImportError(false);

        if (data.length === 0) {
            refCSVReader.current.removeFile();
            setFileError(INVALID_FILE_ERROR.EMPTY_FILE);
            setImportError(true);
            return;
        }

        let newData = [];
        let newColumns = [];

        let dataValue = '';
        let foundValue = false;

        let maxColumnCount = 0;
        for (let n = 0; n < data.length; n++)
            if (data[n].data.length > maxColumnCount)
                maxColumnCount = data[n].data.length;

        let outerLoopCount = Math.floor(maxColumnCount/26);
        let prefix = '', colName = '';

        for (let outer = 0; outer < (outerLoopCount === 0 ? 1 : 0); outer++) {
            prefix = (outerLoopCount === 0 ? '' : String.fromCharCode(65 + outer));
            for (let c = 0; c < maxColumnCount; c++) {
                colName = prefix + String.fromCharCode(65 + c);
                newColumns.push({
                    Header: colName,
                    accessor: colName,
                });

                colNames.current.push(colName);
            }
        }

        proposedTypes.current = new Array(colNames.current.length);
        let uniqueColumn = colNames.current.map(() => {return true;});

        for (let row = 0; row < data.length; row++) {
            newData.push({});
            for (let col = 0; col < data[row].data.length; col++) {

                if (data[row].errors.length > 0) {
                    refCSVReader.current.removeFile();
                    setFileError({
                        title: data[row].errors[0].type,
                        description: data[row].errors[0].message + '.'
                    });
                    setImportError(true);
                    return;
                }

                dataValue = data[row].data[col].trim();

                if (!foundValue && dataValue !== '')
                    foundValue = true;

                if (row === 0 || typeof proposedTypes.current[col] === 'undefined') {
                    proposedTypes.current[col] = getStringDataType(dataValue);
                } else if (getStringDataType(dataValue) !== proposedTypes.current[col]) {
                    // todo: allow for error correction
                    // newData[newData.length-1][colNames.current[col]].error = {};
                }

                if (data[row].data.length < maxColumnCount) {
                    // todo:
                }

                /** Determine if value in row is unique. */
                if (uniqueColumn[col]) {
                    for (let d = row; d < data.length; d++) {
                        if (dataValue === data[d].data[col]) {
                            uniqueColumn[col] = false;
                            break;
                        }
                    }
                }


                newData[newData.length-1][colNames.current[col]] = dataValue;
                storedPointers.current[colNames.current[col] + row] = [row, colNames.current[col]];
            }
        }

        selectedTypes.current = proposedTypes.current.map(v => {return DATA_TYPES_STRINGS[v];});

        if (!foundValue) {
            refCSVReader.current.removeFile();
            setFileError(INVALID_FILE_ERROR.NO_DATA);
            setImportError(true);
            return;
        }

        let newSelectableCols = [{
            value: 'default',
            label: 'Select Column'
        }];
        for (let u = 0; u < uniqueColumn.length; u++) {
            if (uniqueColumn[u])
                primaryColumns.current.push(colNames.current[u]);
            newSelectableCols.push({
                value: colNames.current[u],
                label: colNames.current[u]
            });
        }

        setSelectablePrimaryColumns(newSelectableCols);

        /** Data type analysis */
        dataBuffer.current[+currentBuffer.current] = newData;
        currentBuffer.current = !currentBuffer.current;
        dataBuffer.current[+currentBuffer.current] = newData.map((newDataItem) => {
            return newDataItem;
        });

        setCurrentColumns(newColumns);
        setCurrentData(newData);



        setLoading(false);
        setImportDataMode(true);
        alignContainer(true);
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
    };
    const tailLayout = {
        wrapperCol: { offset: 16, span: 1 },
    };

    /**
     * Update props value.
     */
    const onFinish = values => {
        var ulteredURI;

        if(values.dataSourceItem === 'OData'){
            ulteredURI = values.uri;
            props.addItem(ulteredURI, 0);
        }
        else if(values.dataSourceItem === 'GraphQL'){
            ulteredURI = values.uri;
            props.addItem(ulteredURI, 1);
        }

        props.changeState();
        setVisible(false);
    };

    /**
     * Handle finish error.
     */
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    /**
     * Actions for cancel
     */
    function handleCancel() {
        props.changeState();
        setVisible(false);
    }

    /**  React component for individual cell values within table component.
     */

    function EditableCell({value: initialValue, row: { index }, column: { id }, synchronizeData}) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value);
        }

        function onBlur() {
            synchronizeData(index, id, value);

            modify(storedPointers.current[id + index], value);
        }

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return <input className='EditableCell' value={value} onChange={onChange} onBlur={onBlur} style={{borderStyle: 'none'}} />;
    }


    const synchronizeData = (rowIndex, columnId, value) => {
        setSkipPageReset(true);
        setCurrentData(old =>
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
    };

    const defaultColumn = {
        Cell: EditableCell,
    };

    /** Custom Derived Component */

    function Table({ columns, data, synchronizeData }) {

        const rowClasses = useRef('');
        const [checkedRows, setCheckRows] = useState(data.map(() => {
            return true;
        }));
        const [checkedColumns, setCheckedColumns] = useState(columns.map(() => {
            return true;
        }));

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            page,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize },
        } = useTable({
                columns,
                data,
                initialState: { pageIndex: 0, pageSize: 10 },
                defaultColumn,
                synchronizeData
            },
            usePagination
        );

        return (
            <>
                <table {...getTableProps()}>
                    <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {checkedColumns.map((tableCheckboxHeader, tableCheckboxHeaderIndex) => {
                            return <th key={tableCheckboxHeaderIndex} className={'disabled_borderLeft ' + (tableCheckboxHeaderIndex === checkedColumns.length-1 ? 'disabled_borderRight ' : '')}>

                                <div style={{textAlign: 'center', marginBottom: '5px'}}>
                                    <Checkbox onChange={() => {
                                        setCheckedColumns(checkedColumns.map((tmp, tmp_index) => {
                                            return (tmp_index === tableCheckboxHeaderIndex ? !tmp : tmp);
                                        }));
                                    }} checked={checkedColumns[tableCheckboxHeaderIndex]} />
                                </div>
                                <div style={{padding: '5px'}}>
                                    <Cascader allowClear={false} options={COMPONENT_DATA_TYPES} defaultValue={[COMPONENT_DATA_TYPES[proposedTypes.current[tableCheckboxHeaderIndex]].label]} onChange={v => {
                                        if (v.length > 0)
                                            selectedTypes.current[tableCheckboxHeaderIndex] = DATA_TYPES_STRINGS[DATA_TYPES[v[0]]];
                                    }} />
                                </div>
                            </th>;
                        })}
                    </tr>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th></th>
                            <th className='inner_borderRight inner_borderBottom outer_borderLeft outer_borderTop '></th>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th {...column.getHeaderProps()} className={'table__headerCell outer_borderTop outer_borderBottom ' + (columnIndex === headerGroup.headers.length-1 ? 'outer_borderRight' : 'inner_borderRight ')} >{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((rowData, rowIndex) => {
                            prepareRow(rowData);

                            return (
                                <tr {...rowData.getRowProps()} >
                                    <td className={'disabled_borderBottom ' + (rowIndex === 0 ? 'disabled_borderTop' : '')}>
                                        {(rowData.index > 0 &&
                                            <Checkbox onChange={() => {
                                                setCheckRows(checkedRows.map((tmp, tmp_index) => {
                                                    return (tmp_index === rowData.index ? !tmp : tmp);
                                                }));
                                            }} checked={checkedRows[rowData.index]} />
                                        )}
                                    </td>

                                    <td className={'table__headerCell outer_borderLeft outer_borderRight ' + (rowIndex === pageSize-1 || rowData.index === currentData.length ? 'outer_borderBottom ' : 'inner_borderBottom')}>{rowData.index+1}</td>
                                        {rowData.cells.map((cellData, colIndex) => {

                                            rowClasses.current = '';
                                            if (rowData.original.hasOwnProperty('error')) {
                                                rowClasses.current += 'error ';
                                            }

                                            rowClasses.current += (checkedRows[pageSize*pageIndex + rowIndex] && checkedColumns[colIndex] ? 'included ' : 'excluded ');

                                            if (rowIndex < pageSize-1) {
                                                if (checkedColumns[colIndex]) {
                                                    if ((!checkedRows[pageSize*pageIndex + rowIndex+1] && checkedRows[pageSize*pageIndex + rowIndex]) || (checkedRows[pageSize*pageIndex + rowIndex+1] && !checkedRows[pageSize*pageIndex + rowIndex]))
                                                        rowClasses.current += 'outer_borderBottom ';
                                                    else
                                                        rowClasses.current += 'inner_borderBottom ';
                                                } else {
                                                    rowClasses.current += 'disabled_borderBottom ';
                                                }


                                            } else {
                                                if (checkedColumns[colIndex] && checkedRows[pageSize*pageIndex + rowIndex])
                                                    rowClasses.current += 'outer_borderBottom ';
                                                else
                                                    rowClasses.current += 'disabled_borderBottom ';
                                            }

                                            if (colIndex < rowData.cells.length-1) {
                                                if (((!checkedColumns[colIndex+1] && checkedColumns[colIndex]) || (checkedColumns[colIndex+1] && !checkedColumns[colIndex])) && checkedRows[pageSize*pageIndex + rowIndex])
                                                    rowClasses.current += 'outer_borderRight ';
                                                else
                                                    rowClasses.current += 'inner_borderRight ';
                                            } else {
                                                if (checkedColumns[colIndex])
                                                    rowClasses.current += 'outer_borderRight ';
                                                else
                                                    rowClasses.current += 'disabled_borderRight ';

                                            }

                                            return <td {...cellData.getCellProps()} className={rowClasses.current}>{cellData.render('Cell')}</td>;
                                        })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="pagination" style={{marginTop: '15px'}}>
                    <Space size={9}>
                        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}> First </Button>
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage}> Previous </Button>
                        <Button onClick={() => nextPage()} disabled={!canNextPage}> Next </Button>
                        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> Last </Button>
                        <span>
                            Page <strong> {pageIndex + 1} </strong> of <strong> {pageOptions.length} </strong>
                        </span>
                        <Cascader
                            allowClear={false}
                            options={
                                [10, 20, 30].map(pageSizeSelection => {
                                    return {
                                        value: pageSizeSelection,
                                        label: 'Show ' + pageSizeSelection + ' data values'
                                    };
                            })}
                            defaultValue={['Show 10 data values']}
                            onChange={v => {
                                setPageSize(v);
                            }} />
                    </Space>
                </div>
                <div style={{marginBottom: '40px'}}>
                    <Button type='primary' disabled={acceptableData} style={{float: 'right'}} onClick={() => {

                        function getColIndex(field) {
                            for (let c = 0; c < colNames.current.length; c++)
                                if (field === colNames.current[c])
                                    return c;
                            return 0;
                        }

                        let akey = 1234;
                        message.loading({ content: 'Uploading CSV file...', akey});
                        let requestFields = [];
                        for (let field in dataBuffer.current[+currentBuffer.current][0]) {
                            if (colNames.current.includes(field) && checkedColumns[getColIndex(field)]) {
                                requestFields.push(dataBuffer.current[+currentBuffer.current][0][field]);
                            }
                        }

                        let requestData = [];
                        for (let row = 1; row < dataBuffer.current[+currentBuffer.current].length; row++) {
                            if (checkedRows[row]) {
                                requestData.push([]);
                                for (let field in dataBuffer.current[+currentBuffer.current][row]) {
                                    if (colNames.current.includes(field) && checkedColumns[getColIndex(field)]) {
                                        requestData[requestData.length-1].push(dataBuffer.current[+currentBuffer.current][row][field]);
                                    }
                                }
                            }
                        }

                        request.suggestions.importFile(2, entityName, dataBuffer.current[+currentBuffer.current][0][(currentPrimarySelection.current === 'default' ? 'A' : currentPrimarySelection.current)], requestFields, selectedTypes.current, requestData, function(response) {

                            if (response === constants.RESPONSE_CODES.SUCCESS) {
                                message.success({ content: 'Successfully imported CSV file!', akey, duration: 2 });

                                props.changeState();
                            } else {
                                message.error({ content: 'Something went wrong. Please try again later.', akey, duration: 2 });
                            }

                        });
                    }}> Finish </Button>
                </div>
            </>
        );
    }

    // const resetData = () => setCurrentData(originalData);

    return (
        <div style={{marginLeft: '400px'}}>
            {(importDataMode ?
                <div className='csv__container'>
                    <div className='background__transparent'></div>
                    <div ref={containerComponentRef} style={containerComponentStyles} className='csv_importer'>
                        <div style={{border: '1px solid blue', backgroundColor: 'red'}}>
                            <div style={{float: 'left', fontSize: '16px', padding: '20px'}}>Inspect Data File</div>
                            <div style={{float: 'right', padding: '20px'}} onClick={props.changeState}><CloseOutlined /></div>
                        </div>
                        <Divider />

                        <div style={{paddingRight: '20px', paddingLeft: '20px', paddingBottom: '20px'}}>
                            {(inspectColumnsOnly ?
                                <div>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th className='generic__tableCell'>Field Name</th>
                                            <th className='generic__tableCell'>Data Type</th>
                                            <th className='generic__tableCell'>Primary Key</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {nonCSVFileFields.map((field, fieldIndex) => {
                                            return <tr key={fieldIndex}>
                                                <td>{field}</td>
                                                <td>
                                                    <Cascader
                                                        allowClear={false}
                                                        options={COMPONENT_DATA_TYPES}
                                                        defaultValue={[COMPONENT_DATA_TYPES[COMPONENT_DATA_TYPES.length-2].label]} onChange={v => {
                                                        if (v.length > 0)
                                                            setNonCSVFileTypes(nonCSVFileTypes.map((csvFileType, csvFileTypeIndex) => {
                                                                if (csvFileTypeIndex === fieldIndex) {
                                                                    return v[0];
                                                                } else {
                                                                    return csvFileType;
                                                                }
                                                            }));
                                                    }} />
                                                </td>
                                                <td>
                                                    <Checkbox onChange={() => {
                                                        setNonCSVPrimaryKey(nonCSVFileFields[fieldIndex]);
                                                    }} checked={nonCSVPrimaryKey === nonCSVFileFields[fieldIndex]} />
                                                </td>
                                            </tr>;
                                        })}

                                        </tbody>
                                    </table>
                                    <div>
                                        <Button type='primary' disabled={acceptableData} style={{float: 'right'}} onClick={() => {
                                            let extension = importedFileObject.current.name.split('.').pop();
                                            let akey = 234;
                                            message.loading({ content: 'Uploading ' + extension.toUpperCase() + ' file...', akey});

                                            request.suggestions.importFile((extension === 'xml' ? 3 : 4), importedFileObject.current.name, nonCSVPrimaryKey, nonCSVFileFields, nonCSVFileTypes, (extension === 'json' ? importedFileStringContents.current.replace(/(\r\n|\n|\r|\t)/gm,'') : importedFileStringContents.current), function(response) {
                                                if (response === constants.RESPONSE_CODES.SUCCESS) {
                                                    message.success({ content: 'Successfully imported ' + extension.toUpperCase() + ' file!', akey, duration: 2 });

                                                    props.changeState();
                                                } else {
                                                    message.error({ content: 'Something went wrong. Please try again later.', akey, duration: 2 });
                                                }
                                            });
                                        }}> Finish </Button>
                                    </div>
                                </div>
                            :
                                <>
                                    <div style={{marginBottom: '10px'}}>
                                    <Input addonBefore={'Table Name: '} placeholder={entityName} onChange={e => {setEntityName(e.target.value);} } />
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                    Unique Column: <Cascader allowClear={false} options={selectablePrimaryColumns} defaultValue={['Select Column']} onChange={v => {
                                        if (v.length > 0) {
                                            currentPrimarySelection.current = v[0];
                                            if (v[0] === 'default') {
                                                setPrimaryMessage('');
                                            } else {
                                                let found = false;
                                                for (let p = 0; p < primaryColumns.current.length; p++) {
                                                    if (primaryColumns.current[p] === v[0]) {
                                                        found = true;
                                                        break;
                                                    }
                                                }

                                                if (!found)
                                                    setPrimaryMessage('Some data values are not unique within this column.');
                                                else
                                                    setPrimaryMessage('');

                                                // todo: check if row is selected as in checkbox selected.
                                            }
                                        }
                                    }} /> <span>{primaryMessage}</span>
                                    </div>

                                    <div style={{overflowX: 'scroll'}}>
                                        <Table
                                            columns={currentColumns}
                                            data={currentData}
                                            synchronizeData={synchronizeData}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>


                :
                <Modal
                    title='Add data source'
                    visible={visible}
                    onCancel={handleCancel}
                    footer={[

                    ]}
                >
                    <Form
                        {...layout}
                        name='basic'
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name='dataSourceItem'
                            rules={[{ required: true, message: 'Please select your currentData source type' }]}
                        >
                            <Select
                                name='dataSourceType'
                                placeholder='Please select a data source type'>
                                <Option value='OData'>OData</Option>
                                <Option value='GraphQL'>GraphQL</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name='uri'
                            rules={[{ required: true, message: 'Please input your a currentData source URI' }]}
                        >
                            <Input placeholder='Please insert data source uri'/>
                        </Form.Item>

                        <Form.Item style={{textAlign: 'center'}}>
                            <Button type='primary'  htmlType='submit'>
                                Add
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{textAlign: 'center'}}>
                        <div style={{marginBottom: '35px'}}>
                            <span className='or__line or__left'/><span className='or__inline or__text'>OR</span><span className='or__line or__right'/>
                        </div>


                        {(importError &&
                            <Result
                                status="error"
                                title={fileError.title}
                                subTitle={fileError.description}
                            >
                            </Result>)}

                        {/*<CSVReader*/}
                        {/*    ref={refCSVReader}*/}
                        {/*    onFileLoad={onLoadedCSVFile}*/}
                        {/*    onError={onFileError}*/}
                        {/*    // onError={this.handleOnError}*/}
                        {/*    // noDrag*/}
                        {/*    // addRemoveButton*/}
                        {/*    // onRemoveFile={this.handleOnRemoveFile}*/}


                        {/*    style={{*/}
                        {/*        dropArea: {*/}
                        {/*            // border: '1px dashed #777777',*/}
                        {/*            borderWidth: '1px',*/}
                        {/*            borderRadius: 10,*/}
                        {/*            borderColor: '#777777',*/}
                        {/*            backgroundColor: '#f7f7f7',*/}
                        {/*            height: '200px'*/}
                        {/*        },*/}
                        {/*        dropFile: {*/}
                        {/*            border: '1px solid black',*/}
                        {/*            borderRadius: '5px',*/}
                        {/*            backgroundColor: 'white',*/}
                        {/*            background: 'white',*/}
                        {/*            width: '100%'*/}
                        {/*        },*/}
                        {/*        dropAreaActive: {*/}
                        {/*            borderColor: 'black',*/}
                        {/*            boxShadow: '0px 0px 13px 1px rgba(219,219,219,1)'*/}
                        {/*        },*/}
                        {/*        progressBar: {*/}
                        {/*            backgroundColor: 'black',*/}
                        {/*            height: '3px',*/}

                        {/*        },*/}
                        {/*        fileNameInfo: {*/}
                        {/*            color: 'black',*/}
                        {/*            fontFamily: 'Fira Code Light',*/}
                        {/*            fontSize: '12px',*/}
                        {/*            marginBottom: '10px'*/}
                        {/*            // borderRadius: 3,*/}
                        {/*            // fontSize: 14,*/}
                        {/*            // lineHeight: 1,*/}
                        {/*            // padding: '0 0.4em',*/}
                        {/*        },*/}
                        {/*        fileSizeInfo: {*/}
                        {/*            color: 'rgba(0.0, 0.0, 0.0, 0.0)',*/}
                        {/*            fontFamily: 'Fira Code Light',*/}
                        {/*            backgroundImage: `url(${fileIcon})`,*/}
                        {/*            backgroundRepeat: 'no-repeat',*/}
                        {/*            height: '55px'*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*    parseConfig={{*/}
                        {/*        step: (results, file) => {*/}
                        {/*            console.debug('im in step')*/}
                        {/*            // setImportDataMode(true);*/}
                        {/*        },*/}
                        {/*        complete: (results, file) => {*/}
                        {/*            console.debug('im in cmplete')*/}
                        {/*            // setImportDataMode(true);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <span>Drag or click to upload.</span>*/}
                        {/*</CSVReader>*/}

                        {(loading ?
                            <div style={{height: '200px'}}>
                                {constants.LOADER}
                            </div>
                        :
                            <div {...getRootProps({className: 'dropzone dropzone__custom', style: {...styleDropzone}})}>
                                <input {...getInputProps()} />
                                Drag and drop either a CSV, XML or JSON data file. <br/>
                                <Button  style={{marginTop: '25px'}} onClick={open}>Import Data File</Button>
                            </div>
                        )}

                    </div>

                </Modal>
            )}
        </div>
    );
};

export default AddConnectionDialog;
