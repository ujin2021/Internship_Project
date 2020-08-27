
const jwt = require('jsonwebtoken');
const key = require('../settings/settings.js').secretKey;
// 토큰 만료시 처리하는 것 추가
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