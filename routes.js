const express = require('express');
const router = express.Router();
const airport = require('./services/airport');
const sessionMiddleware = require('./utils/middleware');
// router.use(sessionMiddleware);
router.get('/main',airport.airportData)
router.get('/login',airport.loginPage)
router.post('/logged-in',airport.loggedIn)
router.post('/register',airport.register)
router.post('/service', airport.services)
router.get('/equipment',airport.equipPage)
router.post('/equipment-record',airport.equipmentRecord)
router.post('/save-record',airport.saveRecord)
router.post('/insert-email', airport.insertEmail)

module.exports = router;
