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


exports.product = async (req, res) => { // 카테고리를 선택해서 상품목록을 띄울 때
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
        const product_no = req.body['product_no']
        const result = await res.pool.query(`SELECT ticket_no, ticket_name, ticket_usage_period, available_usage_time, ticket_price FROM TICKETS WHERE product_no = ? AND ticket_enable = 1;`, product_no)
        console.log('result : ', result[0])
        if (result[0].length === 0){
            res.status(200).json({'status' : 200, 'msg' : `티켓이 없습니다`})
        }
        res.status(200).json({'status' : 200, 'msg' : result[0]})
    } catch (e) {
        console.error(e)

    }
}

module.exports = exports