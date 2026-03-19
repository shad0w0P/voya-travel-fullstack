const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    await booking.populate('user', 'firstName lastName email');
    res.status(201).json({ success: true, data: booking, message: `Booking confirmed! Ref: ${booking.bookingRef}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: { $ne: 'cancelled' } },
      { status: 'cancelled' }, { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found or already cancelled' });
    res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
