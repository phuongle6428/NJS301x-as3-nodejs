const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/products', productController.getProducts)

router.get('/products/pagination', productController.getProductsPagination)

router.get('/products/search', productController.getSearchByName)

router.get('/products/:product_id', productController.getProduct)





module.exports = router