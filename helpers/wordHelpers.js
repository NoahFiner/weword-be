const {Word, Story} = require("../models");
const { getWordError } = require("./wordErrors");

const writeWord = async (storyId, wordText, author) => {
    const story = await Story.findById(storyId);
    const wordError = getWordError(wordText, story.rules);
    if(wordError) {
        throw new Error({error: wordError});
    }

    const word = new Word({
        word: wordText,
        author: author ? author : undefined,
        story: storyId,
    });

    await word.save();

    story.words.push(word._id);
    story.length += 1;

    await story.save();

    return word;
}

const getWords = async (storyId) => {
    const story = await Story.findById(storyId).populate('words');
    if(!story) throw new Error("No stories found");
    return story.words;
}

module.exports = {
    writeWord,
    getWords
}