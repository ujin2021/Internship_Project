const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { use, param } = require('../routes/products');
const router = express.Router();

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.reviewList = async(req, res) => {
    try{
        const params = [req.body['product_id']]
        const result = await res.pool.query(`SELECT * FROM PRODUCT_REVIEW WHERE product_id = ?;`, params)
        if (result[0].length > 0){
            res.status(200).json({'status' : 200, 'msg' : result[0]})
        }
        else if (result[0].length === 0){
            res.status(204).json({'status' : 204, 'msg' : `리뷰가 없습니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

const tokenCheck = require('./tokenCheck').tokenCheck;
exports.review = async(req, res) => {
    try{
        const token = req.get('Authorization')
        let result = await tokenCheck(token)
        console.log('result decoded id : ', result.decoded['user_id'])
        if (result) {
            const product_id = req.body['product_id']
            const user_id = result.decoded['user_id']
            const title = req.body['title']
            const content = req.body['content']
            const evaluation = req.body['evaluation'] // 별점
            const image = req.body['image']
            const created_at = new Date()
            
            const sql = `INSERT INTO PRODUCT_REVIEW (product_id, user_id, title, content, evaluation, created_at, image) VALUES (?, ?, ?, ?, ?, ?, ?)`
            const params = [product_id, user_id, title, content, evaluation, created_at, image]
            result = await res.pool.query(sql, params)
            console.log(result)
            res.status(200).json({'status' : 200, 'msg' : `리뷰가 정상적으로 등록되었습니다.`})
        }
    } catch (e) {
        console.error(e)
        if (e instanceof JsonWebTokenError) { // 토큰이 없는 경우
            res.status(400).json({'stauts' : 400, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
        res.status(503).json(e)
    }
}

exports.like = async(req, res) => {
    try{
        const token = req.get('Authorization')
        let result = await tokenCheck(token)
        if(result){
            const product_id = req.body['product_id']
            const user_id = result.decoded['user_id']
            let sql = `SELECT * FROM PRODUCT_LIKE WHERE product_id = ? AND user_id = ?;`
            const params = [product_id, user_id]
            result = await res.pool.query(sql, params)
            if (result[0].length === 0) { // 좋아요가 처음인 경우 -> db에 저장
                sql = `INSERT INTO PRODUCT_LIKE (product_id, user_id) VALUES (?, ?);`
                result = await res.pool.query(sql, params)
                console.log(result)
                res.status(200).json({'status' : 200, 'msg' : `찜하기 등록`})
            }
            else { // 좋아요를 취소한 경우 -> db에서 삭제
                sql = `DELETE FROM PRODUCT_LIKE WHERE product_id = ? AND user_id = ?;`
                result = await res.pool.query(sql, params)
                console.log(result)
                res.status(200).json({'status' : 200, 'msg' : `찜하기 취소`})
            }
        }
    
    } catch (e) {
        console.error(e)
        if (e instanceof JsonWebTokenError) {
            res.status(400).json({'status' : 400, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
        res.status(503).json(e)
    }
}

module.exports = exports