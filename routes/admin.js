const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin')

router.get('/orders', adminController.getOrders)

module.exports = router