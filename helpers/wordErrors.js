const baseErrorJSON = {
    minLength: 1,
    maxLength: 50,
    minWords: 1,
    maxWords: 1,
    bannedCharacters: [],
    bannedWords: [],
};

const getWordError = (word, errorJSON) => {
    if("minLength" in errorJSON && word.length < errorJSON.minLength) {
        return "word is shorter than minimum length of " + errorJSON.minLength;
    }
    if("maxLength" in errorJSON && word.length > errorJSON.maxLength) {
        return "word is longer than maximum length of " + errorJSON.maxLength;
    }
    if("minWords" in errorJSON && word.split(' ').length < errorJSON.minWords) {
        return "submission has less words than " + errorJSON.minWords;
    }
    if("maxWords" in errorJSON && word.split(' ').length > errorJSON.maxWords) {
        return "submission has more words than " + errorJSON.maxWords;
    }
  
    lowerCaseWord = word.toLowerCase();
    if("bannedCharacters" in errorJSON && errorJSON.bannedCharacters.some(char => lowerCaseWord.includes(char.toLowerCase()))) {
        return "submission contains restricted character";
    }
    if("bannedWords" in errorJSON && errorJSON.bannedWords.some(bannedWord => lowerCaseWord.split(' ').some(compWord => compWord === bannedWord.toLowerCase()))) {
        return "submission contains restricted words";
    }
    return null;
};

module.exports = {
    baseErrorJSON,
    getWordError,
}