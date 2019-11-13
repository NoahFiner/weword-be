const express = require('express');
const router = new express.Router();
const { Story } = require('../models');

const StoriesController = require('../controllers/storiesController');

router.get('/stories', StoriesController.index);
router.get('/stories/:id', StoriesController.show);
router.delete('/stories/:id', StoriesController.delete);
router.post('/stories/create', StoriesController.create);

module.exports = router;