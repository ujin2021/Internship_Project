const express = require('express')
const router = express.Router()
const listController = require('../controller/lists')

router.get('/category', listController.category)
router.post('/product', listController.product)
router.post('/review', listController.review)

module.exports = router;