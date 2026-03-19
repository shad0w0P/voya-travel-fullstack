const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const { search, category, country, featured, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (country) filter.country = new RegExp(country, 'i');
    if (featured === 'true') filter.isFeatured = true;
    const destinations = await Destination.find(filter)
      .sort({ isFeatured: -1, rating: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Destination.countDocuments(filter);
    res.json({ success: true, data: destinations, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest || !dest.isActive) return res.status(404).json({ success: false, message: 'Destination not found.' });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/destinations - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.status(201).json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/destinations/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dest) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: dest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/destinations/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!dest) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Destination removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
