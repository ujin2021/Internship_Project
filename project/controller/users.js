const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const generateToken = require('../settings/token').generateToken

const key = require('../settings/settings.js').secretKey
const crypto = require('crypto')
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l')

// const models = require('../models/index')
// const USERS = require('../models/USERS')

// conn 쓰는것-> transaction(insert, update) 사용할 때 (소켓통신처럼 딱 연결을 해놓고)
// 그냥 res.pool.query -> 조회할때 쓰면 된다.

exports.emailCheckAPI = async (req, res) => { // 이메일 중복체크
    try {
        const params = [req.body['user_email']]
        const duplicated_email = await res.pool.query(`SELECT * FROM USERS WHERE user_email = ?`, params) 
        // const duplicated_email = await models.USERS.findAll({where : {user_email : req.body['user_email']}}) orm-sequelize
		if (duplicated_email[0].length === 0) {
            res.status(200).json({'msg' : `가입 가능한 이메일 주소 입니다.`}) // json 보낼 때 wrap 해서 보내는게 서버의 유지보수가 쉽다.
        } else {
            res.status(400).json({'msg' : `이미 가입된 이메일 주소 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.getUserAPI = async (req, res) => { // 회원리스트(테스트용)
    try{
        const user_list = await res.pool.query(`SELECT * FROM USERS`)
        if(user_list[0].length > 0){
            res.status(200).json({'msg' : user_list[0]})
        } else {
            res.status(204).json({'msg' : `가입한 회원이 없습니다.`}) // 204면 아무것도 안보내진다
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.signupAPI = async (req, res) => { // 회원가입
    try{
        const {user_email, user_password, user_nickname, user_phone} = req.body

        const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기 -> mysql password() 사용하기
        let password = cipher.update(user_password, 'utf8','base64');
        password += cipher.final('base64');

        const params = [user_email, password, user_nickname, user_phone]
        const create_user = await res.pool.query(`INSERT INTO USERS (user_email, user_password, user_nickname, user_phone) VALUES (?, ?, ?, ?)`, params)

        res.status(200).json({'msg' : `회원가입에 성공했습니다.`})
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.loginAPI =  async(req, res) => { // 회원 로그인(토큰 생성)
    try{
        const {user_email, user_password} = req.body // 비구조화 할당
        
        const cipher = crypto.createCipher('aes-256-cbc', key.secretKey) // 암호화 방식 바꿔주기 -> mysql password() 사용하기
        let password = cipher.update(user_password, 'utf8','base64');
        password += cipher.final('base64');

        const login_result = await res.pool.query(`SELECT user_no FROM USERS WHERE user_email = ? AND user_password = ?;`, [user_email, password])
        if(login_result[0]) {
            let token = await generateToken(login_result[0][0].user_no)
            res.status(200).json({'msg' : `로그인에 성공했습니다.`, 'token' : token})
        }
    }catch (e) {
        console.error(e)
        if (e instanceof TypeError) {
            res.status(400).json({'msg' : `로그인에 실패했습니다.`})
        }
        await res.status(503).json(e)
    }
}

module.exports = exports
