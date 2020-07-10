require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

router.post('/list', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else {
    Rest.getDataSourceList(
        req.body.email,
        (list) => res.status(200).json(list),
        (err) => error(res, err)
    );
  }
});

router.post('/add', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.dataSourceUrl === undefined){
    error(res, { error: 'Data Source url Undefined' }, 400);
  }
  else {
    Rest.addDataSource(
        req.body.email,
        req.body.dataSourceUrl,
        () => res.status(200).json({message: 'Successfully Added Data Source'}),
        (err) => error(res, err)
    );
  }
});

router.post('/remove', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(req.body.dataSourceID === undefined){
    error(res, { error: 'Data Source Id Undefined' }, 400);
  }
  else {
    Rest.removeDataSource(
        req.body.email,
        req.body.dataSourceID,
        () => res.status(200).json({message: 'Successfully Removed Data Source'}),
        (err) => error(res, err)
    );
  }
});

function error(res, err, status= 404) {
  console.error(err);
  res.status(status).json(err);
}

module.exports = router;
