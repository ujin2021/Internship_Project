const express = require('express')
const router = express.Router()
const listController = require('../controller/lists')

const { jwtDecode } = require('../settings/token')

router.get('/category', listController.category)
router.get('/product/:category_no', listController.product)
router.get('/review/:product_no', listController.review)
router.get('/ticket/:product_no', jwtDecode(), listController.ticket) // 해당상품의 티켓과 만약 회원이라면 회원이 가지고 있는 쿠폰도 보내준다.

module.exports = router;