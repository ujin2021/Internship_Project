const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const key = require('../config/settings.js').secretKey;

// crawling
const axios = require('axios');
const cheerio = require('cheerio');

let conn = require('../config/db_settings.js');
const { param } = require('../routes/index.js');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.listAPI = (req, res) => {
    // 카테고리 목록을 보여준다.
    conn.query('SELECT * FROM category', function(err, result){
        if(err) console.log(err);
        console.log(result);
        let body = '';
        for (let i = 0; i< result.length; i++) {
            let name = result[i].name;
            body += name;
        }
        // console.log('body : ', body);
        // let html = `${body}`;
        res.send(body);
    });
}

exports.selectAPI = (req, res) => {
   // 선택한 카테고리에 해당하는 상품을 보내준다.
   let token = req.get('Authorization'); // header 값 받아오기
   console.log('token : ', token);

   let decoded = jwt.verify(token, key.secretKey);
   if(decoded){
       console.log('token check ok');
       sql = 'SELECT * FROM product where category=?';
       param = [''];
       conn.query(sql, param,function(err, result){
           if(err){console.log(err);}
           console.log(result);
            let body = '';
            for (let i = 0; i< result.length; i++) {
            let list = result[i].name;
            body += list;
            }
            console.log('body : ', body);
            res.send(body);
        })
    }
   else{
       console.log('need token');
       res.status(503).json('Need token');
   }
}


module.exports = exports