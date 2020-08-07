const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbconfig = require('../config/settings.js').database;
var conn = mysql.createConnection(dbconfig);

const key = require('../config/settings.js').secretKey;
const crypto = require('crypto');

const UserController = require('../controller/user_account');

// app.js 경로 뒤에 붙여지는 주소
router.post('/email_check', UserController.emailCheckAPI);
router.get('/signup', UserController.getUserAPI);
router.post('/signup', UserController.signupAPI);
router.post('/login', UserController.loginAPI);



module.exports = router;