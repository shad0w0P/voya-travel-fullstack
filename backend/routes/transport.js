const express = require('express');
const router = express.Router();
const { searchFlights, searchTrains, searchBuses, getMetroInfo } = require('../controllers/transportController');

router.get('/flights', searchFlights);
router.get('/trains', searchTrains);
router.get('/buses', searchBuses);
router.get('/metro', getMetroInfo);
module.exports = router;
