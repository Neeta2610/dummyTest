const express = require('express');
const router = express.Router();
const airport = require('./services/airport');

router.get('/main',airport.airportData)
router.get('',airport.loginPage)
router.post('/logged-in',airport.loggedIn)
router.post('/register',airport.register)
router.post('/service', airport.services)
router.post('/insert-email', airport.insertEmail)

module.exports = router;