'use strict';

// import packages and dependencies
const auth = require('../controllers/auth');
const { authenticate } = require('../utils/auth');
const express = require('express');
const router = express();

router.post('/refresh', auth.refresh);
 
router.post('/login', auth.login);
 
router.post('/logout', authenticate, auth.logout);
 
module.exports = router;