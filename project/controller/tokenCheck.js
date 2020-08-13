
const jwt = require('jsonwebtoken');
const key = require('../config/settings.js').secretKey;
// 그냥 verify로 검사? db검사 안해도되는지
exports.tokenCheck = async (token) => {
    console.log('token : ', token);

    let decoded = jwt.verify(token, key.secretKey)
    if(decoded){
        console.log('decoded', decoded)
        console.log('token check ok')
        return {'status' : true, 'decoded' : decoded}
    }
    else{
        console.log('need token')
        return false;
    }
}

module.exports = exports