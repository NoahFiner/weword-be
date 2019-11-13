const express = require('express');
const router = new express.Router();

const WordController = require('../controllers/wordsController');

// route.post('/stories/:storyId/write', WordController.create);
router.post('/stories/:storyId/write', WordController.write);
router.get('/stories/:storyId/:wordId', WordController.show);

module.exports = router;