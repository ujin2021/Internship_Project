const express = require('express')
const router = express.Router()
const mypageController = require('../controller/mypage')

const { jwtDecode } = require('../config/token')

router.get('/likes', jwtDecode(), mypageController.myLike)
router.get('/logs', jwtDecode(), mypageController.myLog)
router.get('/reviews', jwtDecode(), mypageController.myReview)
router.get('/tickets', jwtDecode(), mypageController.myTicket)

module.exports = router