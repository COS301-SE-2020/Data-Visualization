import { MockDataSources, MockAPIresponseTime } from '../mock-data';

const requestDataSourceList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, MockAPIresponseTime(), MockDataSources()); //Mock data for data source list
  });
};

export { requestDataSourceList };
