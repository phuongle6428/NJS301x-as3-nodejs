const express = require('express')
const app = express();

app.set('view engine', 'ejs')
app.set('views', '../utility')

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check');
const { ObjectID } = require('mongodb')

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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'
   }
}))

const Cart = require('../models/cart')
const Order = require('../models/order');

exports.postOrders = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const error = new Error('Validation failed.');
         error.statusCode = 422;
         error.data = errors.array();
         throw error;
       }
      const { to, fullname, phone, address, idUser } = req.body
      const cart = await Cart.findOne({ user: new ObjectID(idUser) }).populate('products.productId')
      if (cart && cart.length < 1) {
         const error = new Error('There are no products in your cart')
         error.statusCode = 400
         throw error
      }
      const CostPerItems = cart.products.map((items) => {
         return items.productId.price * items.count
      })
      const total = CostPerItems.reduce((pre, current) => pre + current, 0)
      const order = await new Order({
         email: to, fullname, phone, address,
         user: new ObjectID(idUser), products: cart.products,
         total: total
      }).save()
      if(order) {
         const htmlPromise = new Promise((resolve, reject) => {
            app.render('mail-template', {...order._doc, products: cart.products} , (err, html) => {
               if(err) {
                  reject(err)
               } else {
                  resolve(html)
               }
            })
         })
         const html = await htmlPromise
         transporter.sendMail({
            to: to,
            from: 'phuonglnFX16527@funix.edu.vn',
            subject: 'Ecommerce App Checkout Success',
            html: html
         })
      }
      const emptyCart = await Cart.findOneAndUpdate({ user: new ObjectID(idUser) }, { $set: { products: [] } })
      res.status(200).json(order)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getOrdersHistories = async (req, res, next) => {
   const _id = new ObjectID(req.query.idUser)
   try {
      const orders = await Order.find({ user: _id })
      res.status(200).json(orders)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getOrdersHistory = async (req, res, next) => {
   const _id = new ObjectID(req.params.orderId)
   try {
      const order = await Order.findById(_id).populate('products.productId')
      const convertOrder = order.products.map(({ productId, count }) => {
         return { ...productId._doc, count }
      })
      res.status(200).json({ ...order._doc, products: convertOrder })
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}