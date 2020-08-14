const express = require('express')
const router = express.Router()
const productController = require('../controller/products')

router.post('/review_list', productController.reviewList) // 해당 product의 review 들을 띄워줌
router.post('/review', productController.productReview) // 해당 product 에 review 등록
router.post('/like', productController.productLike) // 해당 product 찜하기
router.post('/log', productController.productLog) // 해당 product 조회 기록

module.exports = router