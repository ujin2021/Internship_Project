const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { use, param } = require('../routes/products');
const { connect } = require('http2');
const { type } = require('os');
const router = express.Router();

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.reviewList = async(req, res) => { // 상품 리뷰를 클릭했을 때 띄워주는 것
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
exports.productReview = async(req, res) => { // 리뷰 작성(로그인필요 -> 토큰필요), 리뷰 & 평점 카운트
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
            
            const sql = `INSERT INTO PRODUCT_REVIEWS (product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image) VALUES (?, ?, ?, ?, ?, ?, ?);`
            const upd = `UPDATE PRODUCTS SET review_count = review_count + 1, evaluation_total = evaluation_total + ? WHERE product_no = ?;`
            const params = [product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image]
            sql_result = await res.pool.query(sql, params)
            upd_result = await res.pool.query(upd, [review_evaluation, product_no])
            
            console.log(`리뷰 등록 완료`)
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

exports.productLike = async(req, res) => { // 찜하기 기능(한번더 누르면 취소됨), 찜한 갯수 카운트
    try{
        const token = req.get('Authorization')
        let result = await tokenCheck(token)
        if(result){
            const product_no = req.body['product_no']
            const user_no = result.decoded['user_no']
            let sql = `SELECT * FROM PRODUCT_LIKES WHERE product_no = ? AND user_no = ?;`
            const params = [product_no, user_no]
            result = await res.pool.query(sql, params)
            let upd = ''
            let msg = ''
            if (result[0].length === 0) { // 좋아요가 처음인 경우 -> db에 저장
                sql = `INSERT INTO PRODUCT_LIKES (product_no, user_no) VALUES (?, ?);`
                upd = `UPDATE PRODUCTS SET like_count = like_count + 1 WHERE product_no = ?`
                msg = `찜하기 처음 등록`
            }
            else if (result[0][0].like_enable === 0) { // 좋아요를 눌렀다가 취소했다가 다시 누름 -> enable을 true로 변경
                sql = `UPDATE PRODUCT_LIKES SET like_enable = true WHERE product_no = ? AND user_no = ?;`
                upd = `UPDATE PRODUCTS SET like_count = like_count + 1 WHERE product_no = ?`
                msg = `찜하기 등록`
            }
            else if (result[0][0].like_enable === 1) { // 좋아요를 취소한 경우 -> enable을 false로 변경
                sql = `UPDATE PRODUCT_LIKES SET like_enable = false WHERE product_no = ? AND user_no = ?;`
                upd = `UPDATE PRODUCTS SET like_count = like_count - 1 WHERE product_no = ?`
                msg = `찜하기 취소`
            }
            console.log(msg)
            // await res.pool.beginTransaction() -> error
            sql_result = await res.pool.query(sql, params)
            upd_result = await res.pool.query(upd, product_no)
            // await res.pool.commit()

            res.status(200).json({'status' : 200, 'msg' : msg})
        } 
    } catch (e) {
        console.error(e)
        // res.pool.rollback()
        if (e instanceof JsonWebTokenError) {
            res.status(400).json({'status' : 400, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
        res.status(503).json(e)
    }
}

exports.productLog = async(req, res) => { // 상품 조회 로그(회원별-로그인 필요, 이미 봤는데 다시 보면 시간만 update), 상품 조회수 증가
    try{
        const token = req.get('Authorization')
        let result = await tokenCheck(token)
        if(result){
            const product_no = req.body['product_no']
            const user_no = result.decoded['user_no']
            const log_at = new Date()
            const sel = `SELECT * FROM LOG_PRODUCTS WHERE product_no = ? AND user_no = ?;`
            const ins = `INSERT INTO LOG_PRODUCTS (product_no, user_no, log_at) VALUES (?, ?, ?);` 
            const log_upd = `UPDATE LOG_PRODUCTS SET log_at = ? WHERE product_no = ? AND user_no = ?`
            const count_upd = `UPDATE PRODUCTS SET view_count = view_count + 1 WHERE product_no = ?;`
            sel_result = await res.pool.query(sel, [product_no, user_no])
            if(sel_result[0].length === 0){ // 새롭게 본 상품
                ins_result = await res.pool.query(ins, [product_no, user_no, log_at])
                console.log(`처음 본 상품`)
            }
            else { // 이미 본 상품인데 다시 조회할 경우(날짜, 시간만 업데이트)
                log_result = await res.pool.query(log_upd, [log_at, product_no, user_no])
                console.log(`시간 업데이트`)
            }
            count_result = await res.pool.query(count_upd, product_no)
            console.log(`조회수 업데이트`)
            res.status(200).json({'status' : 200, 'msg' : `최근 본 상품에 등록되었습니다.`})
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