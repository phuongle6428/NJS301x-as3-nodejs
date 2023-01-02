const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oderSchema = new Schema({
   products: [{
      productId: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         require: true
      },
      count: {
         type: Number,
         require: true
      },
      _id: false
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   status: {
      type: String,
      enum: ['Paid','UnPaid'],
      default: 'UnPaid'
   },
   delivery: {
      type: String,
      enum: ['UnDelivered', 'OnProcess', 'Delivered'],
      default: 'UnDelivered'
   },
   fullname: {
      type: String,
      require: true
   },
   phone: {
      type: Number,
      require: true
   },
   address: {
      type: String,
      require: true
   },
   email: {
      type: String,
      require: true
   },
   total: {
      type: Number,
      require: true
   }
}, { timestamps: true })

module.exports = mongoose.model('Order', oderSchema);