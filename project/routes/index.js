const express = require('express');
const router = express.Router();
const indexController = require('../controller/index');

router.get('/', indexController.basicAPI);


const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

module.exports = router;