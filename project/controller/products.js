const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const { use, param } = require('../routes/products');
const { connect } = require('http2');
const { type } = require('os');
const { jwtDecode } = require('../config/token');
const router = express.Router();

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.productReview = async(req, res) => { // 리뷰 작성(로그인필요 -> 토큰필요), 리뷰 & 평점 카운트
    const conn = await res.pool.getConnection()
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult) // jwtDecode result :  { user_no: 2, iat: 1597310239 }
        
        if (jwtResult) {
            const product_no = req.body['product_no']
            const user_no = jwtResult.user_no
            const review_title = req.body['review_title']
            const review_content = req.body['review_content']
            const review_evaluation = req.body['review_evaluation'] // 별점
            const review_image = req.body['review_image']
            const review_created_at = new Date()
            
            const sql = `INSERT INTO PRODUCT_REVIEWS (product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image) VALUES (?, ?, ?, ?, ?, ?, ?);`
            const upd = `UPDATE PRODUCTS SET review_count = review_count + 1, evaluation_total = evaluation_total + ? WHERE product_no = ?;`
            const params = [product_no, user_no, review_title, review_content, review_evaluation, review_created_at, review_image]

            await conn.beginTransaction()
            sql_result = await conn.query(sql, params)
            upd_result = await conn.query(upd, [review_evaluation, product_no])
            await conn.commit()
            
            console.log(`리뷰 등록 완료`)
            res.status(200).json({'status' : 200, 'msg' : `리뷰가 정상적으로 등록되었습니다.`})
        } else { 
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error('product err : ', e)
        conn.rollback()
        res.status(503).json(e)
    } finally {
        conn.release()
    }
}

exports.productLike = async(req, res) => { // 찜하기 기능(한번더 누르면 취소됨), 찜한 갯수 카운트
    const conn = await res.pool.getConnection()
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        
        if(jwtResult){
            const product_no = req.body['product_no']
            const user_no = jwtResult.user_no
            let sql = `SELECT * FROM PRODUCT_LIKES WHERE product_no = ? AND user_no = ?;`
            const params = [product_no, user_no]
            result = await conn.query(sql, params)
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
            await conn.beginTransaction()
            sql_result = await conn.query(sql, params)
            upd_result = await conn.query(upd, product_no)
            await conn.commit()

            res.status(200).json({'status' : 200, 'msg' : msg})
        } else { 
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        conn.rollback()
        res.status(503).json(e)
    } finally {
        conn.release()
    }
}

exports.productLog = async(req, res) => { // 상품 조회 로그(회원별-로그인 필요, 이미 봤는데 다시 보면 시간만 update), 상품 조회수 증가
    const conn = await res.pool.getConnection()
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)

        if(jwtResult){
            const product_no = req.body['product_no']
            const user_no = jwtResult.user_no
            const log_at = new Date()
            const sel = `SELECT * FROM LOG_PRODUCTS WHERE product_no = ? AND user_no = ?;`
            const ins = `INSERT INTO LOG_PRODUCTS (product_no, user_no, log_at) VALUES (?, ?, ?);` 
            const log_upd = `UPDATE LOG_PRODUCTS SET log_at = ? WHERE product_no = ? AND user_no = ?`
            const count_upd = `UPDATE PRODUCTS SET view_count = view_count + 1 WHERE product_no = ?;`

            await conn.beginTransaction()
            sel_result = await conn.query(sel, [product_no, user_no])
            if(sel_result[0].length === 0){ // 새롭게 본 상품
                ins_result = await res.pool.query(ins, [product_no, user_no, log_at])
                console.log(`처음 본 상품`)
            }
            else { // 이미 본 상품인데 다시 조회할 경우(날짜, 시간만 업데이트)
                log_result = await conn.query(log_upd, [log_at, product_no, user_no])
                console.log(`시간 업데이트`)
            }
            count_result = await conn.query(count_upd, product_no)
            await conn.commit()
            console.log(`조회수 업데이트`)
            res.status(200).json({'status' : 200, 'msg' : `최근 본 상품에 등록되었습니다.`})
        } else { 
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        conn.rollback()
        res.status(503).json(e)
    } finally {
        conn.release()
    }
}

exports.buyTicket = async(req, res) => { // 쿠폰 사용 시 쿠폰확인(사용가능한 쿠폰리스트들 보내주기-> 사용자가 쿠폰을 선택하면 쿠폰 no를 보내준다. 없으면 0)
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        
        if(jwtResult){
            const user_no = jwtResult.user_no
            const ticket_no = req.body['ticket_no']
            const ticket_quantity = req.body['ticket_quantity']
            const ticket_total_price = req.body['ticket_total_price']
            const ticket_purchase_at = new Date()

            const user_coupon_no = req.body['user_coupon_no'] //coupon 사용시 user_counpon_no, 미사용시 0
            let ticket_discount = 0
            if(user_coupon_no !== 0){
                const coupon_result = await conn.query(`SELECT coupon_no FROM USER_COUPONS WHERE user_coupon_no = ?;`, user_coupon_no)
                const discount_result = await conn.query(`SELECT coupon_discount_percent FROM COUPONS WHERE coupon_no = ?;`, coupon_result[0][0]['coupon_no'])
                ticket_discount = discount_result[0][0]['coupon_discount_percent']
            }

            const sql = `INSERT INTO USER_TICKETS (user_no, ticket_no, ticket_quantity, ticket_total_price, ticket_discount, ticket_purchase_at) VALUES (?, ?, ?, ?, ?, ?)`
            const params = [user_no, ticket_no, ticket_quantity, ticket_total_price, ticket_discount, ticket_purchase_at]
            conn.beginTransaction()
            const result = await conn.query(sql, params)
            if(user_coupon_no !== 0){
                const user_ticket_no = result[0]['insertId']
                const use_coupon = await conn.query(`INSERT INTO LOG_USE_COUPONS (user_ticket_no, user_coupon_no, coupon_used_at) VALUES (?, ?, ?);`, [user_ticket_no, user_coupon_no, ticket_purchase_at])
            }
            conn.commit()
            
            res.status(200).json({'status' : 200, 'msg' : `티켓 구매 성공`})
        } else {
            res.status(400).json({'status' : 400, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        conn.rollback()
    } finally {
        conn.release()
    }
}

exports.availableCoupon = async(req, res) => {
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        
        if(jwtResult){
            const user_no = jwtResult.user_no
            
        } else {
            res.status(400).json({'status' : 400, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release
    }
}

module.exports = exports