const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
   {
      name: {
         type: String,
         required: true
      },
      category: {
         type: String,
         required: true
      },
      short_desc: {
         type: String,
         required: true
      },
      long_desc: {
         type: String,
      },
      price: {
         type: Number,
         require: true
      },
      img1: {
         type: String,
         require: true
      },
      img2: {
         type: String,
         require: true
      },
      img3: {
         type: String,
         require: true
      },
      img4: {
         type: String,
         require: true
      },
   }
);

module.exports = mongoose.model('Product', productSchema);
