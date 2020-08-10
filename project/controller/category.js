const express = require('express');
const router = express.Router();

let conn = require('../config/db_settings.js');

exports.listAPI = (req, res) => {
    res.send('category list page');
}

module.exports = exports