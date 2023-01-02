const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/users/signin', authController.signin);

router.post(
  '/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('fullname')
      .trim()
      .not()
      .isEmpty(),
    body('phone')
      .isNumeric()
      .withMessage('Please enter a valid phone number.')
  ],
  authController.signup
);

router.post('/admin/signin', authController.postAdSignin);

router.post(
  '/admin/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('fullname')
      .trim()
      .not()
      .isEmpty(),
    body('phone')
      .isNumeric()
      .withMessage('Please enter a valid phone number.')
  ],
  authController.postAdSignup
);

router.get('/admin/status', isAuth, authController.getUserStatus);

module.exports = router;
