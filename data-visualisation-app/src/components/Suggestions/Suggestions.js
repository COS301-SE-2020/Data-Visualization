import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReactEcharts from 'echarts-for-react';
import {PlusCircleOutlined, CheckOutlined, ShareAltOutlined, BookOutlined, StarOutlined, FilterOutlined} from '@ant-design/icons';
import {Typography, Menu, Dropdown, Button} from 'antd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FilterDialog from '../FilterDialog';

import './Suggestions.scss';

const { Title } = Typography;

const demotempoptions = [{
    legend: {
        data: ['Something'],
        fontFamily: 'Tahoma'
    },
    tooltip: {
        trigger: 'axis',
        formatter: 'Temperature : <br/>{b}km : {c}°C'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    yAxis: {
        type: 'category',
        axisLine: {onZero: false},
        axisLabel: {
            formatter: '{value} km'
        },
        boundaryGap: false,
        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
    },
    series: [
        {
            name: 'Something',
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetY: 4,
                color: {
                    type: 'linear',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [{
                        offset: 0, color: '#159957' // color at 0% position
                    }, {
                        offset: 1, color: '#155799' // color at 100% position
                    }],
                    global: false // false by default
                }
            },
            data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
        }
    ]
},


    {
        title: {
            text: 'Something',
            subtext: 'Something',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Something1', 'Something2', 'Something3', 'Something4', 'Something5']
        },
        series: [
            {
                name: 'Something22',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: 'Apples'},
                    {value: 310, name: 'Oranges'},
                    {value: 234, name: 'Bananas'},
                    {value: 135, name: 'Pineapples'},
                    {value: 1548, name: 'Lemons'}
                ],
                emphasis: {
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
        title: {
            text: '浏览器占比变化',
            subtext: '纯属虚构',
            top: 10,
            left: 10
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,250,0.2)'
        },
        legend: {
            type: 'scroll',
            bottom: 10,
            data: (function (){
                var list = [];
                for (var i = 1; i <=28; i++) {
                    list.push(i + 2000 + '');
                }
                return list;
            })()
        },
        visualMap: {
            top: 'middle',
            right: 10,
            color: ['red', 'yellow'],
            calculable: true
        },
        radar: {
            indicator: [
                { text: 'IE8-', max: 400},
                { text: 'IE9+', max: 400},
                { text: 'Safari', max: 400},
                { text: 'Firefox', max: 400},
                { text: 'Chrome', max: 400}
            ]
        },
        series: (function (){
            var series = [];
            for (var i = 1; i <= 28; i++) {
                series.push({
                    name: '浏览器（数据纯属虚构）',
                    type: 'radar',
                    symbol: 'none',
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        areaStyle: {
                            color: 'rgba(0,250,0,0.3)'
                        }
                    },
                    data: [{
                        value: [
                            (40 - i) * 10,
                            (38 - i) * 4 + 60,
                            i * 5 + 10,
                            i * 9,
                            i * i /2
                        ],
                        name: i + 2000 + ''
                    }]
                });
            }
            return series;
        })()
    },

    {
        color: [
            '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'
        ],
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        animation: false,
        series: [
            {
                type: 'sankey',
                bottom: '10%',
                focusNodeAdjacency: 'allEdges',
                data: [
                    {name: 'a'},
                    {name: 'b'},
                    {name: 'a1'},
                    {name: 'b1'},
                    {name: 'c'},
                    {name: 'e'}
                ],
                links: [
                    {source: 'a', target: 'a1', value: 5},
                    {source: 'e', target: 'b', value: 3},
                    {source: 'a', target: 'b1', value: 3},
                    {source: 'b1', target: 'a1', value: 1},
                    {source: 'b1', target: 'c', value: 2},
                    {source: 'b', target: 'c', value: 1}
                ],
                orient: 'vertical',
                label: {
                    position: 'top'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                }
            }
        ]
    }
];




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



// window.addEventListener('resize', function() {
//     for (let n = 0; n < demotempoptions.length; n++) {
//         tmp = chartPointers[n].getEchartsInstance();
//         tmp.resize();
//     }
// });

function Suggestions(props) {



    const back = () => {
        props.setStage('entities');
    };

    const [filterState, setFilterState] = React.useState(false);

    const classes = useStyles();

    // let chartPointers, tmp;

    function Suggestion(props) {
        const [isAdded, setIsAdded] = useState(false);


        function onAddChartToDashboard(chart, dashboard) {
            console.log(chart + ' has been added to ' + dashboard);
            setIsAdded(true);
        }

        // will receive dashboard list in props
        let dashboardMenu = (
            <Menu>
                <Menu.Item onClick={() => {onAddChartToDashboard(0, 1)}}>
                    dashboard 1
                </Menu.Item>
                <Menu.Item>
                    dashboard 2
                </Menu.Item>
                <Menu.Item>
                    dashboard 3
                </Menu.Item>
                <Menu.Item>
                    dashboard 4
                </Menu.Item>
            </Menu>
        );

        return (
            
            <div className='suggestion panel__shadow'>
                <div style={{marginBottom: '10px'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={10}>
                            <Typography.Title level={4}>Chart Title</Typography.Title>
                        </Grid>
                        <Grid item xs={2} style={{textAlign: 'right', fontSize: '20px'}}>
                            <Dropdown overlay={
                                <Menu>
                                    <Menu.Item onClick={() => {onAddChartToDashboard(0, 1)}}>
                                        dashboard 1
                                        {isAdded &&
                                        <CheckOutlined />}
                                    </Menu.Item>
                                    <Menu.Item>
                                        dashboard 2
                                    </Menu.Item>
                                    <Menu.Item>
                                        dashboard 3
                                    </Menu.Item>
                                    <Menu.Item>
                                        dashboard 4
                                    </Menu.Item>
                                </Menu>
                            } placement="bottomLeft">
                                {(isAdded ? <CheckOutlined /> : <PlusCircleOutlined />)}
                            </Dropdown>
                        </Grid>
                    </Grid>
                </div>
                {/*<ReactEcharts ref={(e) => { chartPointers[props.id] = e; }}  option={props.chartOption} style={{height: '300px', width: '100%'}} />*/}
                <ReactEcharts option={props.chartOption} style={{height: '300px', width: '100%'}} />
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
                    </Grid>
                </div>
            </div>);
    }


    // chartPointers = new Array(demotempoptions.length);
    let charts = [];
    let keyee = 0;
    for (let n = 0; n < demotempoptions.length; n++) {
        charts.push(
            <Grid item xs={12} md={6} lg={3} key={n}>
                <Suggestion id={n} chartOption={demotempoptions[n]}/>
            </Grid>);
        keyee++;
    }

    return (
        <div className={classes.root}>
            <span id = 'headingSpan'>
                <Button id = 'backButton' icon={<ArrowBackIosIcon />} onClick={back}></Button>
                <Typography>
                    <Title id = 'titleText'>Suggestions</Title>
                </Typography>
            </span>
            <div id = 'filterDiv'>
                    <Button id = 'filterButton' icon={<FilterOutlined />} onClick={() => setFilterState(true)}>Filter</Button>
            </div> 
            <Grid container spacing={3}>
                {charts}
            </Grid>
            <main>
                {
                    filterState ? 
            
                    <FilterDialog setFState = {setFilterState}/>
            
                    :
                    null
                }
        
        </main>
        </div>
    );
};

export default Suggestions;
