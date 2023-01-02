const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat')
const isAuth = require('../middleware/is-auth')

router.get('/create', chatController.getCreateRoomId)

router.post('/messages', chatController.postMessage)

router.get('/messages/:roomId', chatController.getMessages)

router.get('/rooms', isAuth, chatController.getAllRoom)

module.exports = router