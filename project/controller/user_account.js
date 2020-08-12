const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const key = require('../config/settings.js').secretKey;
const crypto = require('crypto');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

async function createToken(id) {
    // 기본 알고리즘 : HMAC SHA256
    // 알고리즘 변경 할 수 있다. https://github.com/auth0/node-jsonwebtoken#usage
    const token = jwt.sign({user_id: id}, key.secretKey);
    return token;
}

exports.emailCheckAPI = async (req, res) => { 
    let status = null
    let message = ``
    try {
        const params = [req.body['email']]
        const result = await res.pool.query(`SELECT * FROM user WHERE email = ?`, params)
		if (result[0].length === 0) {
            res.status(200).json(`가입 가능한 이메일 주소 입니다.`)
        } else {
            res.status(400).json(`이미 가입된 이메일 주소 입니다.`)
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.getUserAPI = async (req, res) => {
    try{
        const result = await res.pool.query(`SELECT * FROM user`)
        if(result.length > 0){
            res.status(200).json(result[0])
        } else {
            res.status(204).json(`가입한 회원이 없습니다.`)
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.signupAPI = async (req, res) => {
    try{
        const email = req.body['email']
        const pw = req.body['password']
        const nickname = req.body['nickname']
        const phone_num = req.body['phone_num']

        const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기(같은 pw면 같에 암호화 된다.)
        let password = cipher.update(pw, 'utf8','base64');
        password += cipher.final('base64');

        const sql = `INSERT INTO user(email, password, nickname, phone_num) VALUES (?, ?, ?, ?);`
        const params = [email, password, nickname, phone_num]
        const result = await res.pool.query(sql, params)
        res.status(200).json(`회원가입에 성공했습니다.`)
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.loginAPI =  async(req, res) => {
    try{
        const email = req.body['email']
        const pw = req.body['password']

        const result = await res.pool.query(`SELECT password FROM user WHERE email = ?`, [email])
        let db_pw = result[0][0].password

        const decipher = await crypto.createDecipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기
        db_pw = await decipher.update(db_pw, 'base64', 'utf8');
        db_pw += await decipher.final('utf8');

        if (pw === db_pw){
            let token = await createToken(result[0].id);
            await res.status(200).json(token);
        } else {
            res.status(401).json(`비밀번호가 일치하지 않습니다.`)
        }
    } catch (e) {
        console.error(e)
        await res.status(503).json(e)
    }
}

module.exports = exports
