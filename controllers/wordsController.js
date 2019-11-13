const {Word, Story} = require("../models");
const {getWordError} = require("../helpers/wordErrors");

const WordController = {
    async show(req, res) {
        const word = await Word.find(req.params.wordId);
        res.send({word}).status(200);
    },
    async write(req, res) {
        try {
            const story = await Story.findById(req.params.storyId);
            const wordError = getWordError(req.query.word, story.rules);
            if(wordError) {
                throw new Error({error: wordError});
            }

            const word = new Word({
                word: req.query.word,
                author: req.query.author ? req.query.author : undefined,
                story: req.params.storyId,
            });

            await word.save();
            console.log(story);

            story.words.push(word._id);
            story.length += 1;

            console.log("saved2");

            await story.save();
            console.log("saved2");

            res.send({word}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
};

module.exports = WordController;