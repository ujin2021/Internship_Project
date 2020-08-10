const express = require('express');
const router = express.Router();

let conn = require('../config/db_settings.js');

const jwt = require('jsonwebtoken');

const key = require('../config/settings.js').secretKey;
const crypto = require('crypto');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');
const { timeStamp, time } = require('console');

async function createToken(id) {
    // 기본 알고리즘 : HMAC SHA256
    // 알고리즘 변경 할 수 있다. https://github.com/auth0/node-jsonwebtoken#usage
    const token = jwt.sign({user_id: id}, key.secretKey);
    return token;
}

exports.emailCheckAPI = (req, res) => {
    console.log(req.body);
    let sql = 'SELECT * FROM user WHERE email=?'; // 중복검사 위한 sql
    let params = [req.body['email']];
    conn.query(sql, params, function(err, result){
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

exports.getUserAPI = (req, res) => {
    conn.query('SELECT * FROM user', function(err, result){
        if(err) console.log(err);
        console.log(result[0]);
        let body = '';
        for (let i = 0; i< result.length; i++) {
            let info = '{id : ' + result[i].id + ', email : ' + result[i].email + '}';
            body += info;
        }
        console.log('body : ', body);
        let html = `${body}`;
        res.send(html);
    });
}

exports.signupAPI = (req, res) => {
    console.log(req.body);
    let email = req.body['email'];
    let pw = req.body['password'];
    let nickname = req.body['nickname'];
    let phone_num = req.body['phone_num']

    const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기(같은 pw면 같에 암호화 된다.)
    let password = cipher.update(pw, 'utf8','base64');
    password += cipher.final('base64');
    console.log('ciphered pw : ', password);

    let sql = 'INSERT INTO user(email, password, nickname, phone_num) VALUES(?, ?, ?, ?);'
    let params = [email, password, nickname, phone_num];
    conn.query(sql, params, function(err, rows, fields){
        if(err) {
            console.log(err);
            res.status(503).json('Signup Fail');
        } // 덜 채워서 줬을 때, 사용자에게는 성공메세지가 감 --> 수정하기
        else{
            console.log('Save user');
            res.status(201).json('Signup success');
        }
    });  
}

exports.loginAPI = loginAPI;

async function loginAPI (req, res){
    let email = req.body['email'];
    let pw = req.body['password'];
    let db_pw = '';

    // 위의 email check 와 중복됨 -> 해결하기
    let sql = 'SELECT id, password FROM user WHERE email=?';
    params = [email];
    conn.query(sql, params, async function(err, result){ // 복호화 부분을 conn 밖으로 빼기
        if(err) console.log(err);
        else{
            if(result.length === 0) res.status(503).json('Not my user');
            else {
                db_pw = result[0].password;
                console.log('db_pw:', db_pw);
                // 복호화
                const decipher = await crypto.createDecipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기
                db_pw = await decipher.update(db_pw, 'base64', 'utf8');
                db_pw += await decipher.final('utf8');

                if(db_pw === pw){
                    console.log('login success');
                    let token = await createToken(result[0].id);
                    await res.status(201).json(token);
                }
                else{
                    console.log('login failed');
                    await res.status(503).json('Login failed');
                }
            }
        }
    });
}


/*
function database (sql, params){
    conn.query(sql, params, function(err, result){
        if(err){
            console.log(err);
            return(err);
        }
    });
}

https://bangc.tistory.com/15
db도 미들웨어로 만들어서 분리시키기(최대한 중복줄이기)
*/

// 하나씩 하지말고 한번에 하도록 수정하기
module.exports = exports