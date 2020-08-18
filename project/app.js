const express = require('express');
const request = require('request');
const database = require('./config/database')
const dbConfig = require('./config/dbConfig').local
const jwtDecode = require('./config/token').jwtDecode
const app = express();
app.use(express.json()) // bodyParser 사용 설정

const indexRouter = require('./routes/index.js')
const userRouter = require('./routes/users.js') // email_check, signup, login
const listRouter = require('./routes/lists.js') // category list, product list, review list
const productRouter = require('./routes/products.js')

app.use(database.sql.pool('pool', {
    host : dbConfig.host,
    port : dbConfig.port,
    user : dbConfig.user,
    password : dbConfig.password,
    database : dbConfig.database
}))

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/lists', listRouter)

app.use('/products', productRouter)

app.listen(3000, function(){
    console.log('app listening on port 3000')
})