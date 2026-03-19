const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

let amadeusToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
  if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry) return amadeusToken;
  try {
    const res = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    amadeusToken = res.data.access_token;
    tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
    return amadeusToken;
  } catch (err) {
    console.error('Amadeus auth error:', err.message);
    return null;
  }
};

// @GET /api/flights/search?origin=DEL&destination=BOM&date=2025-06-01&adults=2
router.get('/search', protect, async (req, res) => {
  try {
    const { origin, destination, date, adults = 1, travelClass = 'ECONOMY' } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ success: false, message: 'origin, destination, date required.' });
    }

    const token = await getAmadeusToken();
    if (!token) {
      // Return mock data if API key not configured
      return res.json({ success: true, data: getMockFlights(origin, destination, date, adults), mock: true });
    }

    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: origin.toUpperCase(),
        destinationLocationCode: destination.toUpperCase(),
        departureDate: date,
        adults,
        travelClass: travelClass.toUpperCase(),
        max: 20
      }
    });

    res.json({ success: true, data: response.data.data, dictionaries: response.data.dictionaries });
  } catch (err) {
    console.error('Flight search error:', err.message);
    res.json({ success: true, data: getMockFlights(req.query.origin, req.query.destination, req.query.date, req.query.adults), mock: true });
  }
});

// @GET /api/flights/airports?keyword=mumbai
router.get('/airports', async (req, res) => {
  try {
    const { keyword } = req.query;
    const token = await getAmadeusToken();
    if (!token) {
      return res.json({ success: true, data: getMockAirports(keyword), mock: true });
    }
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: { Authorization: `Bearer ${token}` },
      params: { subType: 'AIRPORT', keyword, page: { limit: 10 } }
    });
    res.json({ success: true, data: response.data.data });
  } catch (err) {
    res.json({ success: true, data: getMockAirports(req.query.keyword), mock: true });
  }
});

function getMockFlights(origin, destination, date, adults) {
  const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoFirst'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `FL${i + 1}`,
    airline: airlines[i % airlines.length],
    flightNumber: `${airlines[i % airlines.length].slice(0, 2).toUpperCase()}${100 + i}`,
    origin, destination, date,
    departure: `${6 + i * 2}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${8 + i * 2}:${i % 2 === 0 ? '45' : '15'}`,
    duration: `${2 + i % 3}h ${i % 2 === 0 ? '45' : '15'}m`,
    class: 'Economy',
    price: 3200 + i * 800 + Math.floor(Math.random() * 500),
    currency: 'INR',
    seats: 12 - i,
    stops: i % 3 === 0 ? 1 : 0
  }));
}

function getMockAirports(keyword = '') {
  const airports = [
    { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai' },
    { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore' },
    { code: 'MAA', name: 'Chennai International', city: 'Chennai' },
    { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata' },
  ];
  return airports.filter(a =>
    a.city.toLowerCase().includes(keyword.toLowerCase()) ||
    a.name.toLowerCase().includes(keyword.toLowerCase()) ||
    a.code.toLowerCase().includes(keyword.toLowerCase())
  );
}

module.exports = router;
