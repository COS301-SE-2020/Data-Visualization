require('dotenv').config();
const express = require('express');
const router = express.Router();

const { rest } = require('../controllers');

//  1. GET_DASHBOARDS (THIS WILL RETURN JUST DASHBOARDS WITH THEIR NAME, DESCRIPTION AND COLOUR)
router.get('/', (req, res) => {
  rest.getDashboardList(
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});

//  2. ADD_DASHBOARDS (THIS WILL JUST ADD A DASHBOARD TO THE PANEL PAGE)
// => POST (nameOfDashboard, descriptionOfDashboard,dashColour)
router.post('/', (req, res) => {
  rest.addDashboard(
    req.body.name,
    req.body.description,
    () => res.status(200).json({ message: 'Successfully Added Dashboard' }),
    (err) => error(res, err)
  );
});

//  3. REMOVE_DASHBOARD
router.delete('/', (req, res) => {
  rest.removeDashboard(
    req.body.dashboardID,
    () => {
      res.status(200).json({ message: 'Successfully Removed Dashboard' });
    },
    (err) => error(res, err)
  );
});

//  4. UPDATE_DASHBOARD_NAME
//  => PUT(dashboardNewName, dashboardID)
//     UPDATE_DASHBOARD_DESCRIPTION
//  => PUT(dashboardDescription, dashboardID)
router.put('/', (req, res) => {
  rest.updateDashboard(
    req.body.dashboardID,
    req.body.fields,
    req.body.data,
    () => {
      res.status(200).json({ message: 'Successfully Updated Dashboard' });
    },
    (err) => error(res, err)
  );
});

function error(res, err) {
  console.error(err);
  res.status(400).json({ message: 'Error Occurred' });
}

module.exports = router;
