const express = require('express');
const trainRouter = express.Router();
const busRouter = express.Router();
const metroRouter = express.Router();
const { protect } = require('../middleware/auth');

// TRAINS
trainRouter.get('/search', protect, async (req, res) => {
  const { from, to, date, passengers = 1, classType = 'SL' } = req.query;
  if (!from || !to || !date) return res.status(400).json({ success: false, message: 'from, to, date required.' });
  const trains = getMockTrains(from, to, date, passengers, classType);
  res.json({ success: true, data: trains });
});

trainRouter.get('/stations', async (req, res) => {
  const { keyword } = req.query;
  const stations = [
    { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
    { code: 'CSTM', name: 'Chhatrapati Shivaji Terminus', city: 'Mumbai' },
    { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
    { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bangalore' },
    { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad' },
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  ].filter(s =>
    !keyword || s.name.toLowerCase().includes(keyword.toLowerCase()) ||
    s.city.toLowerCase().includes(keyword.toLowerCase()) ||
    s.code.toLowerCase().includes(keyword.toLowerCase())
  );
  res.json({ success: true, data: stations });
});

function getMockTrains(from, to, date, passengers, classType) {
  const classes = {
    'SL': { name: 'Sleeper', price: 450 },
    '3A': { name: 'Third AC', price: 1100 },
    '2A': { name: 'Second AC', price: 1600 },
    '1A': { name: 'First AC', price: 2800 },
  };
  const cls = classes[classType] || classes['SL'];
  const trainNames = [
    'Rajdhani Express', 'Shatabdi Express', 'Duronto Express',
    'Garib Rath', 'Jan Shatabdi', 'Superfast Express', 'Intercity Express'
  ];
  return Array.from({ length: 7 }, (_, i) => ({
    id: `TR${1000 + i}`,
    trainNumber: `${12000 + i * 100 + 1}`,
    name: trainNames[i],
    from, to, date,
    departure: `${4 + i * 3}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${10 + i * 2}:${i % 2 === 0 ? '30' : '00'}`,
    duration: `${6 + i}h ${i % 2 === 0 ? '30' : '0'}m`,
    class: cls.name,
    pricePerSeat: cls.price + i * 50,
    totalPrice: (cls.price + i * 50) * Number(passengers),
    availableSeats: 30 - i * 3,
    pantry: i % 2 === 0,
    runsDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, 5 + i % 3)
  }));
}

// BUSES
busRouter.get('/search', protect, async (req, res) => {
  const { from, to, date, passengers = 1, busType = 'AC' } = req.query;
  if (!from || !to || !date) return res.status(400).json({ success: false, message: 'from, to, date required.' });
  const buses = getMockBuses(from, to, date, passengers, busType);
  res.json({ success: true, data: buses });
});

function getMockBuses(from, to, date, passengers, busType) {
  const operators = ['KSRTC', 'MSRTC', 'APSRTC', 'RedBus Express', 'SRS Travels', 'Orange Tours', 'VRL Travels'];
  const types = { 'AC': 800, 'Non-AC': 400, 'Sleeper': 1200, 'Volvo': 1100 };
  const priceBase = types[busType] || 800;
  return Array.from({ length: 8 }, (_, i) => ({
    id: `BUS${200 + i}`,
    operator: operators[i % operators.length],
    busNumber: `KA${10 + i}F${1000 + i}`,
    from, to, date,
    departure: `${6 + i * 2}:00`,
    arrival: `${14 + i}:30`,
    duration: `${8 + i % 3}h 30m`,
    type: busType,
    pricePerSeat: priceBase + i * 100,
    totalPrice: (priceBase + i * 100) * Number(passengers),
    availableSeats: 20 - i * 2,
    amenities: busType.includes('AC') ? ['AC', 'Water Bottle', 'Blanket', 'Charging Point'] : ['Fan', 'Water Bottle'],
    rating: (3.5 + Math.random()).toFixed(1),
    boarding: `${from} Central Bus Terminal`,
    dropping: `${to} Bus Stand`
  }));
}

// METRO
metroRouter.get('/stations', async (req, res) => {
  const { city = 'Delhi', keyword } = req.query;
  const metroData = {
    Delhi: ['Rajiv Chowk', 'Kashmere Gate', 'Central Secretariat', 'Huda City Centre', 'Dwarka Sector 21', 'Noida Electronic City', 'Vaishali', 'Dilshad Garden'],
    Mumbai: ['Versova', 'Andheri', 'Ghatkopar', 'BKC', 'Mankhurd', 'Wadala', 'Thane'],
    Hyderabad: ['Miyapur', 'Ameerpet', 'Hitech City', 'Raidurg', 'LB Nagar', 'Falaknuma'],
    Bangalore: ['Baiyappanahalli', 'MG Road', 'Lalbagh', 'Silk Board', 'Kengeri', 'Whitefield', 'Cubbon Park'],
    Chennai: ['Chennai Central', 'Egmore', 'Guindy', 'Airport', 'St. Thomas Mount'],
  };
  let stations = (metroData[city] || metroData.Delhi).map((s, i) => ({ id: i + 1, name: s, city, line: i < 4 ? 'Blue' : i < 7 ? 'Yellow' : 'Green' }));
  if (keyword) stations = stations.filter(s => s.name.toLowerCase().includes(keyword.toLowerCase()));
  res.json({ success: true, data: stations });
});

metroRouter.get('/fare', protect, async (req, res) => {
  const { from, to, city = 'Delhi', passType = 'single' } = req.query;
  const fares = { single: 30 + Math.floor(Math.random() * 50), return: 55 + Math.floor(Math.random() * 80), day: 150, weekly: 700 };
  res.json({ success: true, data: { from, to, city, passType, fare: fares[passType], currency: 'INR' } });
});

metroRouter.get('/route', async (req, res) => {
  const { from, to, city = 'Delhi' } = req.query;
  res.json({
    success: true,
    data: {
      from, to, city,
      stations: [from, 'Interchange Station', to],
      totalTime: `${8 + Math.floor(Math.random() * 15)} minutes`,
      distance: `${3 + Math.floor(Math.random() * 20)} km`,
      fare: 30 + Math.floor(Math.random() * 50),
      transfers: Math.floor(Math.random() * 2)
    }
  });
});

module.exports = { trainRouter, busRouter, metroRouter };
