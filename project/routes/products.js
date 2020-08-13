const express = require('express')
const router = express.Router()
const productController = require('../controller/products')

router.post('/review_list', productController.reviewList) // 해당 product의 review 들을 띄워줌
router.post('/review', productController.review) // 해당 product 에 review 등록
router.post('/like', productController.like)

module.exports = router