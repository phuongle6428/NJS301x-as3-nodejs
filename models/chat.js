const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatchildSchema = new Schema({
   text: {
      type: String,
      require: true
   },
   userId: {
      type: String,
      require: true
   },
   _id: false
}, { timestamps: true })

const chatSchema = new Schema({
   message: {
      type: [chatchildSchema],
      _id: false
   }
});

module.exports = mongoose.model('Chat', chatSchema);