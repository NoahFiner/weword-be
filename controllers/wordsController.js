const {Word} = require("../models");
const {writeWord} = require("../helpers/wordHelpers");

const WordController = {
    async show(req, res) {
        try {
            const word = await Word.find(req.params.wordId);
            res.send({word}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    async write(req, res) {
        try {
            const result = await writeWord(req.params.storyId, req.query.word);
            res.send({result}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
};

module.exports = WordController;