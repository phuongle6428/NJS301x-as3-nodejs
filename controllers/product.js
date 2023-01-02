const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
   try {
      const products = await Product.find()
      res.status(200).json(products)
   } catch (error) {
      if(!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }

}

exports.getProduct = async (req, res, next) => {
   try {
      const _id = req.params.product_id
      if(!_id) {
         const error =  new Error('Bad request')
         error.statusCode = 400
         throw error
      }
      const product = await Product.findById(_id)
      if(!product) {
         const error =  new Error('No Product found')
         error.statusCode = 400
         throw error
      }
      res.status(200).json(product)
   } catch (error) {
      if(!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getSearchByName = async (req, res, next) => {
   const name = req.query.name
   const products = await Product.find({name: {$regex: name, $options: 'gi'}})
   res.status(200).json(products)
}

exports.getProductsPagination = async (req, res, next) => {
   const page = Number(req.query.page)
   const count = Number(req.query.count)
   const search = req.query.search
   const category =  req.query.category
   try {
      const products = await Product.find({category, name: {$regex: search, $options: 'gi'}}).limit(count).skip(count*(page-1))
      res.status(200).json(products)
   } catch (error) {
      if(!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }

}