const express = require('express');
const router = express.Router();
const mainService = require('./services/main');
const sessionMiddleware = require('./utils/middleware');
// router.use(sessionMiddleware);
router.get('/main',mainService.getData)
// router.post('/login',mainService.login)
// router.post('/register',mainService.register)

module.exports = router;
