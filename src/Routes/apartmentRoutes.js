const express = require('express');
const apartmentController = require('../Controllers/ApartmentController');
const { validate, schemas } = require('../Middleware/validator');
const { protectRoute } = require("../Middleware/authGuard");
const router = express.Router();

router.get('/', protectRoute, apartmentController.getAll);
router.post('/create', protectRoute, validate(schemas.CreateApartment), apartmentController.create);
router.post('/favorite', protectRoute, validate(schemas.FavoriteApartment), apartmentController.markFavorite);
router.get('/favorite', protectRoute, apartmentController.getFavorites);
router.get('/filter', protectRoute, apartmentController.filter);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// router.patch('/updatePassword', authController.protect, authController.updatePassword);

// router.patch('/updateMe', authController.protect, userController.updateMyPassword);
// router.delete('/deleteMe', authController.protect, userController.deleteMyProfile);

// router.route('/')
//     .get(userController.getUsers)
//     .post(userController.createUser);

// router.route('/:id')
//     .get(userController.getUser)
//     // .patch(updateUser)
//     .delete(userController.deleteUser);

module.exports = router;
