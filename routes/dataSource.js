require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

router.post('/list', (req, res) => {
  Rest.getDataSourceList(
    req.body.email,
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});

router.post('/add', (req, res) => {
  Rest.addDataSource(
    req.body.email,
    req.body.dataSourceUrl,
    () => res.status(200).json({ message: 'Successfully Added To Data Source' }),
    (err) => error(res, err)
  );
});

router.post('/remove', (req, res) => {
  Rest.removeDataSource(
    req.body.email,
    req.body.dataSourceID,
    () => res.status(200).json({ message: 'Successfully Removed Data Source' }),
    (err) => error(res, err)
  );
});

function error(res, err) {
  console.error(err);
  res.status(400).json({ message: 'Error Occurred' });
}

module.exports = router;
