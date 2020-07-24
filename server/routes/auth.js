const express = require('express');
const router = express.Router()
// const { postSignup, postSignin, getUserDetails } = require('../controller/auth');
const authController = require('../controller/auth')


router.post('/signup', authController.postSignup)
router.post('/signin', authController.postSignin)


module.exports = router;