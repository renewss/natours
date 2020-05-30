const express = require('express');
const viewCotroller = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewCotroller.getOverview);
router.get('/tour/:id', authController.isLoggedIn, viewCotroller.getTour);
router.get('/login', authController.isLoggedIn, viewCotroller.getLoginForm);
router.get('/me', authController.protect, viewCotroller.getAccount);
router.get('/my-tours', authController.protect, viewCotroller.getMyTours);

router.post('/submit-user-data', authController.protect, viewCotroller.updateUserData);

module.exports = router;
