const express = require('express');
const router = express.Router();

function basicAPI (req, res){
    res.send('root page');
}

module.exports = {
    basicAPI : basicAPI
}