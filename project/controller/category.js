const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const key = require('../config/settings.js').secretKey;

const tokenCheck = require('./tokenCheck').tokenCheck;

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.listAPI = async (req, res) => {
    try{
        const result = await res.pool.query(`SELECT * FROM category`)
        if(result.length > 0){
            res.status(200).json(result[0])
        } else {
            res.status(204).json(`카테고리가 없습니다.`)
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
}


exports.selectCategory = async (req, res) => {
    try{
        const category = req.body['name']
        let sql = `SELECT id FROM category WHERE name = ?;`
        let result = await res.pool.query(sql, [category])

        sql = `SELECT * FROM product WHERE id = ?;`
        result = await res.pool.query(sql, [result[0][0].id])
		console.log('result : ', result[0].length)
        if(result[0].length === 0){
            res.status(204).json(`해당 카테고리에 상품이 없습니다.`)
        } else {
            res.status(200).json(result[0])
        }
    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    }
    
 }

module.exports = exports
