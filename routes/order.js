const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const orderController = require('../controllers/order')
const isAuth = require('../middleware/is-auth');

router.post('/checkout',
   [
      body('to')
         .isEmail()
         .withMessage('Please enter a valid email.')
         .normalizeEmail(),
      body('fullname')
         .trim()
         .not()
         .isEmpty(),
      body('address')
         .trim()
         .not()
         .isEmpty(),
      body('phone')
         .isNumeric()
         .withMessage('Please enter a valid phone number.')
   ],
   isAuth, orderController.postOrders)

router.get('/histories', isAuth, orderController.getOrdersHistories)

router.get('/histories/:orderId', isAuth, orderController.getOrdersHistory)

module.exports = router