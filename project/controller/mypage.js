const express = require('express');
const { category } = require('./lists');
const consoleStamp = require('console-stamp');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.myLike = async(req, res) => { // 나의 찜하기 목록을 보여줌 -> product_no말고 진짜 product no에 해당하는 상품 정보를 띄워주기
    const conn = await res.pool.getConnection()
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            let product_list = []
            const user_no = jwtResult.user_no
            const like_result = await conn.query(`SELECT product_no FROM PRODUCT_LIKES WHERE user_no = ? AND like_enable = 1;`, user_no)
            console.log('result : ', like_result[0])
            if (like_result[0].length === 0){
                res.status(200).json({'status' : 200, 'msg' : `찜한 상품이 없습니다.`})
            }
            for (let i = 0; i < like_result[0].length; i++){
                product_list[i] = like_result[0][i].product_no
            }
            console.log('product_list : ', product_list)
            const sql = `SELECT product_name FROM PRODUCTS WHERE product_no IN (` + product_list.join(', ') +`)` // test이니까 product_name 만 조회함. 수정할 것
            const product_result = await conn.query(sql)
            console.log(product_result[0])
            res.status(200).json({'status' : 200, 'msg' : product_result[0]})
        } else {
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release()
    }
}

exports.myLog = async(req, res) => { // 최근 본 정보 보여줌 -> 최근2주(크론탭으로 2주지난 것은 자동으로 enable=0 시켜야하지만 지금은 그냥 기간제한없이), 최대 50개
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            let product_list = []
            const user_no = jwtResult.user_no
            const log_result = await conn.query(`SELECT product_no FROM LOG_PRODUCTS WHERE user_no = ? AND log_enable = 1 ORDER BY log_at DESC;`, user_no)
            console.log('result : ', log_result[0])
            if (log_result[0].length === 0){
                res.status(200).json({'status' : 200, 'msg' : `최근 본 상품이 없습니다.`})
            }
            for (let i = 0; i < log_result[0].length; i++){
                product_list[i] = log_result[0][i].product_no
            }
            product_list = product_list.slice(undefined, 50)
            console.log('product list : ', product_list)
            const sql = `SELECT product_name FROM PRODUCTS WHERE product_no IN (` + product_list.join(', ') + `)`
            const product_result = await conn.query(sql)
            console.log(product_result[0])
            res.status(200).json({'status' : 200, 'msg' : product_result[0]})
        } else {
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release()
    }
}

exports.myReview = async(req, res) => {
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if (jwtResult){
            const user_no = jwtResult.user_no
            const result = await conn.query(`SELECT review_title, review_content, review_evaluation, review_created_at 
            FROM PRODUCT_REVIEWS WHERE user_no = ? ORDER BY review_created_at DESC;`, user_no)
            console.log('review result : ', result[0])
            res.status(200).json({'status' : 200, 'msg' : result[0]})
        } else {
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release()
    }
}

exports.myTicket = async(req, res) => {
    const conn = await res.pool.getConnection()
    try { 
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if(jwtResult) {
            const user_no = jwtResult.user_no
            const used_result = await conn.query(`SELECT * FROM USER_TICKETS WHERE user_no = ? AND user_ticket_enable = 0;`, user_no) // 사용한 티켓
            const unused_result = await conn.query(`SELECT * FROM USER_TICKETS WHERE user_no = ? AND user_ticket_enable = 1;`, user_no) // 미사용 티켓
            res.status(200).json({'status' : 200, 'used' : used_result[0], 'unused' : unused_result[0]})
        } else {
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release()
    }
}

exports.myCoupon = async(req, res) => {
    const conn = await res.pool.getConnection()
    try{
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        if(jwtResult) {
            const user_no = jwtResult.user_no
            const coupon_result = await conn.query(`SELECT coupon_no FROM USER_COUPONS WHERE user_no = ? AND user_coupon_enable = 1;`, user_no)
            const result = await conn.query(`SELECT * FROM COUPONS WHERE coupon_no = ?;`, coupon_result[0][0]['coupon_no'])
            res.status(200).json({'status' : 200, 'msg' : result[0]})
        } else { 
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
    } finally {
        conn.release()
    }
}

module.exports = exports