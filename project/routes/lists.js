const express = require('express')
const router = express.Router()
const listController = require('../controller/lists')

const { jwtDecode } = require('../config/token')

router.get('/category', listController.category)
router.post('/product', listController.product)
router.post('/review', listController.review)
router.post('/ticket', jwtDecode(), listController.ticket)

module.exports = router;