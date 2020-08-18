const express = require('express')
const router = express.Router()
const productController = require('../controller/products')

const { jwtDecode } = require('../config/token')

router.post('/review', jwtDecode(), productController.productReview) // 해당 product 에 review 등록
router.post('/like', jwtDecode(), productController.productLike) // 해당 product 찜하기
router.post('/log', jwtDecode(), productController.productLog) // 해당 product 조회 기록

module.exports = router