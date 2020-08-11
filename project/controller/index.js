const express = require('express');
const router = express.Router();


exports.basicAPI = (req, res) => {
    res.send('root page');
}

module.exports = exports