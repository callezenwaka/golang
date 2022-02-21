'use strict';

// import packages and dependencies
// const { deleteFile, sendUploadToGCS, multer } = require('../lib/files');
const nft = require('../controllers/nft');
const express = require('express');
const router = express();

router.get('/', nft.getAll);

// router.post('/', isSuperagent('create'), agent.postOne);

// router.post('/image', isAgent('create'), multer.single('file'), deleteFile, sendUploadToGCS, agent.postImage);
 
// router.put('/:id', isAgent('update'), agent.updateOne);
 
// router.get('/:id', isAgent('read'), agent.getOne);
 
// router.delete('/:id', isSuperagent('delete'), agent.deleteOne);
 
module.exports = router;