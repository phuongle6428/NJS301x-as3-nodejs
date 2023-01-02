const { ObjectID } = require('mongodb');
const io = require('../socket');
const Chat = require('../models/chat');
const User = require('../models/user')

exports.getCreateRoomId = async (req, res, next) => {
   try {
      const chat = await new Chat().save()
      io.getIO().emit('new-chat-room', {roomId: chat._id})
      res.status(200).json(chat)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getMessages = async (req, res, next) => {
   try {
      const _id = new ObjectID(req.params.roomId)
      const chat = await Chat.findById(_id)
      res.status(200).json(chat)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.postMessage = async (req, res, next) => {
   try {
      const text = req.body.message
      const roomId = req.body.roomId
      const userId = req.body.userId
      console.log(roomId)
      io.getIO().to(roomId).emit('receive_message', {message: {text, userId}, action: 'update', roomId: roomId})
      const chat = await Chat.findOneAndUpdate({_id: new ObjectID(roomId)}, {$push: {message: {text: text, userId: userId}}})
      const newlyChat = await Chat.findById(new ObjectID(roomId))
      res.status(200).json(newlyChat)
   } catch (error) {
      if (!error.statusCode) {
         error.statusCode = 500
      }
      next(error)
   }
}

exports.getAllRoom = async (req, res, next) => {
   const userId = req.userId
   const user = await User.findById(new ObjectID(userId))
   const isValid = user.auth === 'Admin'
   if(!isValid) {
      return res.status(401).json('UnAuth')
   }
   const chats = await Chat.find()
   res.status(200).json(chats)
}