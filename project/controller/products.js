const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { use, param } = require('../routes/products');
const router = express.Router();

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.reviewList = async(req, res) => {
    try{
        const params = [req.body['product_no']]
        const result = await res.pool.query(`SELECT * FROM PRODUCT_REVIEWS WHERE product_no = ?;`, params)
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
        console.log('result decoded id : ', result.decoded['user_no'])
        if (result) {
            const product_no = req.body['product_no']
            const user_no = result.decoded['user_no']
            const review_title = req.body['review_title']
            const review_content = req.body['review_content']
            const review_evaluation = req.body['review_evaluation'] // 별점
            const review_image = req.body['review_image']
            const review_created_at = new Date()
            
            const sql = `INSERT INTO PRODUCT_REVIEWS (product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image) VALUES (?, ?, ?, ?, ?, ?, ?)`
            const params = [product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image]
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
            const product_no = req.body['product_no']
            const user_no = result.decoded['user_no']
            let sql = `SELECT * FROM PRODUCT_LIKES WHERE product_no = ? AND user_no = ?;`
            const params = [product_no, user_no]
            result = await res.pool.query(sql, params)
            if (result[0].length === 0) { // 좋아요가 처음인 경우 -> db에 저장
                sql = `INSERT INTO PRODUCT_LIKES (product_no, user_no) VALUES (?, ?);`
                result = await res.pool.query(sql, params)
                console.log(result)
                res.status(200).json({'status' : 200, 'msg' : `찜하기 등록`})
            }
            else { // 좋아요를 취소한 경우 -> db에서 삭제
                sql = `DELETE FROM PRODUCT_LIKES WHERE product_no= ? AND user_no = ?;`
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