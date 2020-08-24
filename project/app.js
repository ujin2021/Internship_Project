const express = require('express')
const request = require('request')
const database = require('./config/database')
const dbConfig = require('./config/dbConfig').local
const jwtDecode = require('./config/token').jwtDecode
const app = express();
app.use(express.json()) // bodyParser 사용 설정

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users') // email_check, signup, login
const listRouter = require('./routes/lists') // category list, product list, review list
const productRouter = require('./routes/products') // productReview, Like, viewLog
const myPageRouter = require('./routes/mypage') // myReview, myLog, myLike, myTicket
const ticketRouter = require('./routes/tickets') // useTicket


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
app.use('/mypage', myPageRouter)
app.use('/tickets', ticketRouter)

app.listen(3000, function(){
    console.log('app listening on port 3000')
})