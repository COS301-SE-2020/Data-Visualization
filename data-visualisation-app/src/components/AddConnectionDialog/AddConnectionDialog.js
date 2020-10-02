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
import {Button, Modal, Input, Select, Typography, Divider, Checkbox} from 'antd';
import { Form } from 'antd';
import {useTable, usePagination} from 'react-table';
import './AddConnectionDialog.scss';
import { CSVReader } from 'react-papaparse';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';

/**
  * @param props passed from DataConnection class.
  * @return React Component
*/

const AddConnectionDialog = (props) => {

    const { Option } = Select;
    const [visible, setVisible] = useState(true);
    const [importDataMode, setImportDataMode] = useState(false);
    const [acceptableData, setAcceptableData] = useState(false);

    const [currentData, setCurrentData] = useState([
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323,
            error: {
                title: 'the error title'
            }
        },
        {
            firstName: 'peter1',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter2',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter3',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter4',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter5',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter6',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'pet7er',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'pe8ter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'pe9ter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'pe10ter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'p11eter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'pe12ter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        }
    ]);

    const currentColumns_ = useRef([]);


    const [currentColumns, setCurrentColumns] = useState([
        {
            Header: 'Name',
            columns: [
                {
                    Header: 'First Name',
                    accessor: 'firstName',
                },
                {
                    Header: 'Last Name',
                    accessor: 'lastName',
                },
            ],
        },
        {
            Header: 'Info',
            columns: [
                {
                    Header: 'Age',
                    accessor: 'age',
                },
                {
                    Header: 'Visits',
                    accessor: 'visits',
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                },
                {
                    Header: 'Profile Progress',
                    accessor: 'progress',
                },
            ],
        }]);


    const currentColumns__ = useMemo(() => [
        {
            Header: 'Name',
            columns: [
                {
                    Header: 'First Name',
                    accessor: 'firstName',
                },
                {
                    Header: 'Last Name',
                    accessor: 'lastName',
                },
            ],
        },
        {
            Header: 'Info',
            columns: [
                {
                    Header: 'Age',
                    accessor: 'age',
                },
                {
                    Header: 'Visits',
                    accessor: 'visits',
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                },
                {
                    Header: 'Profile Progress',
                    accessor: 'progress',
                },
            ],
        }
    ], []);
    const columnTypes = useRef([]);


    // const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    //     // Disable click and keydown behavior
    //     noClick: true,
    //     noKeyboard: true
    // });
    // const onDrop = useCallback(acceptedFiles => {
    //     // Do something with the files
    //     console.debug('acceptedFiles', acceptedFiles);
    // }, []);



    // const onDrop = useCallback(acceptedFiles => {
    //     // Do something with the files
    //         console.debug('acceptedFiles', acceptedFiles);
    // }, [])






    // const {getRootProps, getInputProps, open, acceptedFiles, isDragActive, isDragAccept, isDragReject} = useDropzone({
    //     // Disable click and keydown behavior
    //     noClick: true,
    //     noKeyboard: true,
    //     onDrop: onDropCSVFile
    // });
    // const styleDropzone = useMemo(() => ({
    //     ...(isDragActive ? {borderColor: '#2196f3'} : {}),
    //     ...(isDragAccept ? {borderColor: '#00e676'} : {}),
    //     ...(isDragReject ? {borderColor: '#ff1744'} : {})
    // }), [
    //     isDragActive,
    //     isDragReject,
    //     isDragAccept
    // ]);

    const [originalData] = useState(currentData);
    const [skipPageReset, setSkipPageReset] = useState(false);

    // const files = acceptedFiles.map(file => {
    //
    //     console.debug('file.path', file.path);
    //     console.debug('isDragActive', isDragActive);
    //
    //     // <li key={file.path}>
    //     //     {file.path} - {file.size} bytes
    //     // </li>
    // });

    const [loadingData, setLoadingData] = useState(false);

    const dataBuffer = useRef([]);
    /** Currently mutable buffer index. */
    const currentBuffer = useRef(true);
    const storedPointers = useRef({});
    const dataChanges = useRef([]);

    const tableComponentMounted = useRef(false);





    // these are for the pagation, idk what it does

    const [pageCount, setPageCount] = React.useState(0)
    const fetchIdRef = React.useRef(0)

    const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current

        // Set the loading state
        // setLoading(true)

        // We'll even set a delay to simulate a server here
        // setTimeout(() => {
        //     // Only update the data if this is the latest fetch
        //     if (fetchId === fetchIdRef.current) {
        //         // const startRow = pageSize * pageIndex
        //         // const endRow = startRow + pageSize
        //
        //         // Your server could send back total page count.
        //         // For now we'll just fake it, too
        //
        //
        //         // setPageCount(Math.ceil(serverData.length / pageSize))
        //         setPageCount(2);
        //
        //         // setLoading(false)
        //     }
        // }, 1000);



        console.debug('temptmeptemp.current', temptmeptemp.current)

        if (pageIndex > 0)
            setCurrentData(dataBuffer.current[+currentBuffer.current].slice(pageSize * pageIndex, pageSize * pageIndex + pageSize));
        setPageCount(Math.ceil(dataBuffer.current[+currentBuffer.current].length / pageSize));



    }, [])


    const temptmeptemp = useRef(false);









    /** Constants */

    const DATA_TYPES = {
        BOOLEAN: 0,
        INTEGER: 1,
        FLOAT: 2,
        STRING: 3
    };

    /** -------------- Functions -------------- */



    /**  Modify a single value inside the current EChart JSON object used.
     *
     *   @param key Array indicating the directory required to locate object inside root echart object
     *   @param value New value of the found key property.
     */
    function modifyAtomic([key, value]) {

        console.debug('calling modifyAtomic with key', key, 'value', value)

        // let pointer = dataBuffer.current[+currentBuffer.current][key[0]];
        // for (let k = 1; k < key.length-1; k++) {
        //     pointer = pointer[key[k]];
        // }

        dataBuffer.current[+currentBuffer.current][key[0]][key[1]] = value;

        // console.debug('what is the pointer', pointer, 'key[key.length-1]', key[key.length-1])


        // pointer[key[key.length-1]] = value;
    }

    function modify(key, value) {


        console.debug('calling modify with key', key, 'value', value)

        modifyAtomic([key, value]);


        console.debug('what i snew new new data', dataBuffer.current[+!currentBuffer.current])

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

   function onLoadedCSVFile(data) {

        console.debug('data', data)

       // currentColumns.current = [];

       let newData = [];
       let newColumns = [];

       let regex = {
           boolean: /^(true|false|0|1)$/,
           integer: /^-?\d{1,8}$/,
           float: /^-?\d{1,23}\.\d{1,8}$/
       };

       let maxColumnCount = 0;
       for (let n = 0; n < data.length; n++)
           if (data[n].data.length > maxColumnCount)
               maxColumnCount = data[n].data.length;



       let outerLoopCount = Math.floor(maxColumnCount/26);
       let prefix = '', colName = '', colNames = [];


       console.debug('outerLoopCount', outerLoopCount)
       console.debug('maxColumnCount', maxColumnCount)

       for (let outer = 0; outer < (outerLoopCount === 0 ? 1 : 0); outer++) {
           prefix = (outerLoopCount === 0 ? '' : String.fromCharCode(65 + outer));
           for (let c = 0; c < maxColumnCount; c++) {
               colName = prefix + String.fromCharCode(65 + c);
               newColumns.push({
                   Header: colName,
                   accessor: colName,
               });

               colNames.push(colName);
           }
       }

       console.debug('colNames', colNames)

        for (let row = 0; row < data.length; row++) {
            newData.push({});
            for (let col = 0; col < data[row].data.length; col++) {
                if (data[row].data.length < maxColumnCount) {
                    // todo: later
                }
                newData[newData.length-1][colNames[col]] = data[row].data[col];
                storedPointers.current[colNames[col] + row] = [row, colNames[col]];
            }
        }

       // setImportDataMode(true);

        // console.debug('newData', newData);

       // tableComponentMounted.current = true;
        // setImportDataMode(true);


       // setImportDataMode(true);

       dataBuffer.current[+currentBuffer.current] = newData;
       currentBuffer.current = !currentBuffer.current;
       dataBuffer.current[+currentBuffer.current] = newData.map((newDataItem) => {
           return newDataItem;
       });

       console.debug('SHOULD BE THE SAME', dataBuffer.current[+currentBuffer.current], 'AND THIS', dataBuffer.current[+!currentBuffer.current])

       setCurrentColumns(newColumns);
       // setCurrentData(newData);


       setCurrentData(dataBuffer.current[+currentBuffer.current].slice(0, 10));


       setTimeout(function () {
           setImportDataMode(true);

           // setCurrentData(newData);
       }, 3000);


       // setImportDataMode(true);


       temptmeptemp.current = true;

   }

    function onFileError() {

    }

    // After currentData chagnes, we turn the flag back off
    // so that if currentData actually changes when we're not
    // editing it, the page is reset
    // useEffect(() => {
    //     // setSkipPageReset(false);
    //
    //
    //     // if (tableComponentMounted.current) {
    //     //     setImportDataMode(true);
    //     // }
    //
    //
    //
    //     // fetchData({ pageIndex, pageSize });
    //
    //
    //     console.debug('useeffect has run with', tableComponentMounted.current);
    //
    // }, []);


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

    function EditableCell({value: initialValue, row: { index }, column: { id }, updateMyData}) {
        const [value, setValue] = useState(initialValue);

        function onChange(e) {
            setValue(e.target.value);
        }

        function onBlur() {
            // have id + index
            console.debug('index', index, 'id', id)

            updateMyData(index, id, value);


            console.debug('storedPointers.current', storedPointers.current)
            console.debug('what is value', value)

            modify(storedPointers.current[id + index], value);
        }

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return <input className='EditableCell' value={value} onChange={onChange} onBlur={onBlur} style={{borderStyle: 'none'}} />;
    }

    // We need to keep the table from resetting the pageIndex when we
    // Update currentData. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original currentData
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setCurrentData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

// Set our editable cell renderer as the default Cell renderer
    // todo: just use editablecell in place of defaulcolumn
    const defaultColumn = {
        Cell: EditableCell,
    };

    /**
     * Custom Derived Component
     */
// Be sure to pass our updateMyData and the skipPageReset option




    function Table({
                       columns,
                       data,
                       fetchData,
                       pageCount: controlledPageCount,
                   }) {
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
            // Get the state from the instance
            state: { pageIndex, pageSize },
        } = useTable(
            {
                columns,
                data,
                initialState: { pageIndex: 0 }, // Pass our hoisted table state
                manualPagination: true, // Tell the usePagination
                // hook that we'll handle our own data fetching
                // This means we'll also have to provide our own
                // pageCount.
                pageCount: controlledPageCount,
            },
            usePagination
        )

        // Listen for changes in pagination and use the state to fetch our new data
        React.useEffect(() => {
            fetchData({ pageIndex, pageSize })
            console.debug('calling table useEffect', 'pageIndex', pageIndex, 'pageSize', pageSize)
        }, [fetchData, pageIndex, pageSize])

        // Render the UI for your table
        return (
            <>
      <pre>
        <code>
          {JSON.stringify(
              {
                  pageIndex,
                  pageSize,
                  pageCount,
                  canNextPage,
                  canPreviousPage,
              },
              null,
              2
          )}
        </code>
      </pre>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                  </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                    <tr>
                        {/*{loading ? (*/}
                        {/*    // Use our custom loading state to show a loading indicator*/}
                        {/*    <td colSpan="10000">Loading...</td>*/}
                        {/*) : (*/}
                            <td colSpan="10000">
                                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                                results
                            </td>
                        {/*)}*/}
                    </tr>
                    </tbody>
                </table>
                {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
                <div className="pagination">
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                    <span>
          Page{' '}
                        <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
                    <span>
          | Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
        </span>{' '}
                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        )
    }

    // Let's add a currentData resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => setCurrentData(originalData)

    function onFileChange(evv) {
        console.debug(evv);
        console.debug(evv);
    }

    return (
        <div style={{marginLeft: '400px'}}>



            {(importDataMode ?
                    <div className='csv__container'>
                        <div className='background__transparent'></div>
                        <div className='csv_importer'>
                            <div style={{border: '1px solid blue', backgroundColor: 'red'}}>
                                <div style={{float: 'left', fontSize: '16px', padding: '20px'}}>Inspect CSV Data</div>
                                <div style={{float: 'right', padding: '20px'}} onClick={props.changeState}><CloseOutlined /></div>
                            </div>
                            <Divider />
                            <div style={{padding: '20px'}}>


                                <Table
                                    columns={currentColumns}
                                    data={currentData}
                                    fetchData={fetchData}
                                    // loading={false}
                                    pageCount={pageCount}
                                />



                                {/*<Table*/}
                                {/*    columns={currentColumns}*/}
                                {/*    data={currentData}*/}
                                {/*    updateMyData={updateMyData}*/}
                                {/*    skipPageReset={skipPageReset}*/}
                                {/*/>*/}
                                <Button type='primary' disabled={acceptableData} > Finish</Button>
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
                            <span className='or__line or__left'/><span className='or__inline or__text'>OR</span><span className='or__line or__right'/>


                            {/*<div {...getRootProps({className: 'dropzone dropzone__custom', style: {...styleDropzone}})}>*/}
                            {/*    <input {...getInputProps()} />*/}
                            {/*    Drag and drop a CSV file. <br/>*/}
                            {/*    <Button  style={{marginTop: '25px'}} onClick={open}>Import CSV Data</Button>*/}
                            {/*</div>*/}

                            <CSVReader
                                onFileLoad={onLoadedCSVFile}
                                onError={onFileError}
                                // onError={this.handleOnError}
                                // noDrag
                                addRemoveButton
                                // onRemoveFile={this.handleOnRemoveFile}


                                style={{
                                    dropArea: {
                                        borderColor: 'pink',
                                        borderRadius: 10,
                                        backgroundColor: '#f7f7f7'
                                    }
                                }}
                                config={{
                                    step: (results, file) => {
                                        console.debug('im in step')
                                        // setImportDataMode(true);
                                    },
                                    complete: (results, file) => {
                                        // console.debug('im in cmplete')
                                        // setImportDataMode(true);
                                    }
                                }}
                            >
                                <span>Drag or click to upload.</span>
                            </CSVReader>

                        </div>

                    </Modal>
            )}
        </div>
    );
};

export default AddConnectionDialog;


// function Table({ columns, data, updateMyData, skipPageReset }) {
//
//     const rowClasses = useRef('');
//     const prevTableHeaders = useRef([
//         <th>nothing</th>
//     ]);
//     const [includedItems, setIncludedItems] = useState(data.map(() => {
//         return true;
//     }));
//
//     useEffect(() => {
//
//         console.debug('useeffect of table')
//
//         setSkipPageReset(false);
//
//
//         console.debug('upageCount', pageCount)
//         console.debug('rowsOptions', rowsOptions)
//
//     }, []);
//
//     // For this example, we're using pagination to illustrate how to stop
//     // the current page from resetting when our currentData changes
//     // Otherwise, nothing is different here.
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         prepareRow,
//         rows,
//         canPreviousPage,
//         canNextPage,
//         rowsOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data,
//             defaultColumn,
//             // use the skipPageReset option to disable page resetting temporarily
//             autoResetPage: !skipPageReset,
//             // updateMyData isn't part of the API, but
//             // anything we put into these options will
//             // automatically be available on the instance.
//             // That way we can call this function from our
//             // cell renderer!
//             updateMyData,
//         },
//         usePagination
//     )
//
//     // Render the UI for your table
//     return (
//         <>
//             <table {...getTableProps()}>
//                 <thead>
//                 {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                         {[<th key={-1}>nothing</th>].concat(headerGroup.headers.map(column => (
//                             <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//                         )))}
//                     </tr>
//                 ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                 {rows.map((row, i) => {
//                     prepareRow(row);
//                     // console.debug('row: ', row)
//
//                     rowClasses.current = '';
//                     if (row.original.hasOwnProperty('error')) {
//                         rowClasses.current += 'error ';
//                     }
//                     rowClasses.current += (includedItems[i] ? 'included' : '');
//
//                     return (
//                         <tr {...row.getRowProps()}>
//                             {row.cells.map(cell => {
//                                 return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                             })}
//                         </tr>
//                     );
//                     // return (
//                     //     <tr {...row.getRowProps()} className={rowClasses.current} >
//                     //         {[<td key={-1}><Checkbox onChange={() => {
//                     //             setIncludedItems(includedItems.map((tmp, tmp_index) => {
//                     //                 return (tmp_index === i ? !tmp : tmp);
//                     //             }));
//                     //         }} checked={includedItems[i]} /></td>].concat(row.cells.map(cell => {
//                     //             // console.debug('cell.row.original', cell.row.original)
//                     //             return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                     //         }))}
//                     //     </tr>
//                     // )
//                 })}
//                 </tbody>
//             </table>
//             <div className="pagination">
//                 <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                     {'<<'}
//                 </button>{' '}
//                 <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//                     {'<'}
//                 </button>{' '}
//                 <button onClick={() => nextPage()} disabled={!canNextPage}>
//                     {'>'}
//                 </button>{' '}
//                 <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                     {'>>'}
//                 </button>{' '}
//                 <span>
//           {/*Page{' '}*/}
//                     <strong>
//             {pageIndex + 1} of {pageCount}
//           </strong>{' '}
//         </span>
//                 <span>
//           | Go to page:{' '}
//                     <input
//                         type="number"
//                         // defaultValue={pageIndex + 1}
//                         onChange={e => {
//                             const page = e.target.value ? Number(e.target.value) - 1 : 0
//                             gotoPage(page)
//                         }}
//                         style={{ width: '100px' }}
//                     />
//         </span>{' '}
//                 <select
//                     value={pageSize}
//                     onChange={e => {
//                         setPageSize(Number(e.target.value))
//                     }}
//                 >
//                     {[10, 20, 30, 40, 50].map(pageSize => (
//                         <option key={pageSize} value={pageSize}>
//                             Show {pageSize}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </>
//     )
// }