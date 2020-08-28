const express = require('express')
const router = express.Router()
const listController = require('../controller/lists')

const { jwtDecode } = require('../settings/token')

router.get('/category', listController.category)
router.post('/product', listController.product)
router.post('/review', listController.review)
router.post('/ticket', jwtDecode(), listController.ticket) // 해당상품의 티켓과 만약 회원이라면 회원이 가지고 있는 쿠폰도 보내준다.

module.exports = router;