const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { firstName, lastName, preferences }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
module.exports = router;
