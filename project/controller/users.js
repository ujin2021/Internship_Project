const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const generateToken = require('../config/token').generateToken

const key = require('../config/settings.js').secretKey
const crypto = require('crypto')
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l')

exports.emailCheckAPI = async (req, res) => { // 이메일 중복체크
    try {
        const params = [req.body['email']]
        const result = await res.pool.query(`SELECT * FROM USERS WHERE user_email = ?`, params)
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

exports.getUserAPI = async (req, res) => { // 회원리스트(테스트용)
    try{
        const result = await res.pool.query(`SELECT * FROM USERS`)
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

exports.signupAPI = async (req, res) => { // 회원가입
    try{
        const {user_email, user_password, user_nickname, user_phone} = req.body

        const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기(같은 pw면 같에 암호화 된다.)
        let password = cipher.update(user_password, 'utf8','base64');
        password += cipher.final('base64');

        const sql = `INSERT INTO USERS (user_email, user_password, user_nickname, user_phone) VALUES (?, ?, ?, ?);`
        const params = [user_email, password, user_nickname, user_phone]
        const result = await res.pool.query(sql, params)
        res.status(200).json({'status' : 200, 'msg' : `회원가입에 성공했습니다.`})
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.loginAPI =  async(req, res) => { // 회원 로그인(토큰 생성)
    try{
        let req_to_json = JSON.parse(req)
        let req_body_to_json = JSON.parse(req.body)
        console.log(`req : ${req_to_json}, req.body : ${req_body_to_json}`)
        const {user_email, user_password} = req.body // 비구조화 할당

        const result = await res.pool.query(`SELECT * FROM USERS WHERE user_email = ?`, [user_email])

        let db_pw = result[0][0].user_password
        console.log('db_pw', db_pw)

        const decipher = await crypto.createDecipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기
        db_pw = await decipher.update(db_pw, 'base64', 'utf8');
        db_pw += await decipher.final('utf8');

        if (user_password === db_pw){
            let token = await generateToken(result[0][0].user_no);
            await res.status(200).json({'status' : 200, 'token' : token});
        } else {
            res.status(400).json({'status' : 400, 'msg' : `비밀번호가 일치하지 않습니다.`})
        }
    }catch (e) {
        console.error(e)
        if (e instanceof TypeError){
            await res.status(400).json({'status' : 400, 'msg' : `존재하지 않는 계정입니다.`});
        }
        await res.status(503).json(e)
    }
}

module.exports = exports
