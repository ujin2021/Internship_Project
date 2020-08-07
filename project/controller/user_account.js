const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const dbconfig = require('../config/settings.js').database;
var conn = mysql.createConnection(dbconfig); //end?

const key = require('../config/settings.js').secretKey;
const crypto = require('crypto');

function emailCheckAPI (req, res){
    console.log(req.body);
    let check_sql = 'SELECT * FROM user WHERE email=?'; // 중복검사 위한 sql
    let params = [req.body['email']];
    conn.query(check_sql, params, function(err, result){
        if(err) console.log(err);
        else{
            if(result.length === 0){
                var status = 201;
                var msg = 'New';
            }
            else{
                var status = 503;
                var msg = 'Exist';
            }
            res.status(status).json(msg);
        }
    });
}

function getUserAPI (req, res){
    conn.query('SELECT * FROM user', function(err, result){
        if(err) console.log(err);
        console.log(result[0]);
        let html = `<p>${result[0].email}</p>`; 
        res.send(html);
    });
}

function signupAPI (req, res){
    console.log(req.body);
    let email = req.body['email'];
    let pw = req.body['password'];
    let nickname = req.body['nickname'];
    let phone_num = req.body['phone_num']

    const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // hiddenkey 대신 진짜 key 넣어줘야함, 암호화 방식 바꿔주기
    let password = cipher.update(pw, 'utf8','base64');
    password += cipher.final('base64');
    console.log(password);

    let sql = 'INSERT INTO user(email, password, nickname, phone_num) VALUES(?, ?, ?, ?);'
    let params = [email, password, nickname, phone_num];
    conn.query(sql, params, function(err, rows, fields){
        if(err) console.log(err);
        else{console.log('save data');}
    });
    res.status(201).json('Signup success');
}

function loginAPI (req, res){
    // console.log(req.body);
    let email = req.body['email'];
    let pw = req.body['password'];
    let db_pw = '';

    // 위의 email check 와 중복됨
    let sql = 'SELECT password FROM user WHERE email=?';
    params = [email];
    conn.query(sql, params, function(err, result){
        if(err) console.log(err);
        else{
            if(result.length === 0) res.status(503).json('Not my user');
            else {
                db_pw = result[0].password;
                console.log('db_pw:', db_pw);
                const decipher = crypto.createDecipher('aes-256-cbc', key.secretKey) // hiddenkey 대신 진짜 key 넣어줘야함, 암호화 방식 바꿔주기
                db_pw = decipher.update(db_pw, 'base64', 'utf8');
                db_pw += decipher.final('utf8');

                if(db_pw === pw){
                    console.log('login success');
                    res.status(201).json('Login success')
                }
            }
        }
    });
}

module.exports = {
    emailCheckAPI : emailCheckAPI,
    getUserAPI : getUserAPI,
    signupAPI : signupAPI,
    loginAPI : loginAPI
}