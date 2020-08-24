const express = require('express')
const router = express.Router()
const ticketController = require('../controller/tickets')

const { jwtDecode } = require('../config/token')

router.post('/use', jwtDecode(), ticketController.useTicket)

module.exports = router