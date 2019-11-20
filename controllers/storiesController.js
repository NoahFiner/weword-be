const {Story} = require("../models");

const StoriesController = {
    async index(req, res) {
        const stories = await Story.find();
        res.send({stories}).status(200);
    },
    async show(req, res) {
        try {
            const story = await Story.findById(req.params.id).populate('words');
            if(!story) throw new Error("No stories found");
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    async create(req, res) {
        try {
            console.log("tryna make new story");
            console.log(req);
            const story = new Story({
                name: req.query.name,
                description: req.query.description,
                words: [],
            });
    
            await story.save();
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    async delete(req, res) {
        try {
            const story = await Story.findById(req.params.id);
            story.remove();
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    // TODO: add a clear function
}

module.exports = StoriesController;