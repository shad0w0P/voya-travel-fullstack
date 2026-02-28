const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hotel', 'flight', 'train', 'bus', 'metro'], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  bookingRef: { type: String, unique: true },
  details: { type: mongoose.Schema.Types.Mixed },
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  passengers: [{
    firstName: String,
    lastName: String,
    age: Number,
    idType: String,
    idNumber: String
  }],
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  checkIn: Date,
  checkOut: Date,
  notes: String
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  if (!this.bookingRef) {
    this.bookingRef = 'VYA' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
