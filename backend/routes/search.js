const express = require('express');
const router = express.Router();
const axios = require('axios');

// Geocoding via Nominatim (free, no API key needed)
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q, format: 'json', limit: 5, addressdetails: 1 },
      headers: { 'User-Agent': 'VoyaTravel/1.0' }
    });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reverse geocode (coords -> location name)
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: { lat, lon, format: 'json' },
      headers: { 'User-Agent': 'VoyaTravel/1.0' }
    });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Airport IATA code lookup
router.get('/airports', async (req, res) => {
  const airports = [
    { iata: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
    { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
    { iata: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
    { iata: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
    { iata: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
    { iata: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
    { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
    { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
    { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
    { iata: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
    { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' }
  ];
  const { q } = req.query;
  const filtered = q ? airports.filter(a => a.iata.toLowerCase().includes(q.toLowerCase()) || a.city.toLowerCase().includes(q.toLowerCase())) : airports;
  res.json({ success: true, data: filtered });
});

module.exports = router;
