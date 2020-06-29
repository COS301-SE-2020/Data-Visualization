require('dotenv').config();
const express = require('express');
const router = express.Router();
const Database = require('../database.js');
const db = new Database();
module.exports = router;