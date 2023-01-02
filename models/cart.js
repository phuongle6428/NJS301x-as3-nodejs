const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user')

const cartSchema = new Schema({
   products: [{
      productId: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         require: true
      },
      count: {
         type: Number,
         require: true
      }
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
   }
});

cartSchema.statics.getUserCart = async function(_id) {
   const user = await User.findById(new ObjectID(_id))
   if(!user) {
      const error =  new Error('No User found')
      error.statusCode = 400
      throw error
   }
   if(!user.cart) {
      this.user = user
      const updateUser = await User.updateOne({_id: _id}, {$set: {cart: this}})
   }
   const cart = await this.findById(user.cart).populate('products.productId')
   const products = cart.products.map((product) => {
      return {...product.productId._doc, count: product.count}
   })
   return {...cart._doc, products: products}
}

module.exports = mongoose.model('Cart', cartSchema);