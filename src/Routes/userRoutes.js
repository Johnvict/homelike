const express = require('express');
const authController = require('../Controllers/AuthController');
const userController = require('../Controllers/UserController');
const { validate, schemas } = require('./../Middleware/validator');
const { protectRoute } = require('../Middleware/authGuard');
const router = express.Router();

router.post('/signup', validate(schemas.UserSignup), authController.signUp);
router.post('/login', validate(schemas.UserLogin), authController.login);
router.get('/profile', protectRoute, userController.getProfile);

module.exports = router;
