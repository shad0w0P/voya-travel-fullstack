const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [String],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  amenities: [String],
  roomTypes: [{
    name: String,
    capacity: Number,
    price: Number,
    available: { type: Number, default: 10 }
  }],
  category: { type: String, enum: ['budget', 'standard', 'luxury', 'boutique'], default: 'standard' },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
