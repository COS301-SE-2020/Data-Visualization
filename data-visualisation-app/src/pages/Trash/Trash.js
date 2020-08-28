/**
 *   @file Trash.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   15/7/2020   Byron Tominson      Original
 *   8/8/2020    Gian Uys            Added functionality
 *
 *   Test Cases: data-visualisation-app/src/tests/Trash.test.js
 *
 *   Functional Description:
 *   Holds deleted items
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */


/**
  * Imports
*/
import React from 'react';
import Grid from '@material-ui/core/Grid';
import {Button, message, Typography, Spin, Empty} from 'antd';
import ReactEcharts from 'echarts-for-react';
import './Trash.scss';
import request from '../../globals/requests';
import * as constants from '../../globals/constants';

/**
  * @return React Component
*/
class Trash extends React.Component {

    static charts = null;
    static DELIMITER_OUTER = '^';
    static DELIMITER_INNER = '|';

    constructor(props) {
        super(props);
        if (localStorage.getItem('trashedCharts') !== '') {
            Trash.charts = Trash.parseStoredTrash(localStorage.getItem('trashedCharts'));
        }

        this.state = {charts: Trash.charts, restoring: this.prepareRestoringArray()};
    }

    prepareRestoringArray() {
        if (Trash.charts == null) {
             return [];
        } else {
            let restoringArray = [];
            for (let o = 0; o < Trash.charts.length; o++) {
                for (let c = 0; c < Trash.charts[o].charts.length; c++) {
                    restoringArray.push(false);
                }
            }
            return restoringArray;
        }
    }

    getChartIndex(dashboardIndex, chartIndex) {
        let index = 0;
        for (let o = 0; o < this.state.charts.length; o++) {
            if (o === dashboardIndex) {
                for (let c = 0; c < Trash.charts[o].charts.length; c++) {
                    if (c === chartIndex) {
                        index += chartIndex;
                        break;
                    }
                }
                break;
            }
            index += this.state.charts[o].charts.length;
        }

        return index;
    }

    /**
     * Decodes string stored within local storage.
     *
     * @param storedString String stored in local storage's "trashedCharts" item.
     * @return Array of dashboards with associated charts from the parsed string value.
     */
    static parseStoredTrash(storedString) {
        if (storedString != null && typeof storedString !== 'undefined' && storedString !== '') {
            if (storedString.includes(Trash.DELIMITER_OUTER)) {
                storedString = storedString.split(Trash.DELIMITER_OUTER);

                for (let s = 0; s < storedString.length; s++) {
                    storedString[s] = JSON.parse(storedString[s]);
                    storedString[s].charts = storedString[s].charts.split(Trash.DELIMITER_INNER);
                    for (let c = 0; c < storedString[s].charts.length; c++) {
                        storedString[s].charts[c] = JSON.parse(storedString[s].charts[c]);
                    }
                }

            } else {
                storedString = [JSON.parse(storedString)];
                storedString[0].charts = storedString[0].charts.split(Trash.DELIMITER_INNER);

                for (let s = 0; s < storedString.length; s++) {
                    for (let c = 0; c <  storedString[s].charts.length; c++) {
                        storedString[s].charts[c] = JSON.parse(storedString[s].charts[c]);
                    }
                }
            }
        }

        return storedString;
    }

    /**
     * Encodes and stores array of dashboards with associated charts into a single string value.
     */
    static encodeStoredTrash() {
        let storedString = '';
        let chartsArray = '';
        let chartObjectPointer = null;
        for (let s = 0; s < Trash.charts.length; s++) {
            chartObjectPointer = JSON.parse(JSON.stringify(Trash.charts[s]));
            chartsArray = '';
            for (let c = 0; c <  Trash.charts[s].charts.length; c++) {
                chartsArray += JSON.stringify(Trash.charts[s].charts[c]);
                if (c !== Trash.charts[s].charts.length-1) {
                    chartsArray += Trash.DELIMITER_INNER;
                }
            }
            chartObjectPointer.charts = chartsArray;
            storedString += JSON.stringify(chartObjectPointer);
            if (s !== Trash.charts.length-1) {
                storedString += Trash.DELIMITER_OUTER;
            }
        }

        localStorage.setItem('trashedCharts', storedString);
    }

    static removeDashboard(dashboard) {
    }

    /**
     * Add a newly deleted chart to the Trash.
     *
     * @param owner String value of the dashboard name that owns the chart to be added.
     * @param chartData JSON object of the chart data.
     * @param dashboardID String value of the dashboard ID.
     */
    static addChart(owner, chartData, dashboardID) {
        let storedString = localStorage.getItem('trashedCharts');
        let chartsArray = '';
        let chartObjectPointer = null;
        if (storedString === '' || storedString == null || typeof storedString === 'undefined') {
            Trash.charts = [{
                dashboard: owner,
                dashboardID: dashboardID,
                charts: [{chartData: chartData}]
            }];
        } else {
            Trash.charts = Trash.parseStoredTrash(localStorage.getItem('trashedCharts'));
            if (storedString.includes('"dashboardID":' + dashboardID) && Trash.charts != null && Trash.charts.length > 0) {
                for (let o = 0; o < Trash.charts.length; o++) {
                    if (Trash.charts[o].dashboard === owner) {
                        chartObjectPointer = Trash.charts[o];
                        break;
                    }
                }
            } else {
                Trash.charts.push({
                    dashboard: owner,
                    dashboardID: dashboardID,
                    charts: []
                });
                chartObjectPointer = Trash.charts[Trash.charts.length-1];
            }

            chartObjectPointer.charts.push({
                chartData: chartData
            });
        }
        Trash.encodeStoredTrash();
    }

    /**
     * Removes a chart from the Trash.
     *
     * @param dashboardID String value of the dashboard ID.
     * @param chartID String value of the chart ID.
     *
     */
    static removeChart(dashboardID, chartID) {
        for (let o = 0; o < Trash.charts.length; o++) {
            if (Trash.charts[o].dashboardID === dashboardID) {
                for (let c = 0; c < Trash.charts[o].charts.length; c++) {
                    if (Trash.charts[o].charts[c].chartData.id === chartID) {
                        if (Trash.charts[o].charts.length === 1) {
                            Trash.charts.splice(o, 1);
                        } else {
                            Trash.charts[o].charts.splice(c, 1);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }

    onRestoreClick(dashboardID, chart, chartIndex) {

        this.setState({restoring: this.state.restoring.map((rest, index) => {
            return index === chartIndex;
        })});
        let outerthis = this;
        request.graph.add(dashboardID, chart.title, chart.options, chart.metadata, function(result) {
            if (result === constants.RESPONSE_CODES.SUCCESS) {
                Trash.removeChart(dashboardID, chart.id);
                outerthis.setState({charts: Trash.charts, restoring: outerthis.prepareRestoringArray()});
                Trash.encodeStoredTrash();
            } else {
                message.error('Something went wrong. Could not restore chart!');
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.charts == null ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Empty Trash'/>
                    :
                    <div>
                        {this.state.charts.map((dashboard, dashboardIndex) => {
                            return (
                            <div key={dashboardIndex} className='trash__dashboard'>
                                <div className='trash__dashboard--title'>
                                    {dashboard.dashboard}
                                </div>
                                <div className='trash__container'>
                                    <Grid container spacing={3}>
                                        {dashboard.charts.map((chart, chartIndex) => {
                                            let restoringChartIndex = this.getChartIndex(dashboardIndex, chartIndex);
                                            return (
                                                <Grid item xs={12} md={6} lg={3} key={chartIndex}>
                                                    <div className='trash'>
                                                        <div style={{marginBottom: '10px'}}>
                                                            <Typography.Title level={4}>{chart.chartData.title}</Typography.Title>

                                                        </div>
                                                        <ReactEcharts option={chart.chartData.options} />
                                                        <Button onClick={() => {this.onRestoreClick(dashboard.dashboardID, chart.chartData, restoringChartIndex);}} style={{marginTop: '5px'}}>Restore</Button>
                                                        {
                                                            this.state.restoring[restoringChartIndex] &&
                                                            <div className='trash__chart--loadingContainer'>
                                                                <div className='trash__chart--loadingBackground'></div>
                                                                <div className='trash__chart--loading'>
                                                                    <Spin tip="Restoring chart..."></Spin>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>

                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </div>
                            </div>);

                        })}
                    </div>
                }
            </div>);
    }
}

export default Trash;