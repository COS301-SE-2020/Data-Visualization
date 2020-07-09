require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

router.post('/get-suggestions', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' },400);
  }
  else if(req.body.sourceurl === undefined){
    error(res, { error: 'Source Undefined' }, 400);
  }
  Rest.getSuggestions(
      req.body.sourceurl,
      (list) => res.status(200).json(list),
      (err) => error(res, err,404)
  );
});
/*router.post('/meta-data', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' },400);
  }
  else if(req.body.src === undefined){
    error(res, { error: 'Source Undefined' }, 400);
  }
  else if(req.body.type === undefined){
    error(res, { error: 'Type Undefined' }, 400);
  }
  else {
    Rest.getMetaData(
        req.body.src,
        req.body.type,
        (list) => res.status(200).json(list),
        (err) => error(res, err,404)
    );
  }
});
router.post('/entity-list', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' },400);
  }
  else if(req.body.src === undefined){
    error(res, { error: 'Source Undefined' },400);
  }
  else if(req.body.type === undefined){
    error(res, { error: 'Type Undefined' },400);
  }
  else {
    Rest.getEntityList(
        req.body.src,
        req.body.type,
        (list) => res.status(200).json(list),
        (err) => error(res, err,404)
    );
  }
});
router.post('/entity-data', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' },400);
  }
  else if(req.body.src === undefined){
    error(res, { error: 'Source Undefined' },400);
  }
  else if(req.body.type === undefined){
    error(res, { error: 'Type Undefined' },400);
  }
  else if(req.body.entity === undefined){
    error(res, { error: 'Entity Undefined' },400);
  }
  else{
    Rest.getEntityData(
        req.body.src,
        req.body.type,
        req.body.entity,
        (list) => res.status(200).json(list),
        (err) => error(res, err,404)
    );
  }
});
*/
function error(res, err, status= 404) {
  console.error(err);
  res.status(status).json(err);
}
module.exports = router;
