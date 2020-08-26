const express = require('express')
const router = express.Router()
const productController = require('../controller/products')

const { jwtDecode } = require('../settings/token')

router.post('/review', jwtDecode(), productController.productReview) // 해당 product 에 review 등록
router.post('/like', jwtDecode(), productController.productLike) // 해당 product 찜하기
router.post('/log', jwtDecode(), productController.productLog) // 해당 product 조회 기록
router.post('/buyTicket', jwtDecode(), productController.buyTicket) // 해당 product 의 ticket 구매

module.exports = router