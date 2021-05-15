const express = require('express');
const router = express.Router();
const airport = require('./services/airport');

router.get('',airport.airportData)
router.post('/service', airport.services)
router.post('/insert-email', airport.insertEmail)

module.exports = router;