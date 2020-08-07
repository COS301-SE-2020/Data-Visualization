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
import {Button, Typography} from 'antd';
import ReactEcharts from 'echarts-for-react';
import './Trash.scss';

/**
  * @return React Component
*/
class Trash extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.charts = null;
        this.delimiter = '^';

        if (localStorage.getItem('trashedCharts') !== '') {
            this.charts = this.parseStored(localStorage.getItem('trashedCharts'));
        }

        this.state = {charts: this.charts};
    }

    parseStored(storedString) {
        if (storedString.includes(this.delimiter)) {
            storedString = storedString.split(this.delimiter);

            for (let s = 0; s < storedString.length; s++) {
                storedString[s] = JSON.parse(storedString[s]);
                storedString[s].charts = JSON.parse(storedString[s].charts);
            }

        } else {
            storedString = [JSON.parse(storedString)];
        }

        return storedString;
    }

    static parseStoredTrash(storedString) {
        if (storedString.includes(this.delimiter)) {
            storedString = storedString.split(this.delimiter);

            for (let s = 0; s < storedString.length; s++) {
                storedString[s] = JSON.parse(storedString[s]);
                storedString[s].charts = JSON.parse(storedString[s].charts);
            }

        } else {
            storedString = [JSON.parse(storedString)];
        }

        return storedString;
    }

    static addChart(owner, chartData) {
        if (localStorage.getItem('trashedCharts') === '') {
            this.charts = [{
                dashboard: owner,
                charts: [{chartData: chartData}]
            }];
        }
        let storedString = '';
        for (let s = 0; s < this.charts.length; s++) {
            storedString += JSON.stringify(this.charts[s]);
            if (s < this.charts.length-1) {
                storedString += this.delimiter;
            }
        }
        localStorage.setItem('trashedCharts', storedString);
    }

    render() {
        return (
            <div>
                {this.state.charts == null ?
                    <div>is empty</div>
                    :
                    <div>
                        {this.state.charts.map((dashboard, index) => {
                            return <div key={index}>
                                dashbaord: {dashboard.dashboard}
                                <Grid container spacing={3} className='panel__chart panel__shadow'>
                                    {dashboard.charts.map((chart, index) => {
                                        return (
                                            <Grid item xs={12} md={6} lg={3} key={index} className='suggestion panel__shadow'>
                                                <div style={{marginBottom: '10px'}}>
                                                    <Typography.Title level={4}>{chart.chartData.title}</Typography.Title>

                                                </div>
                                                <ReactEcharts option={chart.chartData.options} />
                                                <Button>Restore</Button>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </div>;

                        })}
                    </div>
                }
            </div>);
    }
}

export default Trash;