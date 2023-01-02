const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  phone: {
    type: Number,
    require: true
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  auth: {
    type: String,
    enum: ["Client", "Admin", "Consultant"],
    default: "Client"
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }
})

module.exports = mongoose.model('User', userSchema);
