/**
 *   @file Suggestions.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   1/7/2020    Byron Tominson      Original
 *   1/8/2020    Gian Uys            Added add to dashboard functionality.
 *
 *   Functional Requirements:
 *   Displays a list of generated chart suggestions.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React, {useEffect, useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReactEcharts from 'echarts-for-react';
import {PlusCircleOutlined, CheckOutlined, ShareAltOutlined, BookOutlined, StarOutlined, FilterOutlined} from '@ant-design/icons';
import {Typography, Menu, Dropdown, Button, message, Form, Checkbox} from 'antd';
import FilterDialog from '../FilterDialog';
import './Suggestions.scss';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


function IGALoading() {
    return <div id='igaloading'>{constants.LOADER} <br/> <br/> <br/> Generating chart suggestions by the IGA...</div>;
}

/**
 *   @class Suggestions
 *   @brief Component to display the chart suggestions.
 *   @details Displays a list of generated chart suggestions.
 */
function Suggestions() {

    const [loadedFirst, setLoadedFirst] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentCharts, setCurrentCharts] = useState(null);
    const [dashboardSelection, setDashboardSelection] = useState([]);
    const [dashboardList, setDashboardList] = useState(['a', 'b', 'c']);
    const newDashboardSelection = useRef(null);
    const newCurrentCharts = useRef(null);

    useEffect(() => {

        // let newDashboardSelection, newCurrentCharts;

        if (request.user.isLoggedIn) {
            request.dashboard.list(function() {
                let newDashbhoardList = request.cache.dashboard.list.data.map((dashboarditem) => {
                    return dashboarditem.name;
                });
                setDashboardList(newDashbhoardList);
            });
        }

        let shouldcontinue = true;
        (async function () {
            for (let r = 0; shouldcontinue && r < 4; r++) {
                await new Promise(function (resolve) {
                    request.suggestions.graph('https://services.odata.org/V2/Northwind/Northwind.svc', function (result) {
                        if (result === constants.RESPONSE_CODES.SUCCESS) {
                            resolve(request.cache.suggestions.graph.current);
                        } else {
                            // todo: handle network error
                        }
                    });
                }).then(function (fetchedGraph) {
                    request.cache.suggestions.graph.list.push(fetchedGraph);
                    /**
                     *   Add newly an empty list of dashboard owners for the new chart.
                     */

                    if (request.user.isLoggedIn) {
                        if (dashboardSelection.length === 0) {
                            newDashboardSelection.current = [];
                            for (let g = 0; g < request.cache.suggestions.graph.list.length; g++) {
                                newDashboardSelection.current.push(dashboardList.map(() => {
                                    return false;
                                }));
                            }
                        } else {
                            newDashboardSelection.current.push(dashboardList.map(() => {
                                return false;
                            }));
                        }
                    }

                    setDashboardSelection(newDashboardSelection.current);
                    /**
                     *   Add newly fetched chart to list.
                     */
                    if (newCurrentCharts.current == null) {
                        newCurrentCharts.current = request.cache.suggestions.graph.list.map((options, index) => {
                            let newchart = {
                                options: null
                            };
                            newchart.options = JSON.parse(JSON.stringify(options));
                            if (newchart.options.title && newchart.options.title.text) {
                                newchart.title = newchart.options.title.text;
                                newchart.options.title.text = '';
                            }
                            return newchart;
                        });
                    } else {
                        newCurrentCharts.current.push({
                            options: null
                        });

                        newCurrentCharts.current[newCurrentCharts.current.length-1].options = JSON.parse(JSON.stringify(fetchedGraph));
                        if (fetchedGraph.title && fetchedGraph.title.text) {
                            newCurrentCharts.current[newCurrentCharts.current.length-1].title = fetchedGraph.title.text;
                            newCurrentCharts.current[newCurrentCharts.current.length-1].options.title.text = '';
                        }
                    }

                    setCurrentCharts(newCurrentCharts.current);

                    if (!loadedFirst)
                        setLoadedFirst(true);

                });
            }
        })().then(function () {
            setLoading(false);
        });

    }, []);


    // const [fieldTypes, setFieldTypes] = useState([]);

    // useEffect(() => {
        
    //     /**
    //       * Sets the fields for FilterDialog
    //     */
    //     var tempFields = [];
    //     setFieldTypes([]);
    //     request.user.fields = [];

    //     request.filter.list('https://services.odata.org/V2/Northwind/Northwind.svc', 'Orders', function(result) {
    //         if (result === constants.RESPONSE_CODES.SUCCESS) {
                
    //             request.user.fields.map((entityVal) => {
    //                 tempFields = tempFields.concat({value : entityVal});
    //             });
                
    //             console.log(tempFields);
    //             setFieldTypes(tempFields);
                
    //         }
    //     });
       

	// }, []);

    const [filterState, setFilterState] = React.useState(false);
    
    

    const classes = useStyles();

    function Suggestion(props) {
        const [isAdded, setIsAdded] = useState(false);

        const onFinish = values => {
            console.log('Success:', values);
          };
        
          const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
          };

        function onAddChartToDashboard(chart, dashboard) {

            if (dashboardSelection[chart][dashboard]) {
                request.graph.delete(request.cache.dashboard.list.data[dashboard].id, request.cache.suggestions.graph.list[chart].id, function(result) {
                    if (result === constants.RESPONSE_CODES.SUCCESS) {
                        message.success('Successfully  removed chart to dashboard!');
                        let newdashboardselection = JSON.parse(JSON.stringify(dashboardSelection));
                        newdashboardselection[chart][dashboard] = !newdashboardselection[chart][dashboard];
                        setDashboardSelection(newdashboardselection);
                    } else {
                        message.error('Something went wrong. Could not remove chart to dashboard!');
                    }
                });
            } else {

                let newid = '';
                let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for (let i = 0; i < 10; i++) {
                    newid += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                request.cache.suggestions.graph.list[chart].id = newid;
                request.graph.add(request.cache.dashboard.list.data[dashboard].id, currentCharts[chart].title, currentCharts[chart].options, {}, function(result) {
                    if (result === constants.RESPONSE_CODES.SUCCESS) {
                        message.success('Successfully  added chart to dashboard!');
                        let newdashboardselection = JSON.parse(JSON.stringify(dashboardSelection));
                        newdashboardselection[chart][dashboard] = !newdashboardselection[chart][dashboard];
                        setDashboardSelection(newdashboardselection);
                    } else {
                        message.error('Something went wrong. Could not add chart to dashboard!');
                    }
                });
            }


        }

        return (
            <div className='suggestion panel__shadow'>
                <div style={{marginBottom: '10px'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={10}>
                            <Typography.Title level={4}>{props.chartData.title}</Typography.Title>
                        </Grid>
                        <Grid item xs={2} style={{textAlign: 'right', fontSize: '20px'}}>

                            {request.user.isLoggedIn &&
                                <Dropdown overlay={(() => {
                                    return <Menu>
                                        {dashboardList.map((dashboardname, index) => {
                                            return <Menu.Item key={index} onClick={() => {onAddChartToDashboard(props.id, index);}}>

                                                <span>{dashboardname}</span>
                                                <span style={{float: 'right'}}>
                                                    {dashboardSelection[props.id][index] &&
                                                    <CheckOutlined />}
                                                </span>
                                            </Menu.Item>;
                                        })}
                                    </Menu>;
                                })()} placement="bottomLeft">
                                    {(isAdded ? <CheckOutlined /> : <PlusCircleOutlined />)}
                                </Dropdown>
                            }

                        </Grid>
                    </Grid>
                </div>
                {/*<ReactEcharts option={props.chartData.options} style={{height: '300px', width: '100%'}} />*/}
                <ReactEcharts option={props.chartData.options} />
                <div style={{marginTop: '10px'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={2}>
                            <ShareAltOutlined />
                        </Grid>
                        <Grid item xs={2}>
                            <BookOutlined />
                        </Grid>
                        <Grid item xs={2}>
                            <StarOutlined />
                        </Grid>
                        <Grid item xs={2}>
                            <Form
                                id = 'my-form'
                                name='basic'
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >

                                <Form.Item name={props.chartOption} valuePropName="checked">
                                    <Checkbox></Checkbox>
                                </Form.Item>

                            </Form>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }


    return (
        loadedFirst ?
                <div className={classes.root}>           
                    <Grid container spacing={3}>

                        {currentCharts.map((achart, index) => {
                            return <Grid item xs={12} md={6} lg={3} key={index}>
                                <Suggestion id={index} chartData={achart}/>
                            </Grid>;
                        })}

                        {loading && <Grid item xs={12} md={6} lg={3}>
                            <div id='suggestion__loading--container'>
                                <div id='suggestion__loading--loader'>
                                    {constants.LOADER}
                                </div>
                            </div>
                        </Grid>}

                    </Grid>
                    <Button id = 'filterButton' type = 'secondary' shape = 'round' icon={<FilterOutlined/>} onClick={() => setFilterState(true)}></Button>
                    <Button id = 'moreLikeThisButton' type = 'primary' shape = 'round' htmlType="submit" form="my-form"  size = 'large'>More like this</Button>
                    <main>
                        {
                            filterState ?
                                <FilterDialog setFState = {setFilterState}/>
                                :
                                null
                        }

                    </main>
                </div>
            :
                IGALoading()
    );
}

export default Suggestions;




/**
 *   @remark Code below may be required in the case of echarts width/height misbehaves.
 *   window.addEventListener('resize', function() {
        for (let n = 0; n < demotempoptions.length; n++) {
            tmp = chartPointers[n].getEchartsInstance();
            tmp.resize();
        }
    });
 *
 */

