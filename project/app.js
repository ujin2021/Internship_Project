const express = require('express');
const request = require('request');
const app = express();
app.use(express.json()); // bodyParser 사용 설정

const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user_account.js'); // email_check, signup, login
const categoryRouter = require('./routes/category.js');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);

app.listen(3000, function(){
    console.log('app listening on port 3000');
})