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
import React, {useCallback, useEffect, useMemo, usePagination, useRef, useState} from 'react';
import {Button, Modal, Input, Select, Typography, Divider, Checkbox} from 'antd';
import { Form } from 'antd';
import {useTable} from 'react-table';
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
    const [importDataMode, setImportDataMode] = useState(true);
    const [acceptableData, setAcceptableData] = useState(false);

    const [data, setData] = useState([
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
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        },
        {
            firstName: 'peter',
            lastName: 'pan',
            age: 12,
            visits: 32,
            status: 'wer',
            progress: 323
        }
    ]);
    const columns = useMemo(() => [
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
        },
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

    const [originalData] = useState(data);
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

    /** Constants */

    const DATA_TYPES = {
        BOOLEAN: 0,
        INTEGER: 1,
        FLOAT: 2,
        STRING: 3
    };

    /** Functions */

   function onLoadedCSVFile(data) {

       let newData = [];

       let regex = {
           boolean: /^(true|false|0|1)$/,
           integer: /^-?\d{1,8}$/,
           float: /^-?\d{1,23}\.\d{1,8}$/
       };

       let maxColumnCount = 0;
       for (let n = 0; n < data.length; n++)
           if (data[n].length > maxColumnCount)
               maxColumnCount = data[n].length;

       let outerLoopCount = Math.floor(maxColumnCount/26);
       let prefix = '', colName = '', colNames = [];
       for (let outer = 0; outer < (outerLoopCount === 0 ? 1 : 0); outer++) {
           prefix = (outerLoopCount === 0 ? '' : String.fromCharCode(65 + outer));
           for (let c = 0; c < maxColumnCount; c++) {
               colName = prefix + String.fromCharCode(65 + c);
               columns.push({
                   Header: colName,
                   accessor: colName,
               });

               colNames.push(colName);
           }
       }

        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                newData.push({});
                if (data[row].length < maxColumnCount) {

                }
                // newData[newData.length-1][colNames[col]] = (dat)
            }
        }


            console.debug('thisi  s approvedFiles', data)
       if (data.length > 0) {
           var file = new File(["foo"], "foo.txt", {
               type: "text/plain",
           });
           console.debug('this is a new file', file);
           console.debug('thisi  s approvedFiles[0]', data[0])

           // approvedFiles[0]



       } else {
           // todo: handle invalid file
       }

       console.debug('approvedFiles, ', data)
   }

    function onFileError() {

    }

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    useEffect(() => {
        setSkipPageReset(false)
    }, [data])


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
    const EditableCell = ({
                              value: initialValue,
                              row: { index },
                              column: { id },
                              updateMyData, // This is a custom function that we supplied to our table instance
                          }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue)

        const onChange = e => {
            setValue(e.target.value)
        }

        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            updateMyData(index, id, value)
        }

        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return <input value={value} onChange={onChange} onBlur={onBlur} />
    }

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old =>
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

    function Table({ columns, data, updateMyData, skipPageReset }) {

        const rowClasses = useRef('');
        const prevTableHeaders = useRef([
            <th>nothing</th>
        ]);
        const [includedItems, setIncludedItems] = useState(data.map(() => {
            return true;
        }));

        useEffect(() => {

            setSkipPageReset(false)

        }, [data]);

        // For this example, we're using pagination to illustrate how to stop
        // the current page from resetting when our data changes
        // Otherwise, nothing is different here.
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            rows,
            canPreviousPage,
            canNextPage,
            rowsOptions,
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
                // use the skipPageReset option to disable page resetting temporarily
                autoResetPage: !skipPageReset,
                // updateMyData isn't part of the API, but
                // anything we put into these options will
                // automatically be available on the instance.
                // That way we can call this function from our
                // cell renderer!
                updateMyData,
            },
            usePagination
        )

        // Render the UI for your table
        return (
            <>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {[<th key={-1}>nothing</th>].concat(headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            )))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        console.debug('row: ', row)

                        rowClasses.current = '';
                        if (row.original.hasOwnProperty('error')) {
                            rowClasses.current += 'error ';
                        }
                        rowClasses.current += (includedItems[i] ? 'included' : '');

                        return (
                            <tr {...row.getRowProps()} className={rowClasses.current} >
                                {[<td key={-1}><Checkbox onChange={() => {
                                    setIncludedItems(includedItems.map((tmp, tmp_index) => {
                                        return (tmp_index === i ? !tmp : tmp);
                                    }));
                                }} checked={includedItems[i]} /></td>].concat(row.cells.map(cell => {
                                    // console.debug('cell.row.original', cell.row.original)
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                }))}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
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
            {/*{pageIndex + 1} of {rowsOptions.length}*/}
          </strong>{' '}
        </span>
                    <span>
          | Go to page:{' '}
                        <input
                            type="number"
                            // defaultValue={pageIndex + 1}
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

    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => setData(originalData)

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
                                    columns={columns}
                                    data={data}
                                    updateMyData={updateMyData}
                                    skipPageReset={skipPageReset}
                                />
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
                                rules={[{ required: true, message: 'Please select your data source type' }]}
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
                                rules={[{ required: true, message: 'Please input your a data source URI' }]}
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
                                onDrop={onLoadedCSVFile}
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
