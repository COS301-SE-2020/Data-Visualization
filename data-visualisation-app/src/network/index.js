import {
  MockDataSources,
  MockAPIresponseTime,
  MockGraphTypes,
  MockGraphsFromType,
} from '../mock-data';

const requestDataSourceList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, MockAPIresponseTime(), MockDataSources()); //Mock data for data source list
  });
};

const requestGraphTypeList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, MockAPIresponseTime() / 8, MockGraphTypes()); //Mock data for data source list
  });
};

const requestGraphsFromType = (type) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, MockAPIresponseTime() / 5, MockGraphsFromType(type)); //Mock data for data source list
  });
};

export { requestDataSourceList, requestGraphTypeList, requestGraphsFromType };
