const express = require('express')
const router = express.Router()
const ticketController = require('../controller/tickets')

const { jwtDecode } = require('../settings/token')

router.get('/use/:ticket_no', jwtDecode(), ticketController.useTicket)

module.exports = router