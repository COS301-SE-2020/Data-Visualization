// import axios from 'axios';
//
// const inPROD = false;
// const inDEV_PORT = 8000;
//
// function getAPIurl() {
//   let rest = window.location.href;
//   if (!inPROD) rest = rest.substring(0, rest.lastIndexOf(':') + 1) + inDEV_PORT + '/';
//   console.log(rest);
//   return rest;
// }
//
// const API = {
//   dashboard: {
//     list: () => axios.get(getAPIurl() + 'dashboard', {}),
//     add: (name, description) => axios.post(getAPIurl() + 'dashboard', { name, description }),
//     delete: (dashboardID) => axios.delete(getAPIurl() + 'dashboard', { data: { dashboardID } }),
//     update: (dashboardID, fields, data) => axios.put(getAPIurl() + 'dashboard', { dashboardID, fields, data }),
//   },
//   graph: {
//     list: (dashboardID) =>
//       axios.get(getAPIurl() + 'graph', {
//         params: {
//           dashboardID: dashboardID,
//         },
//       }),
//     add: (dashboardID, graphTypeID) => axios.post(getAPIurl() + 'graph', { dashboardID, graphTypeID }),
//     delete: (graphID) => axios.delete(getAPIurl() + 'graph', { data: { graphID } }),
//     update: (graphID, fields, data) => axios.put(getAPIurl() + 'graph', { graphID, fields, data }),
//   },
// };
//
// export default API;
