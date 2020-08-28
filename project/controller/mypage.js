const express = require('express');
const { category } = require('./lists');
const consoleStamp = require('console-stamp');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.myLike = async(req, res) => { // 나의 찜하기 목록을 보여줌 -> product_no말고 진짜 product no에 해당하는 상품 정보를 띄워주기
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            const user_no = jwtResult.user_no
            sel_product = `SELECT product_name FROM PRODUCT_LIKES JOIN PRODUCTS ON PRODUCT_LIKES.product_no = PRODUCTS.product_no AND
            PRODUCT_LIKES.user_no = ? AND PRODUCT_LIKES.like_enable = 1 AND PRODUCTS.product_enable = 1;`
            const product_result = await res.pool.query(sel_product, user_no)
            res.status(200).json({'msg' : product_result[0]})
        } else {
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.myLog = async(req, res) => { // 최근 본 정보 보여줌 -> 최근2주(크론탭으로 2주지난 것은 자동으로 enable=0 시켜야하지만 지금은 그냥 기간제한없이), 최대 50개
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            const user_no = jwtResult.user_no
            const sel_product = `SELECT * FROM LOG_PRODUCTS JOIN PRODUCTS ON LOG_PRODUCTS.product_no = PRODUCTS.product_no AND LOG_PRODUCTS.user_no = ? 
            AND LOG_PRODUCTS.log_enable = 1 AND PRODUCTS.product_enable = 1;`
            console.log('sel_product : ', sel_product)
            const product_result = await res.pool.query(sel_product, user_no)
            res.status(200).json({'msg' : product_result[0]})
        } else {
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.myReview = async(req, res) => {
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            const user_no = jwtResult.user_no
            const result = await res.pool.query(`SELECT review_title, review_content, review_evaluation, review_created_at 
            FROM PRODUCT_REVIEWS WHERE user_no = ? ORDER BY review_created_at DESC;`, user_no)
            console.log('review result : ', result[0])
            res.status(200).json({'msg' : result[0]})
        } else {
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.myTicket = async(req, res) => {
    try { 
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if(jwtResult) {
            const user_no = jwtResult.user_no
            // ticket_no 를 뽑아서 ticket자체를 보내주기
            const used_result = await res.pool.query(`SELECT * FROM USER_TICKETS WHERE user_no = ? AND user_ticket_enable = 0;`, user_no) // 사용한 티켓
            const unused_result = await res.pool.query(`SELECT * FROM USER_TICKETS WHERE user_no = ? AND user_ticket_enable = 1;`, user_no) // 미사용 티켓
            res.status(200).json({'used' : used_result[0], 'unused' : unused_result[0]})
        } else {
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.myCoupon = async(req, res) => {
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if(jwtResult) {
            const user_no = jwtResult.user_no
            const sel_coupons = `SELECT * FROM USER_COUPONS JOIN COUPONS ON USER_COUPONS.coupon_no = COUPONS.coupon_no AND USER_COUPONS.user_no = ? 
            AND USER_COUPONS.user_coupon_enable = 1 AND COUPONS.coupon_enable = 1;`
            const coupon_list = await res.pool.query(sel_coupons, user_no)
            res.status(200).json({'msg' : coupon_list[0]})
        } else { 
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

module.exports = exports