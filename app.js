const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')
const adminRoutes = require('./routes/admin')
const chatRoutes = require('./routes/chat')

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/general', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chat', chatRoutes)

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://phuong:8u35MwmioNL1zRO1@cluster0.yd1v9tj.mongodb.net/Assignment03'
  )
  .then(result => {
    const server = app.listen(5000);
    const io = require('./socket').init(server, {cors: {origin: "*"}});
    io.on('connection', socket => {
      console.log('Client connected');
      console.log(socket.id, 80)
      socket.on('join-room', function(payload){
        const roomId = payload.roomId
        socket.join(roomId)
      })
      socket.on('disconnect', function () {
        console.log('Client disconnected');
        console.log(socket.id, 86)
    });
    });
  })
  .catch(err => console.log(err));
