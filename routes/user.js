const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/user');


router.get('/cart',isAuth, userController.getUserCart)

router.post('/cart/add',isAuth, userController.postAddToCart)

router.put('/cart/update',isAuth, userController.updateCart)

router.delete('/cart/delete',isAuth, userController.deleteCart)

router.get('/:userId',isAuth, userController.getUserDetail)



module.exports = router