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
    try {
        const params = [req.body['email']]
        const result = await res.pool.query(`SELECT * FROM USER WHERE email = ?`, params)
		if (result[0].length === 0) {
            res.status(200).json({'status' : 200, 'msg' : `가입 가능한 이메일 주소 입니다.`})
        } else {
            res.status(400).json({'status' : 400, 'msg' : `이미 가입된 이메일 주소 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.getUserAPI = async (req, res) => {
    try{
        const result = await res.pool.query(`SELECT * FROM USER`)
        if(result.length > 0){
            res.status(200).json(result[0])
        } else {
            res.status(204).json(`가입한 회원이 없습니다.`) // 204면 아무것도 안보내진다
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
        const phone = req.body['phone']

        const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기(같은 pw면 같에 암호화 된다.)
        let password = cipher.update(pw, 'utf8','base64');
        password += cipher.final('base64');

        const sql = `INSERT INTO USER (email, password, nickname, phone) VALUES (?, ?, ?, ?);`
        const params = [email, password, nickname, phone]
        const result = await res.pool.query(sql, params)
        res.status(200).json({'status' : 200, 'msg' : `회원가입에 성공했습니다.`})
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.loginAPI =  async(req, res) => {
    try{
        const email = req.body['email']
        const pw = req.body['password']

        const result = await res.pool.query(`SELECT * FROM USER WHERE email = ?`, [email])

        let db_pw = result[0][0].password

        const decipher = await crypto.createDecipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기
        db_pw = await decipher.update(db_pw, 'base64', 'utf8');
        db_pw += await decipher.final('utf8');

        if (pw === db_pw){
            let token = await createToken(result[0][0].id);
            await res.status(200).json({'status' : 200, 'token' : token});
        } else {
            res.status(400).json({'status' : 400, 'msg' : `비밀번호가 일치하지 않습니다.`})
        }
    }catch (e) {
        console.error(e)
        if (e instanceof TypeError){
            await res.status(200).json({'status' : 204, 'msg' : `존재하지 않는 계정입니다.`});
        }
        await res.status(503).json(e)
    }
}

module.exports = exports
