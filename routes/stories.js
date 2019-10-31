const express = require('express');
const router = new express.Router();
const { Story } = require('../models');

router.get('/stories', async (req, res) => {
    // return all stories
    try {
        const stories = await Story.find({});
        res.send({stories}).status(200);
    } catch(error) {
        res.send({error}).status(500);
    }
});

router.post('/stories/create', async (req, res) => {
    // create a new story
    try {
        const story = new Story({
            name: req.query.name,
            description: req.query.description,
            words: [],
        });

        await story.save();
        res.send({response: story}).status(200);
    } catch(error) {
        console.log("hella broke");
        res.send({error}).status(400);
    };
});

router.post('/stories/delete', (req, res) => {
    // delete a story
    res.send({response: "deleted this stuff"}).status(200);
});

module.exports = router;