const express = require('express');
const router = express.Router();
const mainService = require('./services/main');
const sessionMiddleware = require('./utils/middleware');
// router.use(sessionMiddleware);
router.get('/main',mainService.getData)

module.exports = router;
