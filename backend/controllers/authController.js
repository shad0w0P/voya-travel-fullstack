const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'voya_secret_key', { expiresIn: '7d' });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, username, password } = req.body;
    if (!email && !phone && !username) {
      return res.status(400).json({ success: false, message: 'Provide email, phone, or username' });
    }
    const existingUser = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null,
        username ? { username } : null
      ].filter(Boolean)
    });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    const otp = generateOTP();
    const user = await User.create({
      firstName, lastName, email, phone, username, password,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
    });

    // In production, send OTP via email/SMS. For dev, return it.
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Account created. Verify OTP to activate.',
      token,
      user: user.toJSON(),
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login — accepts email, phone, or username
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Provide identifier and password' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const isPhone = /^\+?[\d\s\-()]{7,15}$/.test(identifier);

    const query = isEmail ? { email: identifier.toLowerCase() }
      : isPhone ? { phone: identifier }
      : { username: identifier };

    const user = await User.findOne(query).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Account verified!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Admin seed
exports.seedAdmin = async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ success: false, message: 'Admin already exists' });
    const admin = await User.create({
      firstName: 'Super', lastName: 'Admin',
      email: 'admin@voya.com', username: 'voyaadmin',
      password: 'Admin@1234', role: 'admin', isVerified: true
    });
    res.json({ success: true, message: 'Admin created', credentials: { email: 'admin@voya.com', password: 'Admin@1234' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
