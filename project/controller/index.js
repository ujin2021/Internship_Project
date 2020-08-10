const express = require('express');
const router = express.Router();

let conn = require('../config/db_settings.js');

function basicAPI (req, res){
    res.send('root page');
}

module.exports = {
    basicAPI : basicAPI
}