const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true },
  region: String,
  description: { type: String, required: true },
  shortDescription: String,
  images: [String],
  coverImage: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  category: [{
    type: String,
    enum: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'wildlife', 'luxury', 'budget']
  }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  bestTimeToVisit: String,
  climate: String,
  currency: String,
  language: String,
  timezone: String,
  attractions: [{
    name: String,
    description: String,
    image: String,
    type: String
  }],
  travelTips: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  priceRange: {
    budget: Number,
    luxury: Number,
    currency: { type: String, default: 'USD' }
  },
  tags: [String]
}, { timestamps: true });

destinationSchema.index({ name: 'text', country: 'text', tags: 'text' });
destinationSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('Destination', destinationSchema);
