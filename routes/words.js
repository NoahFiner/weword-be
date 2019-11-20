const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');

const WordController = require('../controllers/wordsController');

router.post('/stories/:storyId/write', WordController.write);
router.get('/stories/:storyId/:wordId', WordController.show);

module.exports = router;