const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const key = require('../config/settings.js').secretKey;

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.category = async (req, res) => { // 홈화면에 카테고리 띄울 때
    try{
        const result = await res.pool.query(`SELECT * FROM CATEGORIES`)
        if(result.length > 0){
            res.status(200).json({'status' : 200, 'msg' : result[0]})
        } else {
            res.status(200).json({'status' : 200, 'msg' : `카테고리가 없습니다.`})
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}

// 카테고리를 선택해서 상품목록을 띄울 때 -> 별점(별점토/리뷰수), 리뷰수, 조회수, 찜하기수 (카테고리로 groupby? -> 어느카테고리가 가장 인기많은지 알수있을 듯)
exports.product = async (req, res) => { 
    try{
        const category_name = req.body['category_name']
        let sql = `SELECT category_no FROM CATEGORIES WHERE category_name = ?;`
        let result = await res.pool.query(sql, [category_name])

        sql = `SELECT * FROM PRODUCTS WHERE category_no = ?;`
        result = await res.pool.query(sql, [result[0][0].category_no])
		// console.log('result : ', result)
        if(result[0].length === 0){
            res.status(200).json({'status' : 200, 'msg' : `해당 카테고리에 상품이 없습니다.`})
        } else {
            res.status(200).json({'status' : 200, 'msg' : result[0]})
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
            res.status(200).json({'status' : 200, 'msg' : result[0]})
        }
        else if (result[0].length === 0){
            res.status(200).json({'status' : 200, 'msg' : `리뷰가 없습니다.`})
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
        console.log('ticket result : ', ticket_result[0])

        if (ticket_result[0].length === 0){
            res.status(200).json({'status' : 200, 'msg' : `티켓이 없습니다`})
        }

        if(jwtResult){
            const user_no = jwtResult.user_no
            const user_coupon = await res.pool.query(`SELECT coupon_no FROM USER_COUPONS WHERE user_no = ? AND user_coupon_enable;`, user_no) // 회원의 쿠폰을 조회한다
            if (user_coupon[0].length === 0) { // 만약 쿠폰이 없으면 빈 배열을 return 한다
                res.status(200).json({'status' : 200, 'ticket' : ticket_result[0], 'coupon' : []})
            }
            let coupon_arr = []
            for (let i = 0; i < user_coupon[0].length; i++) {
                coupon_arr.push(user_coupon[0][i]['coupon_no'])
            }
            const coupon_list = await res.pool.query(`SELECT coupon_no, coupon_name, coupon_discount_percent, coupon_end_at, coupon_requirement 
            FROM COUPONS WHERE coupon_no IN (` + coupon_arr.join(', ') + `) AND product_no = ${product_no} AND coupon_enable = 1`) // 해당 상품에 대한 쿠폰이 있는지 조회한다
            res.status(200).json({'status' : 200, 'ticket' : ticket_result[0], 'coupon' : coupon_list[0]}) // 쿠폰이 존재하면 쿠폰정보들을 보내준다
        } else { // 회원이 아니라면 티켓만 보내준다
            res.status(200).json({'status' : 200, 'ticket' : ticket_result[0]})
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports = exports