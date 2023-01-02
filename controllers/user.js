const { ObjectID } = require('mongodb')
const Cart = require('../models/cart')
const User = require('../models/user')

exports.getUserDetail = async (req, res, next) => {
   const _id = req.params.userId
   try {
      const user = await User.findById(new ObjectID(_id), 'email fullname phone orders auth cart')
      if (!user) {
         const error = new Error('No User found')
         error.statusCode = 400
         throw error
      }
      res.status(201).json(user)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getUserCart = async (req, res, next) => {
   const _id = req.query.userId
   try {
      const cart = await Cart.getUserCart(_id)
      res.status(200).json(cart)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.postAddToCart = async (req, res, next) => {
   const count = req.query.count
   const idProduct = new ObjectID(req.query.idProduct)
   const idUser = new ObjectID(req.query.idUser)
   const isProduct = await Cart.findOne({ user: idUser, 'products.productId': idProduct })
   if (!isProduct) {
      const cart = await Cart.findOneAndUpdate({ user: idUser }, { $push: { products: { count, productId: idProduct } } })
      return res.status(200).json(cart)
   }
   const cart = await Cart.findOneAndUpdate({ user: idUser, 'products.productId': idProduct }, { $inc: { 'products.$.count': count } })
   res.status(200).json(cart)
}

exports.updateCart = async (req, res, next) => {
   const count = req.query.count
   const idProduct = new ObjectID(req.query.idProduct)
   const idUser = new ObjectID(req.query.idUser)
   const cart = await Cart.findOneAndUpdate({ user: idUser, 'products.productId': idProduct }, { $set: { 'products.$.count': count } })
   res.status(200).json(cart)
}

exports.deleteCart = async (req, res, next) => {
   const idProduct = new ObjectID(req.query.idProduct)
   const idUser = new ObjectID(req.query.idUser)
   const cart = await Cart.findOneAndUpdate({ user: idUser }, { $pull: { products: { productId: idProduct } } })
   res.status(200).json(cart)
}