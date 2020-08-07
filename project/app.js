var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('mysql');
var dbconfig = require('./database.js');
var conn = mysql.createConnection(dbconfig);
const app = express();
app.use(express.json()); // bodyParser 사용 설정

app.get('/', function(req, res){
    res.send('This is root');
});

// 모든 정보 읽어오도록하기
app.get('/signup/', function(req, res){
    conn.query('SELECT * FROM user', function(err, result){
        if(err) console.log(err);
        console.log(rows[0]);
        var html = `<p>${result[0].email}</p>`; 
        res.send(html);
    });
})

// 비밀번호 암호화, 중복검사 추가하기
app.post('/signup/', function(req, res){
    console.log(req.body);
    var email = req.body["email"];
    var username = req.body["username"];
    var check_sql = 'SELECT * FROM user WHERE email=?';
    var params = [email]
    conn.query(check_sql, params, function(err, result){
        if(err) console.log(err);
        else{
            console.log(result);
            if(result.length === 0){ // 새로 가입하는 회원일 경우
                var sql = 'INSERT INTO user(email, username) VALUES(?, ?);'
                var params = [email, username];
                conn.query(sql, params, function(err, rows, fields){
                    if(err) console.log(err);
                    else{console.log('save data');}
                });
                var status = 201;
                var msg = 'Save success'
            }
            else{ // 이미 존재하는 회원일 경우
                var status = 503;
                var msg = 'Email already exist'
            }
        }
        res.status(status).json(msg);
    });
    
});

app.listen(3000, function(){
    console.log('app listening on port 3000');
})