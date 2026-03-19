const Hotel = require('../models/Hotel');

exports.getHotels = async (req, res) => {
  try {
    const { city, country, minPrice, maxPrice, category, rating, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (country) query['location.country'] = new RegExp(country, 'i');
    if (category) query.category = category;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ rating: -1 });
    res.json({ success: true, data: hotels, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Hotel removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
