require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

router.post('/graphs', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        error(res, { error: 'Body Undefined' }, 400);
    } else if (req.body.sourceurl === undefined) {
        error(res, { error: 'Source Undefined' }, 400);
    } else {
        Rest.getSuggestions(
            req.body.sourceurl,
            (list) => res.status(200).json(list),
            (err) => error(res, err, 400)
        );
    }
});

function error(res, err, status = 400) {
    console.error(err);
    res.status(status).json(err);
}
module.exports = router;
