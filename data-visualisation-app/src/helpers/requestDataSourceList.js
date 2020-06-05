import { MockDataSources, MockAPIresponseTime } from './mockData';

const requestDataSourceList = () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, MockAPIresponseTime(), MockDataSources()); //Mock data for data source list
    });
};

export { requestDataSourceList };
