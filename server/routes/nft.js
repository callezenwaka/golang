'use strict';

// import packages and dependencies
const { authenticate } = require('../utils/auth');
const { multer } = require('../utils/files');
const nft = require('../controllers/nft');
const express = require('express');
const router = express();

router.get('/', nft.getAll);

router.get('/asset', authenticate, nft.getAsset);

router.get('/market', authenticate, nft.getMarket);

router.post('/', authenticate, nft.postOne);

router.post('/image', authenticate, multer.single('file'), nft.postImage);

router.get('/:id', authenticate, nft.getOne);
 
module.exports = router;