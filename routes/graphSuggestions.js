require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

router.post('/meta-data', (req, res) => {
  Rest.getMetaData(
    req.body.src,
    req.body.type,
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});
router.post('/entity-list', (req, res) => {
  Rest.getEntityList(
    req.body.src,
    req.body.type,
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});
router.post('/entity-data', (req, res) => {
  Rest.getEntityData(
    req.body.src,
    req.body.type,
    req.body.entity,
    (list) => res.status(200).json(list),
    (err) => error(res, err)
  );
});

function error(res, err) {
  console.error(err);
  res.status(400).json({ message: 'Error Occurred' });
}
module.exports = router;
