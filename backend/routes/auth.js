const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', protect, verifyOTP);
router.get('/me', protect, getMe);
router.post('/seed-admin', seedAdmin); // Remove in production
module.exports = router;
