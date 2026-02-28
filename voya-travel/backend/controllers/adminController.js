const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalBookings, recentBookings, revenue] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Hotel.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(10),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);
    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalHotels, totalBookings, revenue: revenue[0]?.total || 0 },
        recentBookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
