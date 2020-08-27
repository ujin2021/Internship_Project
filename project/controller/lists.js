const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { connect } = require('http2');
const key = require('../settings/settings.js').secretKey;

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.category = async (req, res) => { // 홈화면에 카테고리 띄울 때
    try{
        const category_list = await res.pool.query(`SELECT category_name FROM CATEGORIES`) // icon도 보내줘야함
        if(category_list[0].length > 0){
            res.status(200).json(category_list[0]) 
        } else {
            res.status(200).json( {'msg' : `카테고리가 없습니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

// 카테고리를 선택해서 상품목록을 띄울 때 -> 별점(별점평균/리뷰수), 리뷰수, 조회수, 찜하기수 (카테고리로 groupby? -> 어느카테고리가 가장 인기많은지 알수있을 듯)
exports.product = async (req, res) => { 
    try{
        const category_name = req.body['category_name']
        
        sel_sql = `SELECT * FROM CATEGORIES JOIN PRODUCTS ON CATEGORIES.category_name = ? AND CATEGORIES.category_no = PRODUCTS.category_no
        AND CATEGORIES.category_enable = 1 AND PRODUCTS.product_enable = 1;`
        const product_list = await res.pool.query(sel_sql, category_name)
        
        if(product_list[0].length === 0){
            res.status(200).json({'msg' : `해당 카테고리에 상품이 없습니다.`})
        } else {
            res.status(200).json({'msg' : product_list[0]})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
    
}

exports.review = async(req, res) => { // 상품 리뷰를 클릭했을 때 띄워주는 것
    try{
        const params = [req.body['product_no']]
        const result = await res.pool.query(`SELECT * FROM PRODUCT_REVIEWS WHERE product_no = ?;`, params)
        if (result[0].length > 0){
            res.status(200).json({'msg' : result[0]})
        }
        else if (result[0].length === 0){
            res.status(200).json({'msg' : `리뷰가 없습니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

exports.ticket = async(req, res) => { // 해당상품의 티켓(리스트만)
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        const product_no = req.body['product_no']

        const ticket_result = await res.pool.query(`SELECT ticket_no, ticket_name, ticket_price, ticket_use_period, available_use
        FROM TICKETS WHERE product_no = ? AND ticket_enable = 1;`, product_no) // 해당 상품에 대한 티켓들을 select 한다

        if (ticket_result[0].length === 0){
            res.status(200).json({'msg' : `티켓이 없습니다`})
        }

        if(jwtResult){
            const user_no = jwtResult.user_no
            const sel_coupon = `SELECT * FROM USER_COUPONS JOIN COUPONS ON USER_COUPONS.coupon_no = COUPONS.coupon_no AND USER_COUPONS.user_no = ? 
            AND USER_COUPONS.user_coupon_enable = 1 AND COUPONS.coupon_enable = 1 AND COUPONS.product_no = ?;`
            const coupon_list = await res.pool.query(sel_coupon, [user_no, product_no])
            res.status(200).json({'ticket' : ticket_result[0], 'coupon' : coupon_list[0]}) // 쿠폰이 존재하면 쿠폰정보들을 보내준다
        } else { // 회원이 아니라면 티켓만 보내준다
            res.status(200).json({'ticket' : ticket_result[0]})
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = exports