
const jwt = require('jsonwebtoken');
const key = require('../config/settings.js').secretKey;
// 그냥 verify로 검사? db검사 안해도되는지
exports.tokenCheck = (token) => {
    console.log('token : ', token);

    let decoded = jwt.verify(token, key.secretKey);
    if(decoded){
        console.log('token check ok');
        return true;
    }
    else{
        console.log('need token');
        return false;
    }
}

/*
token check 코드
let check = tokenCheck(req.get('Authorization')); // token check
    console.log('check : ', check);
    if(!check){
        console.log('Need token');
        res.status(503).json('Need token');
    }
*/
module.exports = exports