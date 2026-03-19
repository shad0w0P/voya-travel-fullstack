const axios = require('axios');

// Uses Amadeus API for flights/trains. Falls back to mock data.
const AMADEUS_BASE = 'https://test.api.amadeus.com';
let amadeusToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
  if (amadeusToken && tokenExpiry > Date.now()) return amadeusToken;
  try {
    const res = await axios.post(`${AMADEUS_BASE}/v1/security/oauth2/token`,
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    amadeusToken = res.data.access_token;
    tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
    return amadeusToken;
  } catch { return null; }
};

exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, adults = 1, returnDate } = req.query;
    const token = await getAmadeusToken();
    if (token && process.env.AMADEUS_API_KEY) {
      const params = { originLocationCode: origin, destinationLocationCode: destination, departureDate: date, adults, currencyCode: 'USD', max: 20 };
      if (returnDate) params.returnDate = returnDate;
      const response = await axios.get(`${AMADEUS_BASE}/v2/shopping/flight-offers`, { headers: { Authorization: `Bearer ${token}` }, params });
      return res.json({ success: true, data: response.data.data, source: 'amadeus' });
    }
    // Mock fallback
    res.json({ success: true, data: getMockFlights(origin, destination, date), source: 'mock' });
  } catch (err) {
    res.json({ success: true, data: getMockFlights(req.query.origin, req.query.destination, req.query.date), source: 'mock' });
  }
};

exports.searchTrains = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    // Uses Indian Railways open data / IRCTC API pattern or mock
    res.json({ success: true, data: getMockTrains(origin, destination, date), source: 'mock', note: 'Integrate with RailYatri/IRCTC API for live data' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchBuses = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    res.json({ success: true, data: getMockBuses(origin, destination, date), source: 'mock', note: 'Integrate with RedBus/Abhibus API for live data' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMetroInfo = async (req, res) => {
  try {
    const { city } = req.query;
    const metroData = {
      delhi: { lines: ['Red', 'Yellow', 'Blue', 'Green', 'Violet', 'Pink', 'Magenta', 'Grey', 'Aqua', 'Orange', 'Rapid Metro'], fare: 'INR 10-60', timing: '5:30AM - 11:30PM' },
      mumbai: { lines: ['Line 1 (Versova-Andheri-Ghatkopar)', 'Line 2A', 'Line 7'], fare: 'INR 10-50', timing: '5:30AM - 11PM' },
      bangalore: { lines: ['Purple Line', 'Green Line'], fare: 'INR 10-55', timing: '5AM - 11PM' },
      hyderabad: { lines: ['Red Line', 'Blue Line', 'Green Line'], fare: 'INR 10-60', timing: '6AM - 11PM' },
      kolkata: { lines: ['Blue Line (North-South)', 'East-West Metro'], fare: 'INR 5-25', timing: '6:45AM - 9:45PM' }
    };
    const key = city?.toLowerCase();
    res.json({ success: true, data: metroData[key] || { message: 'Metro info not available for this city', availableCities: Object.keys(metroData) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mock Data Generators
function getMockFlights(origin, dest, date) {
  const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'Emirates', 'Qatar Airways'];
  return Array.from({ length: 6 }, (_, i) => ({
    id: `FL${Date.now()}${i}`,
    airline: airlines[i % airlines.length],
    flightNumber: `${airlines[i % airlines.length].substring(0,2).toUpperCase()}${100 + i * 47}`,
    origin, destination: dest, date,
    departure: `${6 + i * 2}:${i % 2 === 0 ? '00' : '30'}`,
    arrival: `${9 + i * 2}:${i % 2 === 0 ? '30' : '00'}`,
    duration: `${2 + (i % 3)}h ${i % 2 === 0 ? '30' : '00'}m`,
    price: 3500 + i * 1200,
    currency: 'INR',
    class: i % 3 === 0 ? 'Business' : 'Economy',
    stops: i % 4 === 0 ? 1 : 0,
    seatsLeft: 2 + i * 3
  }));
}

function getMockTrains(origin, dest, date) {
  const trains = ['Rajdhani Express', 'Shatabdi Express', 'Duronto', 'Vande Bharat', 'Humsafar', 'Tejas Express'];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `TR${Date.now()}${i}`,
    name: trains[i % trains.length],
    number: `1200${i + 1}`,
    origin, destination: dest, date,
    departure: `${5 + i * 3}:${i % 2 === 0 ? '00' : '45'}`,
    arrival: `${12 + i * 2}:${i % 2 === 0 ? '30' : '15'}`,
    duration: `${7 + i}h ${i % 2 === 0 ? '30' : '15'}m`,
    classes: [
      { type: 'Sleeper', price: 450 + i * 100, available: 20 + i },
      { type: '3A', price: 900 + i * 150, available: 10 + i },
      { type: '2A', price: 1400 + i * 200, available: 5 + i },
      { type: '1A', price: 2500 + i * 300, available: 2 + i }
    ],
    runningDays: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun'
  }));
}

function getMockBuses(origin, dest, date) {
  const operators = ['RedBus', 'KSRTC', 'TSRTC', 'UPSRTC', 'Neeta Tours', 'Orange Travels'];
  return Array.from({ length: 6 }, (_, i) => ({
    id: `BUS${Date.now()}${i}`,
    operator: operators[i % operators.length],
    busType: ['AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Seater', 'Volvo Multi-Axle'][i % 4],
    origin, destination: dest, date,
    departure: `${18 + (i % 6)}:00`,
    arrival: `${6 + (i % 4)}:00 (+1)`,
    duration: `${8 + i}h 00m`,
    price: 600 + i * 200,
    currency: 'INR',
    seatsLeft: 5 + i * 2,
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'].slice(0, 2 + (i % 3)),
    rating: (3.5 + i * 0.2).toFixed(1)
  }));
}
