'use strict';

// Import packages and dependencies
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  // no larger than 5mb
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
	multer,
};